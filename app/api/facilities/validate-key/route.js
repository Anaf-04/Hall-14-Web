import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request) {
  const body = await request.json();
  const { facility_id, key } = body;

  if (!facility_id || !key) {
    return NextResponse.json(
      { error: "Missing facility_id or key." },
      { status: 400 }
    );
  }

  const { data: facility, error: facilityError } = await supabaseAdmin
    .from("facilities")
    .select(
      "id, item, floor, status, nfc_secret_key, resident:last_borrower_sid(room_number)"
    )
    .eq("id", facility_id)
    .single();

  if (facilityError || !facility) {
    return NextResponse.json({ error: "Facility not found." }, { status: 404 });
  }

  if (facility.nfc_secret_key !== key) {
    return NextResponse.json({ valid: false });
  }

  return NextResponse.json({
    valid: true,
    item: facility.item,
    floor: facility.floor,
    status: facility.status,
    roomNumber: facility.resident?.room_number ?? null,
  });
}
