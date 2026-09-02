"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import MachineCard from "./MachineCard";
import LoadingScreen from "./LoadingScreen";
import MobileLaundryDisplay from "./MobileLaundryDisplay";

function machineKey(machine) {
  const prefix = machine["Machine Type"] === "D" ? "Dryer" : "Washer";
  return `${prefix}_${machine["Machine ID"]}`;
}

export default function LaundryDashboard() {
  const [machines, setMachines] = useState([]);
  const [facilitiesByItem, setFacilitiesByItem] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  const loading = !dataLoaded || !minTimeElapsed;

  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function loadMachines() {
      try {
        const res = await fetch("/api/laundry/status");
        const data = await res.json();
        if (res.ok) setMachines(data.machines);
      } finally {
        setDataLoaded(true);
      }
    }
    loadMachines();
  }, []);

  useEffect(() => {
    async function loadFacilities() {
      const { data, error } = await supabase
        .from("facilities")
        .select("item, status, resident:last_borrower_sid(name, room_number, phone_number)")
        .or("item.like.Washer_%,item.like.Dryer_%");
      if (!error) {
        setFacilitiesByItem(Object.fromEntries((data ?? []).map((f) => [f.item, f])));
      }
    }
    loadFacilities();

    const channel = supabase
      .channel("facilities-realtime-laundry")
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
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  function borrowerFor(machine) {
    // Gate on the live "Left Time" too, not just the facilities row's status
    // — the cron that flips a finished machine back to AVAILABLE only runs
    // once a minute, so relying on status alone would keep showing the
    // borrower for a stale window after the machine itself reports done.
    if (parseInt(machine["Left Time"], 10) === 0) return null;
    const facility = facilitiesByItem[machineKey(machine)];
    return facility?.status === "CHECKED_OUT" ? facility.resident : null;
  }

  const washers = machines
    .filter((m) => m["Machine Type"] === "W")
    .sort((a, b) => Number(b["Machine ID"]) - Number(a["Machine ID"]));
  const dryers = machines
    .filter((m) => m["Machine Type"] === "D")
    .sort((a, b) => Number(b["Machine ID"]) - Number(a["Machine ID"]));

  return (
    <div className="flex w-full flex-col gap-6 rounded-tl-3xl rounded-br-3xl bg-black/70 p-6 text-white">
      <h1 className="text-2xl font-semibold text-white">Hall 14 Laundry Status</h1>
      <div className="grid grid-cols-7 xl:hidden">
        {dryers.map((m) => (
          <MobileLaundryDisplay key={`d-${m["Machine ID"]}`} machine={m} />
        ))}
        {washers.map((m) => (
          <MobileLaundryDisplay key={`w-${m["Machine ID"]}`} machine={m} />
        ))}
      </div>
      <div className="flex w-full flex-col gap-3">
        <h2 className="text-lg font-semibold text-white/80">Dryers</h2>
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-7">
          {dryers.map((m) => (
            <MachineCard key={`d-${m["Machine ID"]}`} machine={m} borrower={borrowerFor(m)} />
          ))}
        </div>
      </div>
      <div className="flex w-full flex-col gap-3">
        <h2 className="text-lg font-semibold text-white/80">Washing Machines</h2>
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-7">
          {washers.map((m) => (
            <MachineCard key={`w-${m["Machine ID"]}`} machine={m} borrower={borrowerFor(m)} />
          ))}
        </div>
      </div>
    </div>
  );
}
