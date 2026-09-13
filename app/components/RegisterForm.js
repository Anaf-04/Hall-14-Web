"use client";

import { useState } from "react";
import Image from "next/image";

export default function RegisterForm({ facilityLabel, onSubmit, submitting, error }) {
  const [step, setStep] = useState("details"); // "details" | "otp"
  const [sid, setSid] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState(null);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  async function handleDetailsSubmit(event) {
    event.preventDefault();
    setOtpError(null);
    setSendingOtp(true);
    try {
      const response = await fetch("/api/residents/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sid: sid.trim(), email: email.trim() }),
      });
      const data = await response.json();
      if (!response.ok) {
        setOtpError(data.error || "Something went wrong.");
        return;
      }
      if (data.alreadyVerified) {
        onSubmit({ sid: sid.trim(), email: email.trim(), phone_number: phone.trim() });
        return;
      }
      setStep("otp");
    } catch {
      setOtpError("Network error. Please try again.");
    } finally {
      setSendingOtp(false);
    }
  }

  async function handleOtpSubmit(event) {
    event.preventDefault();
    setOtpError(null);
    setVerifyingOtp(true);
    try {
      const response = await fetch("/api/residents/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sid: sid.trim(), code: otp.trim() }),
      });
      const data = await response.json();
      if (!response.ok) {
        setOtpError(data.error || "Something went wrong.");
        return;
      }
      onSubmit({ sid: sid.trim(), email: email.trim(), phone_number: phone.trim() });
    } catch {
      setOtpError("Network error. Please try again.");
    } finally {
      setVerifyingOtp(false);
    }
  }

  if (step === "otp") {
    return (
      <form onSubmit={handleOtpSubmit} className="grid grid-cols-1 gap-3 rounded-tl-3xl rounded-br-3xl bg-black/70 p-6 text-white sm:p-8">
        <p className="text-sm font-medium">
          Enter the 6-digit code sent to {email}.
        </p>
        <input
          type="text"
          inputMode="numeric"
          placeholder="6-digit code"
          value={otp}
          onChange={(event) => setOtp(event.target.value)}
          required
          pattern="\d{6}"
          maxLength={6}
          className="rounded-tl-3xl rounded-br-3xl border border-white/20 bg-black/40 px-3 py-2 text-center text-lg tracking-widest text-white placeholder:text-white/50"
        />
        {(otpError || error) && <p className="text-sm text-red-400">{otpError || error}</p>}
        <button type="submit" disabled={verifyingOtp || submitting} className="rounded-tl-3xl rounded-br-3xl bg-[#a35c00] px-4 py-2 text-sm text-white transition-colors hover:bg-[#8b0000] disabled:opacity-50">
          {verifyingOtp || submitting ? "Verifying..." : "Verify & Borrow"}
        </button>
        <button
          type="button"
          onClick={() => setStep("details")}
          className="text-xs text-white/60 underline"
        >
          Back
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleDetailsSubmit} className="grid grid-cols-1 gap-3 rounded-tl-3xl rounded-br-3xl bg-black/70 p-6 text-white sm:p-8">
      {facilityLabel?.split(" ")[0] === "Washer" || facilityLabel?.split(" ")[0] === "Dryer" ?
        <p className="text-sm font-medium">First time labelling the {facilityLabel}. Enter your details.</p>
        : <p className="text-sm font-medium">First time borrowing the {facilityLabel}. Enter your details.</p>
      }
      <input type="text" inputMode="numeric" placeholder="8-digit Student ID" value={sid} onChange={(event) => setSid(event.target.value)} required pattern="\d{8}" className="rounded-tl-3xl rounded-br-3xl border border-white/20 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/50" />
      <div className="flex items-stretch gap-2">
        <div className="flex w-[100px] shrink-0 items-center gap-2 rounded-tl-3xl rounded-br-3xl bg-black/90 px-2 py-2">
          <Image
            src="/icons/hong-kong.png"
            alt="Hong Kong flag"
            width={24}
            height={24}
            className="h-6 w-6 shrink-0 rounded-tl-3xl rounded-br-3xl object-cover"
          />
          <span className="text-sm text-white">+852</span>
        </div>
        <input type="tel" inputMode="tel" placeholder="12345678" value={phone} onChange={(event) => setPhone(event.target.value)} className="w-full rounded-tl-3xl rounded-br-3xl border border-white/20 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/50" />
      </div>
      <input type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} required className="rounded-tl-3xl rounded-br-3xl border border-white/20 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/50" />
      {(otpError || error) && <p className="text-sm text-red-400">{otpError || error}</p>}
      <button type="submit" disabled={sendingOtp || submitting} className="rounded-tl-3xl rounded-br-3xl bg-[#a35c00] px-4 py-2 text-sm text-white transition-colors hover:bg-[#8b0000] disabled:opacity-50">
        {sendingOtp ? "Continuing..." : "Continue"}
      </button>
    </form>
  );
}
