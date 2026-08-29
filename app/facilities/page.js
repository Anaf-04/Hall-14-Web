"use client";

import Link from "next/link";
import SiteMenuBlack from "../components/SiteMenuBlack";

export default function Facilities() {
  return (
    <SiteMenuBlack>
      <div className="grid grid-cols-2 sm:grid-cols-4 w-[90%] gap-6 sm:w-[85%] sm:justify-center py-24">
        <Link
          href="/all-vacuum"
          className="flex-1 rounded-tl-3xl rounded-br-3xl bg-[#8b0000]/70 p-6 
          text-white transition-colors hover:bg-[#4f0000]/85 sm:p-8 relative overflow-hidden"
        >
          <h2 className="mb-4 text-xl font-bold">Portable Vacuum</h2>
          <div className="text-xs leading-relaxed">Check out availability.</div>
          <div className="absolute top-0 right-[-50px] z-[-10]">
            <img
              src="/img/pokeballBack.png"
              alt=""
              width="auto"
              height="auto"
              className="object-contain h-[150px] "
            />
          </div>
        </Link>

        <Link
          href="/laundry"
          className="flex-1 relative rounded-tl-3xl rounded-br-3xl bg-[#737000]/70 p-6 
          text-white transition-colors hover:bg-[#737000]/55 sm:p-8 overflow-hidden"
        >
          <h2 className="mb-4 text-xl text-black font-bold">Laundry Room</h2>
          <div className="text-xs leading-relaxed text-black">Check out availability.</div>
          <div className="absolute top-0 right-[-90px] z-[-10]">
            <img
              src="/img/laundry.png"
              alt=""
              width="auto"
              height="auto"
              className="object-contain h-[200px] "
            />
          </div>
        </Link>
        <Link
          href="/ps5Controller"
          className="flex-1 relative rounded-tl-3xl rounded-br-3xl bg-[#CC5500]/60 p-6 
          text-white transition-colors hover:bg-[#CC5500]/45 sm:p-8 overflow-hidden"
        >
          <h2 className="mb-4 text-xl font-bold">PS5 Controller</h2>
          <div className="text-xs leading-relaxed">Check out availability.</div>
          <div className="absolute top-0 right-[-100px] z-[-10]">
            <img
              src="/img/ps5.png"
              alt=""
              width="auto"
              height="auto"
              className="object-contain h-[200px] "
            />
          </div>
        </Link>
        <Link
          href="/shoeWasherKey"
          className="flex-1 relative rounded-tl-3xl rounded-br-3xl bg-[#D2B558]/60 p-6 
          text-white transition-colors hover:bg-[#D2B558]/45 sm:p-8 overflow-hidden"
        >
          <h2 className="mb-4 text-xl font-bold text-black">Shoe Washer</h2>
          <div className="text-xs leading-relaxed text-black">Check out availability.</div>
          <div className="absolute top-[0px] right-[-30px] z-[-10]">
            <img
              src="/img/key.png"
              alt=""
              width="auto"
              height="auto"
              className="object-contain h-[150px] "
            />
          </div>
        </Link>
        <Link
          href="/nintendoSwitch"
          className="flex-1 relative rounded-tl-3xl rounded-br-3xl bg-[#D30000]/50 p-6 
          text-white transition-colors hover:bg-[#D30000]/35 sm:p-8 overflow-hidden"
        >
          <h2 className="mb-4 text-xl font-bold">Nintendo Switch</h2>
          <div className="text-xs leading-relaxed">Check out availability.</div>
          <div className="absolute top-0 right-[-70px] z-[-10]">
            <img
              src="/img/nintendo.png"
              alt=""
              width="auto"
              height="auto"
              className="object-contain h-[150px] "
            />
          </div>
        </Link>
        <Link
          href="/tableTennis"
          className="flex-1 relative rounded-tl-3xl rounded-br-3xl bg-[#ffff00]/50 p-6 
          text-white transition-colors hover:bg-[#ffff00]/35 sm:p-8 overflow-hidden"
        >
          <h2 className="mb-4 text-xl font-bold text-black">Table Tennis</h2>
          <div className="text-xs leading-relaxed text-black">Check out availability.</div>
          <div className="absolute top-0 right-[-30px] z-[-10]">
            <img
              src="/img/ttset.png"
              alt=""
              width="auto"
              height="auto"
              className="object-contain h-[150px] "
            />
          </div>
        </Link>

      </div>
    </SiteMenuBlack>
  );
}
