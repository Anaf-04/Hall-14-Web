"use client";

import { useCallback, useEffect, useState } from "react";
import RegisterForm from "./RegisterForm";
import LoadingScreen from "./LoadingScreen";

const STORAGE_KEYS = {
  sid: "hall14_sid",
  email: "hall14_email",
  phone: "hall14_phone",
};

export default function BorrowVacuum({ vacuumId, nfcKey }) {
  const [checking, setChecking] = useState(true);
  const [keyValid, setKeyValid] = useState(false);
  const [floor, setFloor] = useState(null);
  const [vacuumStatus, setVacuumStatus] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [borrowing, setBorrowing] = useState(false);
  const [borrowError, setBorrowError] = useState(null);
  const [borrowed, setBorrowed] = useState(false);

  useEffect(() => {
    const sid = localStorage.getItem(STORAGE_KEYS.sid);
    const email = localStorage.getItem(STORAGE_KEYS.email);
    const phone = localStorage.getItem(STORAGE_KEYS.phone);
    if (sid) setIdentity({ sid, email, phone });
  }, []);

  useEffect(() => {
    async function validate() {
      try {
        const res = await fetch("/api/vacuums/validate-key", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vacuum_id: vacuumId, key: nfcKey }),
        });
        const data = await res.json();
        if (res.ok && data.valid) {
          setKeyValid(true);
          setFloor(data.floor);
          setVacuumStatus(data.status);
        } else {
          setKeyValid(false);
        }
      } catch {
        setKeyValid(false);
      } finally {
        setChecking(false);
      }
    }
    validate();
  }, [vacuumId, nfcKey]);

  const handleBorrow = useCallback(
    async (formValues) => {
      setBorrowing(true);
      setBorrowError(null);

      const sid = identity?.sid || formValues?.sid;
      const email = identity?.email || formValues?.email;
      const phone_number = identity?.phone || formValues?.phone_number;

      try {
        const res = await fetch("/api/vacuums/borrow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vacuum_id: vacuumId,
            key: nfcKey,
            sid,
            email,
            phone_number,
          }),
        });
        const data = await res.json();

        if (!res.ok) {
          setBorrowError(data.error || "Something went wrong.");
          return;
        }

        localStorage.setItem(STORAGE_KEYS.sid, sid);
        if (email) localStorage.setItem(STORAGE_KEYS.email, email);
        if (phone_number) localStorage.setItem(STORAGE_KEYS.phone, phone_number);
        setIdentity({ sid, email, phone: phone_number });
        setBorrowed(true);
      } catch {
        setBorrowError("Network error. Please try again.");
      } finally {
        setBorrowing(false);
      }
    },
    [identity, vacuumId, nfcKey]
  );

  useEffect(() => {
    if (
      keyValid &&
      vacuumStatus === "AVAILABLE" &&
      identity?.sid &&
      !borrowing &&
      !borrowed &&
      !borrowError
    ) {
      handleBorrow();
    }
  }, [keyValid, vacuumStatus, identity, borrowing, borrowed, borrowError, handleBorrow]);

  if (checking || borrowing) {
    return <LoadingScreen />;
  }

  if (!keyValid) {
    return (
      <div className="flex w-full max-w-3xl flex-col gap-3 rounded-tl-3xl rounded-br-3xl bg-black/70 p-6 text-white">
        <div className="rounded-tl-3xl rounded-br-3xl bg-[#8b0000] p-4 text-center font-semibold">
          Tap the vacuum&apos;s NFC sticker to borrow it.
        </div>
      </div>
    );
  }

  if (vacuumStatus === "CHECKED_OUT" && !borrowed) {
    return (
      <div className="flex w-full max-w-3xl flex-col gap-3 rounded-tl-3xl rounded-br-3xl bg-black/70 p-6 text-white">
        <p className="text-sm">
          The Floor {floor} vacuum is already checked out by someone else.
        </p>
      </div>
    );
  }

  if (borrowed) {
    return (
      <div className="flex w-full max-w-3xl flex-col gap-3 rounded-tl-3xl rounded-br-3xl bg-black/70 p-6 text-white">
        <p className="text-sm font-medium">
          Borrowed! Floor {floor} vacuum is now yours.
        </p>
        <a
          href="/all-vacuum"
          className="rounded-tl-3xl rounded-br-3xl bg-[#fc8f01] px-4 py-2 text-center text-sm text-black transition-colors hover:bg-[#e58200]"
        >
          Back to vacuum status
        </a>
      </div>
    );
  }

  if (identity?.sid) {
    return (
      <div className="flex w-full max-w-3xl flex-col gap-3 rounded-tl-3xl rounded-br-3xl bg-black/70 p-6 text-white">
        {borrowError && <p className="text-sm text-red-400">{borrowError}</p>}
      </div>
    );
  }

  return (
    <RegisterForm
      vacuumFloor={floor}
      onSubmit={handleBorrow}
      submitting={borrowing}
      error={borrowError}
    />
  );
}
