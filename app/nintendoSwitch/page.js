"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SiteMenu from "../components/SiteMenu";
import FacilityDashboard from "../components/FacilityDashboard";
import BorrowFacility from "../components/BorrowFacility";

function NintendoSwitchContent() {
  const searchParams = useSearchParams();
  const facilityId = searchParams.get("v");
  const nfcKey = searchParams.get("key");

  return (
    <main className="flex w-[90%] flex-col items-center gap-6 py-24 sm:w-[85%]">
      {facilityId && nfcKey ? (
        <BorrowFacility facilityId={facilityId} nfcKey={nfcKey} backHref="/nintendoSwitch" item="NINTENDO_SWITCH" />
      ) : (
        <FacilityDashboard
          item="NINTENDO_SWITCH"
          title="Nintendo Switch"
          label="Nintendo Switch"
          borrowHint="To borrow the Nintendo Switch, scan the QR code at the Ground Floor security desk."
        />
      )}
    </main>
  );
}

export default function NintendoSwitchPage() {
  return (
    <SiteMenu>
      <Suspense fallback={null}>
        <NintendoSwitchContent />
      </Suspense>
    </SiteMenu>
  );
}
