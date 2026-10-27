"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SiteMenu from "../components/SiteMenu";
import FacilityDashboard from "../components/FacilityDashboard";
import BorrowFacility from "../components/BorrowFacility";

function BeachBlanketContent() {
  const searchParams = useSearchParams();
  const facilityId = searchParams.get("v");
  const nfcKey = searchParams.get("key");

  return (
    <main className="flex w-[90%] flex-col items-center gap-6 py-24 sm:w-[85%]">
      {facilityId && nfcKey ? (
        <BorrowFacility facilityId={facilityId} nfcKey={nfcKey} backHref="/beachBlanket" item="BEACH_BLANKET" />
      ) : (
        <FacilityDashboard
          item="BEACH_BLANKET"
          title="Beach Blanket"
          label="Beach blanket"
          borrowHint="To borrow the beach blanket, scan the QR code at the Ground Floor security desk."
        />
      )}
    </main>
  );
}

export default function BeachBlanketPage() {
  return (
    <SiteMenu>
      <Suspense fallback={null}>
        <BeachBlanketContent />
      </Suspense>
    </SiteMenu>
  );
}
