"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SiteMenu from "../components/SiteMenu";
import RegisterForm from "../components/RegisterForm";
import LoadingScreen from "../components/LoadingScreen";

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const facilityId = searchParams.get("v");
  const nfcKey = searchParams.get("key");

  async function registerAndBorrow({ sid, email, phone_number }) {
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/facilities/borrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ facility_id: facilityId, key: nfcKey, sid, email, phone_number }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      localStorage.setItem("hall14_sid", sid);
      localStorage.setItem("hall14_email", email);
      localStorage.setItem("hall14_phone", phone_number);
      router.replace("/facilities");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex w-[90%] flex-col items-center gap-6 py-24 sm:w-[85%]">
      {facilityId && nfcKey ? (
        <RegisterForm facilityLabel="facility" onSubmit={registerAndBorrow} submitting={submitting} error={error} />
      ) : (
        <p className="rounded-tl-3xl rounded-br-3xl bg-black/70 p-6 text-white">Scan a facility NFC sticker to register.</p>
      )}
    </main>
  );
}

export default function RegisterPage() {
  return (
    <SiteMenu>
      <Suspense fallback={<LoadingScreen />}>
        <RegisterPageContent />
      </Suspense>
    </SiteMenu>
  );
}
