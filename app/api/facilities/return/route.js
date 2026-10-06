import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { recordFacilityUsage } from "@/lib/facilityUsage";

export async function POST(request) {
  const body = await request.json();
  const { facility_id, sid } = body;

  if (!facility_id || !sid) {
    return NextResponse.json(
      { error: "Missing facility_id or sid." },
      { status: 400 }
    );
  }

  const { data: facility, error: facilityError } = await supabaseAdmin
    .from("facilities")
    .select("id, item, status, last_borrower_sid, last_borrowed_at")
    .eq("id", facility_id)
    .single();

  if (facilityError || !facility) {
    return NextResponse.json({ error: "Facility not found." }, { status: 404 });
  }

  if (facility.status !== "CHECKED_OUT") {
    return NextResponse.json(
      { error: "This facility is not currently checked out." },
      { status: 409 }
    );
  }

  if (facility.last_borrower_sid !== sid) {
    return NextResponse.json(
      { error: "This facility was checked out by a different SID." },
      { status: 403 }
    );
  }

  const { data: updated, error: updateError } = await supabaseAdmin
    .from("facilities")
    .update({
      status: "AVAILABLE",
      last_returned_at: new Date().toISOString(),
      reminder_sent_at: null,
    })
    .eq("id", facility_id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  const minutesElapsed = Math.round(
    (Date.now() - new Date(facility.last_borrowed_at).getTime()) / 60000
  );
  await recordFacilityUsage(supabaseAdmin, sid, facility.item, minutesElapsed);

  return NextResponse.json({ facility: updated });
}
