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
        .select(
          "item, status, last_borrowed_at, last_returned_at, resident:last_borrower_sid(name, room_number, phone_number)"
        )
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
        {
          event: "*",
          schema: "public",
          table: "facilities",
          filter: "item=like.Washer_*",
        },
        () => {
          loadFacilities();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "facilities",
          filter: "item=like.Dryer_*",
        },
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
    // Keep showing the borrower even once the machine reports "Available"
    // (Left Time === 0) — laundry is often left behind, so people should
    // still be able to see who to contact until the facility is checked in.
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
    <div className="flex w-full flex-col gap-10 rounded-tl-3xl rounded-br-3xl bg-black/70 p-6 text-white">
      <h1 className="text-2xl font-semibold text-white">Hall 14 Laundry Status</h1>
      <div className="grid grid-cols-7">
        {dryers.map((m) => (
          <MobileLaundryDisplay key={`d-${m["Machine ID"]}`} machine={m} />
        ))}
        {washers.map((m) => (
          <MobileLaundryDisplay key={`w-${m["Machine ID"]}`} machine={m} />
        ))}
      </div>
      <div className="flex w-full flex-col gap-3">
        <h2 className="text-3xl font-semibold text-white/80">Dryers</h2>
        <div className="grid grid-cols-1 gap-10">
          {dryers.map((m) => (
            <MachineCard key={`d-${m["Machine ID"]}`} machine={m} borrower={borrowerFor(m)} facility={facilitiesByItem[machineKey(m)]} />
          ))}
        </div>
      </div>
      <div className="flex w-full flex-col gap-3 mt-10">
        <h2 className="text-3xl font-semibold text-white/80">Washing Machines</h2>
        <div className="grid grid-cols-1 gap-10">
          {washers.map((m) => (
            <MachineCard key={`w-${m["Machine ID"]}`} machine={m} borrower={borrowerFor(m)}facility={facilitiesByItem[machineKey(m)]} />
          ))}
        </div>
      </div>
    </div>
  );
}
