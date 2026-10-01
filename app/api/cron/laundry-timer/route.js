import { NextResponse } from "next/server";
import { transporter } from "@/lib/mailer";
import { supabaseAdmin } from "@/lib/supabase/server";

const GRACE_MS = 2 * 60 * 1000;

function parseLaundryItem(item) {
  const [prefix, id] = item.split("_");
  return { type: prefix === "Washer" ? "W" : "D", id };
}

// Called every minute by Supabase pg_cron (see docs/CronSetup.sql). Unlike
// facility-timer, a laundry cycle's length isn't a fixed offset — it's
// whatever CityU's live laundry API reports for that specific machine right
// now. So each run: fetch the live status once, then for every checked-out
// washer/dryer, check whether its matching machine's "Left Time" has hit 0.
// If so, email the borrower and auto-return the facility (nothing else
// would ever flip it back to AVAILABLE otherwise).
export async function POST(request) { 
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    console.log("[laundry-timer] Starting cron job");

    const { data: checkedOut, error } = await supabaseAdmin
      .from("facilities")
      .select("id, item, last_borrower_sid, last_borrowed_at")
      .eq("status", "CHECKED_OUT");

    if (error) {
      console.error("[laundry-timer] Database query error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Filter to only laundry items (Washer_XX and Dryer_XX)
    const laundryItems = (checkedOut || []).filter(f =>
      f.item && (f.item.startsWith("Washer_") || f.item.startsWith("Dryer_"))
    );

    console.log("[laundry-timer] Found checked out facilities:", checkedOut?.length || 0, "laundry items:", laundryItems.length);

    if (!laundryItems || laundryItems.length === 0) {
      return NextResponse.json({ finished: 0 });
    }

    const now = Date.now();
    const eligible = laundryItems.filter(
      (f) => now - new Date(f.last_borrowed_at).getTime() >= GRACE_MS
    );

    console.log("[laundry-timer] Eligible facilities (after grace period):", eligible.length);

    if (eligible.length === 0) {
      return NextResponse.json({ finished: 0 });
    }

    let machines;
    try {
      console.log("[laundry-timer] Fetching from CityU API...");
      const res = await fetch(
        "https://misc.cityu-sro.hk/WMStatus/WMStatus.aspx?HallNo=14",
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error("laundry API error");
      const data = await res.json();
      machines = Array.isArray(data) ? data : data.machines || [];
      console.log("[laundry-timer] Fetched machines:", machines.length, data);
    } catch (fetchError) {
      console.error("[laundry-timer] Fetch error:", fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 502 });
    }

    const finished = [];
    for (const f of eligible) {
      const { type, id } = parseLaundryItem(f.item);
      const machine = machines.find(
        (m) => m["Machine Type"] === type && m["Machine ID"] === id
      );
      if (!machine) continue;
      if (parseInt(machine["Left Time"], 10) === 0) {
        finished.push({ facility: f, type, id });
      }
    }

    console.log("[laundry-timer] Finished machines:", finished.length);

    if (finished.length > 0) {
      const sids = finished.map((f) => f.facility.last_borrower_sid);
      const { data: residents, error: residentsError } = await supabaseAdmin
        .from("residents")
        .select("sid, email")
        .in("sid", sids);

      if (residentsError) {
        console.error("[laundry-timer] Error fetching residents:", residentsError);
      }

      const emailBySid = new Map((residents ?? []).map((r) => [r.sid, r.email]));

      for (const { facility, type, id } of finished) {
        const email = emailBySid.get(facility.last_borrower_sid);
        if (email) {
          try {
            await transporter.sendMail({
              from: `Hall 14 Laundry Status <${process.env.GMAIL_USER}>`,
              to: email,
              subject:
                type === "W"
                  ? `Washer ${id} has finished its cycle`
                  : `Dryer ${id} has finished drying`,
              text: "Please pick up your clothes immediately. Happy Laundry Day.",
            });
            console.log("[laundry-timer] Email sent to", email);
          } catch (emailError) {
            console.error(`[laundry-timer] Failed to send laundry email for facility ${facility.id}:`, emailError);
          }
        }

        const { error: updateError } = await supabaseAdmin
          .from("facilities")
          .update({
            status: "AVAILABLE",
            last_returned_at: new Date().toISOString(),
            reminder_sent_at: null,
          })
          .eq("id", facility.id);

        if (updateError) {
          console.error(`[laundry-timer] Failed to update facility ${facility.id}:`, updateError);
        } else {
          console.log(`[laundry-timer] Updated facility ${facility.id} to AVAILABLE`);
        }
      }
    }

    console.log("[laundry-timer] Job completed successfully");
    return NextResponse.json({ finished: finished.length });
  } catch (err) {
    console.error("[laundry-timer] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error", details: err.message }, { status: 500 });
  }
}
