"use client";

import { useCallback, useEffect, useState } from "react";
import RegisterForm from "./RegisterForm";
import LoadingScreen from "./LoadingScreen";

const STORAGE_KEYS = {
  sid: "hall14_sid",
  email: "hall14_email",
  phone: "hall14_phone",
};

const ITEM_LABELS = {
  PORTABLE_VACUUM: "vacuum",
  PS5_CONTROLLER: "PS5 controller",
  SHOE_WASHER_KEY: "Shoe Washer Key",
  NINTENDO_SWITCH: "Nintendo Switch",
  TABLE_TENNIS_SET: "table tennis set",
};

const ITEM_ICONS = {
  PS5_CONTROLLER: "/icons/ps5.svg",
  SHOE_WASHER_KEY: "/icons/shoeWasher.png",
  TABLE_TENNIS_SET: "/icons/tableTennisSet.png",
  NINTENDO_SWITCH: "/icons/nintendo.png",
};

export default function BorrowFacility({ facilityId, nfcKey, backHref, item: expectedItem }) {
  const [checking, setChecking] = useState(true);
  const [keyValid, setKeyValid] = useState(false);
  const [item, setItem] = useState(expectedItem ?? null);
  const [floor, setFloor] = useState(null);
  const [roomNumber, setRoomNumber] = useState(null);
  const [facilityStatus, setFacilityStatus] = useState(null);
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
        const res = await fetch("/api/facilities/validate-key", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ facility_id: facilityId, key: nfcKey }),
        });
        const data = await res.json();
        if (res.ok && data.valid) {
          setKeyValid(true);
          setItem(data.item);
          setFloor(data.floor);
          setFacilityStatus(data.status);
          setRoomNumber(data.roomNumber);
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
  }, [facilityId, nfcKey]);

  const handleBorrow = useCallback(
    async (formValues) => {
      setBorrowing(true);
      setBorrowError(null);

      const sid = identity?.sid || formValues?.sid;
      const email = identity?.email || formValues?.email;
      const phone_number = identity?.phone || formValues?.phone_number;

      try {
        const res = await fetch("/api/facilities/borrow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            facility_id: facilityId,
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
    [identity, facilityId, nfcKey]
  );

  useEffect(() => {
    if (
      keyValid &&
      facilityStatus === "AVAILABLE" &&
      identity?.sid &&
      !borrowing &&
      !borrowed &&
      !borrowError
    ) {
      handleBorrow();
    }
  }, [keyValid, facilityStatus, identity, borrowing, borrowed, borrowError, handleBorrow]);

  if (checking || borrowing) {
    return <LoadingScreen />;
  }

  const isLaundry = item?.startsWith("Washer_") || item?.startsWith("Dryer_");
  const label = isLaundry ? item.replace("_", " ") : ITEM_LABELS[item] ?? "facility";
  const facilityLabel = floor != null ? `Floor ${floor} ${label}` : label;
  const laundryIcon = isLaundry
    ? item.startsWith("Washer_")
      ? "/icons/washerOpened.png"
      : "/icons/dryerOpen.png"
    : null;

  if (!keyValid) {
    return (
      <div className="flex w-full max-w-3xl flex-col gap-3 rounded-tl-3xl rounded-br-3xl bg-black/70 p-6 text-white">
        <div className="rounded-tl-3xl rounded-br-3xl bg-[#8b0000] p-4 text-center font-semibold">
          {item === "PORTABLE_VACUUM" || item === "LAUNDRY"
            ? "Tap the facility's NFC sticker to borrow it."
            : "Scan the QR code at the Ground Floor Security Desk to borrow it."}
        </div>
      </div>
    );
  }

  if (facilityStatus === "CHECKED_OUT" && !borrowed) {
    return (
      <div className="flex flex-col gap-3 rounded-tl-3xl rounded-br-3xl bg-black/70 p-6 text-white">
        <p className="text-sm">
          <span className="text-[#fc8f01]">{roomNumber ? `Room ${roomNumber} ` : "someone else "}</span>
          is using the {label}.
        </p>
      </div>
    );
  }

  if (borrowed) {
    return (
      <div className="flex w-full max-w-3xl flex-col gap-3 rounded-tl-3xl rounded-br-3xl bg-black/70 p-6 text-white">
        <div className="flex items-center gap-2">
          {laundryIcon ? (
            <img src={laundryIcon} alt="" className="h-auto w-10" />
          ) : (
            ITEM_ICONS[item] && (
              <img src={ITEM_ICONS[item]} alt="" className="h-auto w-10" />
            )
          )}
          {floor != null && (
            <img src={`/img/floor${floor}.png`} alt="" className="h-auto w-7" />
          )}
          <div className="flex flex-col item-center gap-2">
            {isLaundry && (
              <p className="text-sm font-medium">
                Fetching data from {label}. You will be notified when done.
              </p>
            )}
            {!isLaundry && floor && (
              <p className="text-sm font-medium">
                Borrowed! The {facilityLabel} is now yours.
              </p>
            )}
            {!isLaundry && !floor && (
              <>
                <p className="text-xs font-medium">
                  Please show this message to the guard:
                </p>
                <p className="text-xl font-medium">
                  請將此設施移交給這位住戶。
                </p>
              </>
            )}
          </div>
        </div>
        <a
          href={backHref}
          className="rounded-tl-3xl rounded-br-3xl bg-[#fc8f01] px-4 py-2 text-center text-sm text-black transition-colors hover:bg-[#e58200]"
        >
          Back to status
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
      facilityLabel={facilityLabel}
      onSubmit={handleBorrow}
      submitting={borrowing}
      error={borrowError}
    />
  );
}
