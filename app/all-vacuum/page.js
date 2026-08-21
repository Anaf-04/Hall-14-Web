"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SiteMenu from "../components/SiteMenu";
import VacuumDashboard from "../components/VacuumDashboard";
import BorrowVacuum from "../components/BorrowVacuum";

function AllVacuumContent() {
  const searchParams = useSearchParams();
  const vacuumId = searchParams.get("v");
  const nfcKey = searchParams.get("key");

  return (
    <main className="flex w-[90%] flex-col items-center gap-6 py-24 sm:w-[85%]">
      {vacuumId && nfcKey ? (
        <BorrowVacuum vacuumId={vacuumId} nfcKey={nfcKey} />
      ) : (
        <VacuumDashboard />
      )}
    </main>
  );
}

export default function AllVacuum() {
  return (
    <SiteMenu>
      <Suspense fallback={null}>
        <AllVacuumContent />
      </Suspense>
    </SiteMenu>
  );
}
