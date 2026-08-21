"use client";

import { useState } from "react";
import Image from "next/image";

export default function RegisterForm({ vacuumFloor, onSubmit, submitting, error }) {
  const [sid, setSid] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({ sid: sid.trim(), email: email.trim(), phone_number: phone.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 rounded-tl-3xl rounded-br-3xl bg-black/70 p-6 text-white sm:p-8">
      <p className="text-sm font-medium">
        First time borrowing the Floor {vacuumFloor} vacuum. Enter your details.
      </p>
      <input type="text" inputMode="numeric" placeholder="8-digit Student ID" value={sid} onChange={(event) => setSid(event.target.value)} required pattern="\d{8}" className="rounded-tl-3xl rounded-br-3xl border border-white/20 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/50" />
      <div className="flex items-stretch gap-2">
        <div className="flex w-[100px] shrink-0 items-center gap-2 rounded-tl-3xl rounded-br-3xl bg-black/90 px-2 py-2">
          <Image
            src="/img/hong-kong.png"
            alt="Hong Kong flag"
            width={24}
            height={24}
            className="h-6 w-6 shrink-0 rounded-tl-3xl rounded-br-3xl object-cover"
          />
          <span className="text-sm text-white">+852</span>
        </div>
        <input type="tel" inputMode="tel" placeholder="Hong Kong phone number" value={phone} onChange={(event) => setPhone(event.target.value)} required className="w-full rounded-tl-3xl rounded-br-3xl border border-white/20 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/50" />
      </div>
      <input type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} required className="rounded-tl-3xl rounded-br-3xl border border-white/20 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/50" />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button type="submit" disabled={submitting} className="rounded-tl-3xl rounded-br-3xl bg-[#a35c00] px-4 py-2 text-sm text-white transition-colors hover:bg-[#8b0000] disabled:opacity-50">
        {submitting ? "Borrowing..." : `Confirm Borrow Vacuum #${vacuumFloor}`}
      </button>
    </form>
  );
}
