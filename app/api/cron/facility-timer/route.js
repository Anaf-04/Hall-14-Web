import { NextResponse } from "next/server";
import { transporter } from "@/lib/mailer";
import { supabaseAdmin } from "@/lib/supabase/server";

const TIMER_CONFIG = {
  PORTABLE_VACUUM: { reminderMs: 10 * 60 * 1000, autoReturnMs: 15 * 60 * 1000 },
  PS5_CONTROLLER: { reminderMs: 60 * 60 * 1000, autoReturnMs: null },
  SHOE_WASHER_KEY: { reminderMs: 60 * 60 * 1000, autoReturnMs: null },
  NINTENDO_SWITCH: { reminderMs: 60 * 60 * 1000, autoReturnMs: null },
  TABLE_TENNIS_SET: { reminderMs: 60 * 60 * 1000, autoReturnMs: null },
};

const ITEM_LABELS = {
  PORTABLE_VACUUM: "vacuum",
  PS5_CONTROLLER: "PS5 controller",
  SHOE_WASHER_KEY: "Shoe Washer Key",
  NINTENDO_SWITCH: "Nintendo Switch",
  TABLE_TENNIS_SET: "table tennis set",
};

const ITEM_URL = {
  PORTABLE_VACUUM: "https://hall-14-web.vercel.app/all-vacuum",
  PS5_CONTROLLER: "https://hall-14-web.vercel.app/ps5Controller",
  SHOE_WASHER_KEY: "https://hall-14-web.vercel.app/shoeWasherKey",
  NINTENDO_SWITCH: "https://hall-14-web.vercel.app/nintendoSwitch",
  TABLE_TENNIS_SET: "https://hall-14-web.vercel.app/tableTennis",
};

function facilityLabel(facility) {
  const label = ITEM_LABELS[facility.item] ?? "facility";
  return facility.floor != null ? `Floor ${facility.floor} ${label}` : label;
}

// Called every few minutes by Supabase pg_cron (see docs/CronSetup.sql).
// Per item type, once REMINDER_AFTER_MS elapses: email the borrower a
// reminder. If the item type also has an AUTO_RETURN_AFTER_MS, force it
// back to AVAILABLE once that elapses too.
export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    console.log("[facility-timer] Starting cron job");

    const now = Date.now();

    const { data: checkedOut, error } = await supabaseAdmin
      .from("facilities")
      .select("id, item, floor, last_borrower_sid, last_borrowed_at, reminder_sent_at")
      .eq("status", "CHECKED_OUT");

    if (error) {
      console.error("[facility-timer] Database query error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("[facility-timer] Found checked out facilities:", checkedOut?.length || 0);

    const toRemind = [];
    const toAutoReturn = [];

    for (const f of checkedOut) {
      const config = TIMER_CONFIG[f.item];
      if (!config) continue;

      const elapsed = now - new Date(f.last_borrowed_at).getTime();
      if (config.autoReturnMs != null && elapsed >= config.autoReturnMs) {
        toAutoReturn.push(f);
      } else if (elapsed >= config.reminderMs && !f.reminder_sent_at) {
        toRemind.push(f);
      }
    }

    console.log("[facility-timer] Facilities to remind:", toRemind.length, "to auto-return:", toAutoReturn.length);

    if (toRemind.length > 0) {
      const sids = toRemind.map((f) => f.last_borrower_sid);
      const { data: residents, error: residentsError } = await supabaseAdmin
        .from("residents")
        .select("sid, email, name")
        .in("sid", sids);

      if (residentsError) {
        console.error("[facility-timer] Error fetching residents:", residentsError);
      }

      const emailBySid = new Map(
        (residents ?? []).map((r) => [r.sid, r.email])
      );

      for (const f of toRemind) {
        const email = emailBySid.get(f.last_borrower_sid);
        if (email) {
          const label = facilityLabel(f);
          const minutes = Math.round(TIMER_CONFIG[f.item].reminderMs / 60000);
          const url = ITEM_URL[f.item] ?? "https://hall-14-web.vercel.app/facilities";
          try {
            await transporter.sendMail({
              from: `Hall 14 Facilities <${process.env.GMAIL_USER}>`,
              to: email,
              subject: `Please return the ${label}`,
              text: `You've had the ${label} for ${minutes} minutes. Visit ${url} and click Return. Thank you!`,
            });
            console.log("[facility-timer] Reminder email sent to", email);
          } catch (emailError) {
            console.error(`[facility-timer] Failed to send reminder for facility ${f.id}:`, emailError);
          }
        }

        const { error: updateError } = await supabaseAdmin
          .from("facilities")
          .update({ reminder_sent_at: new Date().toISOString() })
          .eq("id", f.id);

        if (updateError) {
          console.error(`[facility-timer] Failed to update reminder_sent_at for facility ${f.id}:`, updateError);
        } else {
          console.log(`[facility-timer] Updated reminder_sent_at for facility ${f.id}`);
        }
      }
    }

    if (toAutoReturn.length > 0) {
      console.log("[facility-timer] Auto-returning", toAutoReturn.length, "facilities");
      const { error: autoReturnError } = await supabaseAdmin
        .from("facilities")
        .update({
          status: "AVAILABLE",
          last_returned_at: new Date().toISOString(),
          reminder_sent_at: null,
        })
        .in(
          "id",
          toAutoReturn.map((f) => f.id)
        );

      if (autoReturnError) {
        console.error("[facility-timer] Error auto-returning facilities:", autoReturnError);
      } else {
        console.log("[facility-timer] Successfully auto-returned facilities");
      }
    }

    console.log("[facility-timer] Job completed successfully");
    return NextResponse.json({
      reminded: toRemind.length,
      autoReturned: toAutoReturn.length,
    });
  } catch (err) {
    console.error("[facility-timer] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error", details: err.message }, { status: 500 });
  }
}
