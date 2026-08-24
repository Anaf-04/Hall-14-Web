import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request) {
  const body = await request.json();
  const { vacuum_id, sid } = body;

  if (!vacuum_id || !sid) {
    return NextResponse.json(
      { error: "Missing vacuum_id or sid." },
      { status: 400 }
    );
  }

  const { data: vacuum, error: vacuumError } = await supabaseAdmin
    .from("vacuums")
    .select("id, status, last_borrower_sid")
    .eq("id", vacuum_id)
    .single();

  if (vacuumError || !vacuum) {
    return NextResponse.json({ error: "Vacuum not found." }, { status: 404 });
  }

  if (vacuum.status !== "CHECKED_OUT") {
    return NextResponse.json(
      { error: "This vacuum is not currently checked out." },
      { status: 409 }
    );
  }

  if (vacuum.last_borrower_sid !== sid) {
    return NextResponse.json(
      { error: "This vacuum was checked out by a different SID." },
      { status: 403 }
    );
  }

  const { data: updated, error: updateError } = await supabaseAdmin
    .from("vacuums")
    .update({
      status: "AVAILABLE",
      last_returned_at: new Date().toISOString(),
      reminder_sent_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", vacuum_id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ vacuum: updated });
}
