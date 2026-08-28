"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import VacuumCard from "./VacuumCard";
import LoadingScreen from "./LoadingScreen";

const STORAGE_KEYS = {
  sid: "hall14_sid",
  email: "hall14_email",
  phone: "hall14_phone",
};

export default function VacuumDashboard() {
  const [vacuums, setVacuums] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [identity, setIdentity] = useState(null); // { sid, email, phone }
  const [returningId, setReturningId] = useState(null);
  const [showChargeInfo, setShowChargeInfo] = useState(false);

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
    async function loadVacuums() {
      const { data, error } = await supabase
        .from("vacuums")
        .select(
          "id, floor, status, last_borrower_sid, resident:last_borrower_sid(room_number)"
        )
        .order("floor", { ascending: true });
      if (!error) setVacuums(data);
      setDataLoaded(true);
    }
    loadVacuums();

    const channel = supabase
      .channel("vacuums-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "vacuums" },
        () => {
          loadVacuums();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleReturn = useCallback(
    async (id) => {
      if (!identity?.sid) return;
      setReturningId(id);
      try {
        const res = await fetch("/api/vacuums/return", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vacuum_id: id, sid: identity.sid }),
        });
        const data = await res.json();
        if (res.ok) {
          setVacuums((current) =>
            current.map((v) => (v.id === id ? data.vacuum : v))
          );
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
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Hall 14 Vacuum Status</h1>
        <div
          onClick={() => setShowChargeInfo(true)}
          className="rounded-tl-xl rounded-br-xl bg-[#8B0000] p-1 cursor-pointer"
        >
          <img
            src="/icons/charge.svg"
            alt=""
            width="auto"
            height="auto"
            className="object-contain h-5 w-5"
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 grid-cols-1 gap-3">
        {vacuums.map((v) => (
          <VacuumCard
            key={v.id}
            vacuum={v}
            isMine={identity?.sid && v.status === "CHECKED_OUT" && v.last_borrower_sid === identity.sid}
            onReturn={handleReturn}
            returning={returningId === v.id}
          />
        ))}
      </div>

      <div
        className={`absolute left-0 top-0 w-full z-10 rounded-tl-3xl rounded-br-3xl border-2 border-green-900 bg-black/95 text-white transition-all duration-500 ease-out ${showChargeInfo ? "h-[350px] opacity-100 p-6" : "h-0 opacity-0 p-0 overflow-hidden"
          }`}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white">How to charge the vacuum?</h1>
          <div
            onClick={() => setShowChargeInfo(false)}
            className="rounded-tl-xl rounded-br-xl bg-green-900 p-1 cursor-pointer"
          >
            <img
              src="/icons/charge.svg"
              alt=""
              width="auto"
              height="auto"
              className="object-contain h-5 w-5"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <div className="flex-1 flex items-center justify-center">
            <img
              src="/img/VacuumBox.png"
              alt="Vacuum charging box"
              width="auto"
              height="auto"
              className="object-contain max-h-64 rounded-tl-3xl rounded-br-3xl "
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex gap-1 item-center">
              <img
                src="/icons/pokeball.png"
                alt=""
                width="auto"
                height="auto"
                className="object-contain  h-4"
              />
              <div className="flex items-center ml-2 text-sm">Open the box</div>
            </div>
            <div className="flex gap-1 item-center">
              <img
                src="/icons/pokeball.png"
                alt=""
                width="auto"
                height="auto"
                className="object-contain h-4"
              />
              <div className="flex items-center ml-2 text-sm">Grab the Type-C cable</div>
            </div>
            <div className="flex gap-1 item-center">
              <img
                src="/icons/pokeball.png"
                alt=""
                width="auto"
                height="auto"
                className="object-contain h-4"
              />
              <div className="flex items-center ml-2 text-sm">Plug the cable</div>
            </div>
            <div className="flex gap-1 item-center">
              <img
                src="/icons/pokeball.png"
                alt=""
                width="auto"
                height="auto"
                className="object-contain h-4"
              />
              <div className="flex items-center ml-2 text-sm">Charge for 2 hours</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
