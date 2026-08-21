"use client";

import Link from "next/link";
import SiteMenuBlack from "../components/SiteMenuBlack";
import { FEATHER_PATH } from "../components/SiteMenuBlack";

export default function Facilities() {
  return (
    <SiteMenuBlack>
      <div className="flex w-[90%] flex-col gap-6 sm:w-[85%] sm:flex-row sm:justify-center">
        <Link
          href="/all-vacuum"
          className="flex-1 rounded-tl-3xl rounded-br-3xl bg-[#8b0000]/70 p-6 text-white transition-colors hover:bg-[#4f0000]/85 sm:p-8"
        >
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl">Portable Vacuum</h2>
          <p className="text-sm leading-relaxed sm:text-base">
            Located in each floor. Check out availability. Tap the Poke Ball to borrow.
          </p>
        </Link>

        <Link
          href="/laundry"
          className="flex-1 rounded-tl-3xl rounded-br-3xl bg-[#8b0000]/70 p-6 text-white transition-colors hover:bg-[#4f0000]/85 sm:p-8"
        >
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl">Laundry Room</h2>
          <p className="text-sm leading-relaxed sm:text-base">
            Located in 1/F. Check out availability of our:
            <div className="flex gap-1 item-center h-10 mt-2">
              <svg
                width="70"
                height="70"
                viewBox="0 0 130 130"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g
                  className={`transition-all duration-750 ease-out delay-0 translate-x-0 translate-y-[60px] opacity-100 group-hover:translate-y-[70px]`}
                >
                  <path d={FEATHER_PATH} fill="#fff" transform="rotate(45 100 100)" />
                </g>
              </svg>
              7 WASHING MACHINES
            </div>
            <div className="flex gap-1 item-center h-10">
              <svg
                width="70"
                height="70"
                viewBox="0 0 130 130"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g
                  className={`transition-all duration-750 ease-out delay-0 translate-x-0 translate-y-[60px] opacity-100 group-hover:translate-y-[70px]`}
                >
                  <path d={FEATHER_PATH} fill="#fff" transform="rotate(45 100 100)" />
                </g>
              </svg>
              7 DRYERS
            </div>
          </p>
        </Link>
      </div>
    </SiteMenuBlack>
  );
}
