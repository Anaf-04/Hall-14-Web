"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SiteMenu from "../components/SiteMenu";
import FacilityDashboard from "../components/FacilityDashboard";
import BorrowFacility from "../components/BorrowFacility";

function ShoppingCartsContent() {
  const searchParams = useSearchParams();
  const facilityId = searchParams.get("v");
  const nfcKey = searchParams.get("key");

  return (
    <main className="flex w-[90%] flex-col items-center gap-6 py-24 sm:w-[85%]">
      {facilityId && nfcKey ? (
        <BorrowFacility facilityId={facilityId} nfcKey={nfcKey} backHref="/shoppingCarts" item="SHOPPING_CARTS" />
      ) : (
        <FacilityDashboard
          item="SHOPPING_CARTS"
          title="Shopping Carts"
          label="Shopping cart"
          borrowHint="To borrow a shopping cart, scan the QR code at the Ground Floor security desk."
        />
      )}
    </main>
  );
}

export default function ShoppingCartsPage() {
  return (
    <SiteMenu>
      <Suspense fallback={null}>
        <ShoppingCartsContent />
      </Suspense>
    </SiteMenu>
  );
}
