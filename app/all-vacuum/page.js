"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SiteMenu from "../components/SiteMenu";
import FacilityDashboard from "../components/FacilityDashboard";
import BorrowFacility from "../components/BorrowFacility";

const INSTRUCTIONS = {
  heading: "How to charge the vacuum?",
  image: "/img/VacuumBox.png",
  steps: ["Open the box", "Grab the Type-C cable", "Plug the cable", "Charge for 2 hours"],
};

function AllVacuumContent() {
  const searchParams = useSearchParams();
  const facilityId = searchParams.get("v");
  const nfcKey = searchParams.get("key");

  return (
    <main className="flex w-[90%] flex-col items-center gap-6 py-24 sm:w-[85%]">
      {facilityId && nfcKey ? (
        <BorrowFacility facilityId={facilityId} nfcKey={nfcKey} backHref="/all-vacuum" item="PORTABLE_VACUUM" />
      ) : (
        <FacilityDashboard
          item="PORTABLE_VACUUM"
          title="Hall 14 Vacuum Status"
          label="vacuum"
          instructions={INSTRUCTIONS}
          borrowHint="To borrow the vacuum, tap the Poke Ball image with your mobile."
        />
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
