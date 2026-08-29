"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import FacilityCard from "./FacilityCard";
import LoadingScreen from "./LoadingScreen";

const STORAGE_KEYS = {
  sid: "hall14_sid",
  email: "hall14_email",
  phone: "hall14_phone",
};

const ITEM_ICONS = {
  PS5_CONTROLLER: "/icons/ps5.svg",
  SHOE_WASHER_KEY: "/icons/shoeWasher.png",
  TABLE_TENNIS_SET: "/icons/tableTennisSet.png",
  NINTENDO_SWITCH: "/icons/nintendo.png",
};

export default function FacilityDashboard({ item, title, label, instructions, borrowHint }) {
  const [facilities, setFacilities] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [identity, setIdentity] = useState(null); // { sid, email, phone }
  const [returningId, setReturningId] = useState(null);
  const [succeededId, setSucceededId] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const loading = !dataLoaded || !minTimeElapsed;

  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const sid = localStorage.getItem(STORAGE_KEYS.sid);
    const email = localStorage.getItem(STORAGE_KEYS.email);
    const phone = localStorage.getItem(STORAGE_KEYS.phone);
    if (sid) setIdentity({ sid, email, phone });
  }, []);

  useEffect(() => {
    async function loadFacilities() {
      const { data, error } = await supabase
        .from("facilities")
        .select(
          "id, floor, status, last_borrower_sid, resident:last_borrower_sid(name, room_number, phone_number)"
        )
        .eq("item", item)
        .order("id", { ascending: true });
      if (!error) setFacilities(data);
      setDataLoaded(true);
    }
    loadFacilities();

    const channel = supabase
      .channel(`facilities-realtime-${item}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "facilities" },
        () => {
          loadFacilities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [item]);

  const handleReturn = useCallback(
    async (id) => {
      if (!identity?.sid) return;
      setReturningId(id);
      try {
        const res = await fetch("/api/facilities/return", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ facility_id: id, sid: identity.sid }),
        });
        const data = await res.json();
        if (res.ok) {
          setSucceededId(id);
          setTimeout(() => {
            setFacilities((current) =>
              current.map((f) => (f.id === id ? data.facility : f))
            );
            setSucceededId(null);
          }, 350);
        }
      } finally {
        setReturningId(null);
      }
    },
    [identity]
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="relative flex flex-col gap-6 w-full max-w-3xl bg-black/70 p-6 rounded-tl-3xl rounded-br-3xl text-white">
      <div className="flex flex-col gap-2 items-start justify-between">
        <h1 className="text-xl font-semibold text-white">{title}</h1>
        {instructions && (
          <div
            onClick={() => setShowInfo(true)}
            className="rounded-tl-xl rounded-br-xl flex items-center justify-center p-1 gap-1 bg-[#8B0000] w-full cursor-pointer"
          >
            
            <div>How to charge the vacuum</div>
            <img
              src="/icons/charge.svg"
              alt=""
              width="auto"
              height="auto"
              className="object-contain h-5 w-5"
            />
          </div>
        )}
      </div>
      {borrowHint && <p className="text-xs text-white">{borrowHint}</p>}
      <div className={`grid ${instructions ? "sm:grid-cols-2" : "sm:grid-cols-1"} grid-cols-1 gap-3`}>
        {facilities.map((f, idx) => (
          <FacilityCard
            key={f.id}
            facility={f}
            label={facilities.length > 1 ? `${label} ${idx + 1}` : label}
            icon={ITEM_ICONS[item]}
            isMine={identity?.sid && f.status === "CHECKED_OUT" && f.last_borrower_sid === identity.sid}
            onReturn={handleReturn}
            returning={returningId === f.id}
            succeeded={succeededId === f.id}
          />
        ))}
      </div>

      {instructions && (
        <div
          className={`absolute left-0 top-0 w-full z-10 rounded-tl-3xl rounded-br-3xl border-2 border-green-900 bg-black/95 text-white ${showInfo ? "h-[350px] opacity-100 p-6" : "h-0 opacity-0 p-0 overflow-hidden"
            }`}
        >
          <div className="flex items-center justify-between">
            <h1 className="text-md font-semibold text-white">{instructions.heading}</h1>
            <div
              onClick={() => setShowInfo(false)}
              className="cursor-pointer"
            >
              <img
                src="/icons/featherCross.png"
                alt=""
                width="auto"
                height="auto"
                className="object-contain h-auto w-8"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <div className="flex-1 flex items-center justify-center">
              <img
                src={instructions.image}
                alt=""
                width="auto"
                height="auto"
                className="object-contain max-h-64 rounded-tl-3xl rounded-br-3xl "
              />
            </div>
            <div className="flex flex-col gap-4">
              {instructions.steps.map((step) => (
                <div key={step} className="flex gap-1 item-center">
                  <img
                    src="/icons/pokeball.png"
                    alt=""
                    width="auto"
                    height="auto"
                    className="object-contain h-4"
                  />
                  <div className="flex items-center ml-2 text-sm">{step}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
