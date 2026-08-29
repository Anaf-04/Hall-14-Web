import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request) {
  const body = await request.json();
  const { facility_id, sid, key, email, phone_number } = body;

  if (!facility_id || !sid || !key) {
    return NextResponse.json(
      { error: "Missing facility_id, sid, or key." },
      { status: 400 }
    );
  }

  const { data: facility, error: facilityError } = await supabaseAdmin
    .from("facilities")
    .select("id, status, nfc_secret_key")
    .eq("id", facility_id)
    .single();

  if (facilityError || !facility) {
    return NextResponse.json({ error: "Facility not found." }, { status: 404 });
  }

  if (facility.nfc_secret_key !== key) {
    return NextResponse.json(
      {
        error: "Tap the facility's NFC sticker to borrow it.",
      },
      { status: 403 }
    );
  }

  if (facility.status === "CHECKED_OUT") {
    return NextResponse.json(
      { error: "This facility is already checked out." },
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
    .from("facilities")
    .update({
      status: "CHECKED_OUT",
      last_borrower_sid: sid,
      last_borrowed_at: new Date().toISOString(),
      reminder_sent_at: null,
    })
    .eq("id", facility_id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ facility: updated });
}
