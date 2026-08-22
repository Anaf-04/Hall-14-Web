import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request) {
  const body = await request.json();
  const { vacuum_id, key } = body;

  if (!vacuum_id || !key) {
    return NextResponse.json(
      { error: "Missing vacuum_id or key." },
      { status: 400 }
    );
  }

  const { data: vacuum, error: vacuumError } = await supabaseAdmin
    .from("vacuums")
    .select(
      "id, floor, status, nfc_secret_key, resident:borrower_sid(room_number)"
    )
    .eq("id", vacuum_id)
    .single();

  if (vacuumError || !vacuum) {
    return NextResponse.json({ error: "Vacuum not found." }, { status: 404 });
  }

  if (vacuum.nfc_secret_key !== key) {
    return NextResponse.json({ valid: false });
  }

  return NextResponse.json({
    valid: true,
    floor: vacuum.floor,
    status: vacuum.status,
    roomNumber: vacuum.resident?.room_number ?? null,
  });
}
