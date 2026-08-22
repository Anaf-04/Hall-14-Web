import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request) {
  const body = await request.json();
  const { sid, code } = body;

  if (!sid || !code) {
    return NextResponse.json({ error: "Missing sid or code." }, { status: 400 });
  }

  const { data: resident, error: residentError } = await supabaseAdmin
    .from("residents")
    .select("sid, otp_code, otp_expires_at")
    .eq("sid", sid)
    .single();

  if (residentError || !resident) {
    return NextResponse.json({ error: "Resident not found." }, { status: 404 });
  }

  if (!resident.otp_code || resident.otp_code !== code) {
    return NextResponse.json({ error: "Incorrect code." }, { status: 400 });
  }

  if (new Date(resident.otp_expires_at) < new Date()) {
    return NextResponse.json({ error: "Code expired. Request a new one." }, { status: 400 });
  }

  const { error: updateError } = await supabaseAdmin
    .from("residents")
    .update({ otp_code: null, otp_expires_at: null })
    .eq("sid", sid);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ verified: true });
}
