"use client";

import SiteMenu from "../components/SiteMenu";
import LaundryDashboard from "../components/LaundryDashboard";

export default function Laundry() {
  return (
    <SiteMenu>
      <main className="flex w-[90%] flex-col items-center gap-6 py-24 sm:w-[85%]">
        <LaundryDashboard />
      </main>
    </SiteMenu>
  );
}
