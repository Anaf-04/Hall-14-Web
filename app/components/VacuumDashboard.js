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
    <div className="flex flex-col gap-6 w-full max-w-3xl bg-black/70 p-6 rounded-tl-3xl rounded-br-3xl text-white">
      <h1 className="text-2xl font-semibold text-white">Hall 14 Vacuum Status</h1>

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
    </div>
  );
}
