"use client";

import Link from "next/link";
import SiteMenuBlack from "../components/SiteMenuBlack";

export default function Facilities() {
  return (
    <SiteMenuBlack>
      <div className="flex w-[90%] flex-col gap-6 sm:w-[85%] sm:flex-row sm:justify-center py-24">
        <Link
          href="/all-vacuum"
          className="flex-1 rounded-tl-3xl rounded-br-3xl bg-[#8b0000]/70 p-6 text-white transition-colors hover:bg-[#4f0000]/85 sm:p-8"
        >
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl">Portable Vacuum</h2>
          <div className="text-sm leading-relaxed sm:text-base">
            Located in each floor. Check out availability.
            <div className="flex gap-1 item-center h-5 mt-2">
              <img
                src="/icons/pokeball.png"
                alt=""
                width="auto"
                height="auto"
                className="object-contain"
              />
              <div className="flex items-center ml-2 text-sm">Tap the Poke Ball with your mobile.</div>
            </div>
          </div>
        </Link>

        <Link
          href="/laundry"
          className="flex-1 rounded-tl-3xl rounded-br-3xl bg-[#8b0000]/70 p-6 text-white transition-colors hover:bg-[#4f0000]/85 sm:p-8"
        >
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl">Laundry Room</h2>
          <div className="text-sm leading-relaxed sm:text-base">
            Located in 1/F. Check out availability of our:
            <div className="flex gap-1 item-center h-7 mt-2">
              <img
                src="/icons/dryerClosed.png"
                alt=""
                width="auto"
                height="auto"
                className="object-contain"
              />
              <div className="flex items-center ml-2">7 DRYERS</div>
            </div>
            <div className="flex gap-1 item-center h-7 mt-2">
              <img
                src="/icons/washerClosed.png"
                alt=""
                width="auto"
                height="auto"
                className="object-contain"
              />
              <div className="flex items-center ml-2">7 WASHING MACHINES</div> 
            </div>
            
          </div>
        </Link>
      </div>
    </SiteMenuBlack>
  );
}
