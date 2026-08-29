"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SiteMenu from "../components/SiteMenu";
import FacilityDashboard from "../components/FacilityDashboard";
import BorrowFacility from "../components/BorrowFacility";

function ShoeWasherKeyContent() {
  const searchParams = useSearchParams();
  const facilityId = searchParams.get("v");
  const nfcKey = searchParams.get("key");

  return (
    <main className="flex w-[90%] flex-col items-center gap-6 py-24 sm:w-[85%]">
      {facilityId && nfcKey ? (
        <BorrowFacility facilityId={facilityId} nfcKey={nfcKey} backHref="/shoeWasherKey" item="SHOE_WASHER_KEY" />
      ) : (
        <FacilityDashboard
          item="SHOE_WASHER_KEY"
          title="Shoe Washer"
          label="shoe washer"
          borrowHint="To borrow the Shoe Washer, scan the QR code and submit your SID at the Ground Floor security desk."
        />
      )}
    </main>
  );
}

export default function ShoeWasherKeyPage() {
  return (
    <SiteMenu>
      <Suspense fallback={null}>
        <ShoeWasherKeyContent />
      </Suspense>
    </SiteMenu>
  );
}
