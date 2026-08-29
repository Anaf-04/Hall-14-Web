"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SiteMenu from "../components/SiteMenu";
import FacilityDashboard from "../components/FacilityDashboard";
import BorrowFacility from "../components/BorrowFacility";

function TableTennisContent() {
  const searchParams = useSearchParams();
  const facilityId = searchParams.get("v");
  const nfcKey = searchParams.get("key");

  return (
    <main className="flex w-[90%] flex-col items-center gap-6 py-24 sm:w-[85%]">
      {facilityId && nfcKey ? (
        <BorrowFacility facilityId={facilityId} nfcKey={nfcKey} backHref="/tableTennis" item="TABLE_TENNIS_SET" />
      ) : (
        <FacilityDashboard
          item="TABLE_TENNIS_SET"
          title="Table Tennis Set"
          label="table tennis set"
          borrowHint="To borrow the Table Tennis Set, scan the QR code at the Ground Floor security desk."
        />
      )}
    </main>
  );
}

export default function TableTennisPage() {
  return (
    <SiteMenu>
      <Suspense fallback={null}>
        <TableTennisContent />
      </Suspense>
    </SiteMenu>
  );
}
