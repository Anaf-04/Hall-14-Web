"use client";

import { useEffect, useState } from "react";
import MachineCard from "./MachineCard";
import LoadingScreen from "./LoadingScreen";
import MobileLaundryDisplay from "./MobileLaundryDisplay";

export default function LaundryDashboard() {
  const [machines, setMachines] = useState([]);
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

  if (loading) {
    return <LoadingScreen />;
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
      <div className="grid grid-cols-7 sm:hidden">
        {dryers.map((m) => (
          <MobileLaundryDisplay key={`d-${m["Machine ID"]}`} machine={m} />
        ))}
        {washers.map((m) => (
          <MobileLaundryDisplay key={`w-${m["Machine ID"]}`} machine={m} />
        ))}
      </div>
      <div className="flex w-full flex-col gap-3">
        <h2 className="text-lg font-semibold text-white/80">Dryers</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-7">
          {dryers.map((m) => (
            <MachineCard key={`d-${m["Machine ID"]}`} machine={m} />
          ))}
        </div>
      </div>
      <div className="flex w-full flex-col gap-3">
        <h2 className="text-lg font-semibold text-white/80">Washing Machines</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-7">
          {washers.map((m) => (
            <MachineCard key={`w-${m["Machine ID"]}`} machine={m} />
          ))}
        </div>
      </div>
    </div>
  );
}
