"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SiteMenu from "../components/SiteMenu";
import LaundryDashboard from "../components/LaundryDashboard";
import BorrowFacility from "../components/BorrowFacility";

function LaundryContent() {
  const searchParams = useSearchParams();
  const facilityId = searchParams.get("v");
  const nfcKey = searchParams.get("key");

  return (
    <main className="flex w-[98%] flex-col items-center gap-6 mt-[80px] py-1 sm:w-[85%]">
      {facilityId && nfcKey ? (
        <BorrowFacility facilityId={facilityId} nfcKey={nfcKey} backHref="/laundry" item="LAUNDRY" />
      ) : (
        <LaundryDashboard />
      )}
    </main>
  );
}

export default function Laundry() {
  return (
    <SiteMenu>
      <Suspense fallback={null}>
        <LaundryContent />
      </Suspense>
    </SiteMenu>
  );
}
