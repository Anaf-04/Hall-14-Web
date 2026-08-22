import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request) {
  const body = await request.json();
  const { vacuum_id, sid, key, email, phone_number } = body;

  if (!vacuum_id || !sid || !key) {
    return NextResponse.json(
      { error: "Missing vacuum_id, sid, or key." },
      { status: 400 }
    );
  }

  const { data: vacuum, error: vacuumError } = await supabaseAdmin
    .from("vacuums")
    .select("id, status, nfc_secret_key")
    .eq("id", vacuum_id)
    .single();

  if (vacuumError || !vacuum) {
    return NextResponse.json({ error: "Vacuum not found." }, { status: 404 });
  }

  if (vacuum.nfc_secret_key !== key) {
    return NextResponse.json(
      {
        error: "Tap the vacuum's NFC sticker to borrow it.",
      },
      { status: 403 }
    );
  }

  if (vacuum.status === "CHECKED_OUT") {
    return NextResponse.json(
      { error: "This vacuum is already checked out." },
      { status: 409 }
    );
  }

  const { data: resident, error: residentError } = await supabaseAdmin
    .from("residents")
    .select("sid, email, phone_number")
    .eq("sid", sid)
    .single();

  if (residentError || !resident) {
    return NextResponse.json(
      {
        error:
          "SID NOT FOUND ! Only for Hall 14 Residents !",
      },
      { status: 404 }
    );
  }

  // First-time device registration: fill in email/phone once, don't
  // overwrite values already on file with blanks from a stale form.
  if (
    (email && email !== resident.email) ||
    (phone_number && phone_number !== resident.phone_number)
  ) {
    await supabaseAdmin
      .from("residents")
      .update({
        ...(email ? { email } : {}),
        ...(phone_number ? { phone_number } : {}),
      })
      .eq("sid", sid);
  }

  const { data: updated, error: updateError } = await supabaseAdmin
    .from("vacuums")
    .update({
      status: "CHECKED_OUT",
      borrower_sid: sid,
      checked_out_at: new Date().toISOString(),
      reminder_sent_at: null,
    })
    .eq("id", vacuum_id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ vacuum: updated });
}
