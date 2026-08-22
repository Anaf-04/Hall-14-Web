import { NextResponse } from "next/server";
import { transporter } from "@/lib/mailer";
import { supabaseAdmin } from "@/lib/supabase/server";

const OTP_TTL_MS = 10 * 60 * 1000;

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(request) {
  const body = await request.json();
  const { sid, email } = body;

  if (!sid || !email) {
    return NextResponse.json({ error: "Missing sid or email." }, { status: 400 });
  }

  const { data: resident, error: residentError } = await supabaseAdmin
    .from("residents")
    .select("sid, email")
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

  // Already verified this exact email on a prior visit — skip the OTP step.
  if (resident.email && resident.email === email) {
    return NextResponse.json({ alreadyVerified: true });
  }

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString();

  const { error: updateError } = await supabaseAdmin
    .from("residents")
    .update({ otp_code: otp, otp_expires_at: expiresAt })
    .eq("sid", sid);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  try {
    await transporter.sendMail({
      from: `Hall 14 <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "First time Vacuum registration code",
      text: `Your verification code is ${otp}. It expires in 10 minutes.`,
    });
  } catch (emailError) {
    console.error("Failed to send OTP email:", emailError);
    return NextResponse.json(
      { error: "Failed to send verification email. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ sent: true });
}
