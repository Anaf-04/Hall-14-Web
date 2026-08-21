import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const REMINDER_AFTER_MS = 10 * 60 * 1000;
const AUTO_RETURN_AFTER_MS = 15 * 60 * 1000;

// Called every minute by Supabase pg_cron (see docs/CronSetup.sql).
// At 10 min checked out: email the borrower a reminder.
// At 15 min checked out: force the vacuum back to AVAILABLE.
export async function POST(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const now = Date.now();

  const { data: checkedOut, error } = await supabaseAdmin
    .from("vacuums")
    .select("id, floor, borrower_sid, checked_out_at, reminder_sent_at")
    .eq("status", "CHECKED_OUT");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const toRemind = [];
  const toAutoReturn = [];

  for (const v of checkedOut) {
    const elapsed = now - new Date(v.checked_out_at).getTime();
    if (elapsed >= AUTO_RETURN_AFTER_MS) {
      toAutoReturn.push(v);
    } else if (elapsed >= REMINDER_AFTER_MS && !v.reminder_sent_at) {
      toRemind.push(v);
    }
  }

  if (toRemind.length > 0) {
    const sids = toRemind.map((v) => v.borrower_sid);
    const { data: residents } = await supabaseAdmin
      .from("residents")
      .select("sid, email, name")
      .in("sid", sids);

    const emailBySid = new Map(
      (residents ?? []).map((r) => [r.sid, r.email])
    );

    for (const v of toRemind) {
      const email = emailBySid.get(v.borrower_sid);
      if (email) {
        try {
          await resend.emails.send({
            from: "Hall 14 Vacuums <onboarding@resend.dev>",
            to: email,
            subject: `Please return the Floor ${v.floor} vacuum`,
            text: `You've had the Floor ${v.floor} vacuum for 10 minutes. Please return it soon so other residents can use it.`,
          });
        } catch (emailError) {
          console.error(`Failed to send reminder for vacuum ${v.id}:`, emailError);
        }
      }

      await supabaseAdmin
        .from("vacuums")
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq("id", v.id);
    }
  }

  if (toAutoReturn.length > 0) {
    await supabaseAdmin
      .from("vacuums")
      .update({
        status: "AVAILABLE",
        borrower_sid: null,
        checked_out_at: null,
        reminder_sent_at: null,
      })
      .in(
        "id",
        toAutoReturn.map((v) => v.id)
      );
  }

  return NextResponse.json({
    reminded: toRemind.length,
    autoReturned: toAutoReturn.length,
  });
}
