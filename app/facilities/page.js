"use client";

import Link from "next/link";
import SiteMenuBlack from "../components/SiteMenuBlack";

export default function Facilities() {
  return (
    <SiteMenuBlack>
      <div className="grid grid-cols-1 sm:grid-cols-4 w-[90%] gap-5 sm:w-[85%] sm:justify-center py-24">
        <Link
          href="/all-vacuum"
          className="flex-1 rounded-tl-3xl rounded-br-3xl bg-[#8b0000]/80 p-6 
          text-white transition-colors hover:bg-[#4f0000]/85 sm:p-8 relative overflow-hidden"
        >
          <h2 className="mb-4 text-xl font-bold">Portable Vacuum</h2>
          <div className="absolute bottom-[10px] right-[10px] z-[10]">
            <img
              src="/icons/pokeball.png"
              alt=""
              width="auto"
              height="auto"
              className="object-contain h-[30px] "
            />
          </div>
        </Link>

        <Link
          href="/laundry"
          className="flex-1 relative rounded-tl-3xl rounded-br-3xl bg-[#CC5500]/80 p-6 
          text-black transition-colors hover:bg-[#737000]/55 sm:p-8 overflow-hidden"
        >
          <h2 className="mb-4 text-xl font-bold">Laundry Room</h2>
          <div className="absolute bottom-[10px] right-[10px] z-[10]">
            <img
              src="/icons/washerClosed.png"
              alt=""
              width="auto"
              height="auto"
              className="object-contain h-[50px] "
            />
          </div>
        </Link>
        <Link
          href="/ps5Controller"
          className="flex-1 relative rounded-tl-3xl rounded-br-3xl bg-[#D2B558]/80 p-6 
          text-black transition-colors hover:bg-[#CC5500]/45 sm:p-8 overflow-hidden"
        >
          <h2 className="mb-4 text-xl font-bold">PS5 Controllers</h2>
          <div className="absolute bottom-[10px] right-[10px] z-[10]">
            <img
              src="/icons/ps5.svg"
              alt=""
              width="auto"
              height="auto"
              className="object-contain h-[30px] "
            />
          </div>
        </Link>
        <Link
          href="/shoeWasherKey"
          className="flex-1 relative rounded-tl-3xl rounded-br-3xl bg-[#8b0000]/80 p-6 
          text-white transition-colors hover:bg-[#D2B558]/65 sm:p-8 overflow-hidden"
        >
          <h2 className="mb-4 text-xl font-bold">Shoe Washer</h2>
          <div className="absolute bottom-[10px] right-[10px] z-[10]">
            <img
              src="/icons/shoeWasher.png"
              alt=""
              width="auto"
              height="auto"
              className="object-contain h-[50px] "
            />
          </div>
        </Link>
        <Link
          href="/nintendoSwitch"
          className="flex-1 relative rounded-tl-3xl rounded-br-3xl bg-[#D2B558]/80 p-6 
          text-black transition-colors hover:bg-[#D30000]/35 sm:p-8 overflow-hidden"
        >
          <h2 className="mb-4 text-xl font-bold">Nintendo Switch</h2>
          <div className="absolute bottom-[10px] right-[10px] z-[10]">
            <img
              src="/icons/nintendo.png"
              alt=""
              width="auto"
              height="auto"
              className="object-contain h-[20px] "
            />
          </div>
        </Link>
        <Link
          href="/tableTennis"
          className="flex-1 relative rounded-tl-3xl rounded-br-3xl bg-[#CC5500]/80 p-6 
          text-black  transition-colors hover:bg-[#ffff00]/35 sm:p-8 overflow-hidden"
        >
          <h2 className="mb-4 text-xl font-bold text-black">Table Tennis</h2>
          <div className="absolute bottom-[10px] right-[10px] z-[10]">
            <img
              src="/icons/tableTennisSet.png"
              alt=""
              width="auto"
              height="auto"
              className="object-contain h-[40px] "
            />
          </div>
        </Link>
        <Link
          href="/shoppingCarts"
          className="flex-1 relative rounded-tl-3xl rounded-br-3xl bg-[#8b0000]/80 p-6 
          text-white transition-colors hover:bg-[#D2B558]/65 sm:p-8 overflow-hidden"
        >
          <h2 className="mb-4 text-xl font-bold">Shopping Carts</h2>
          <div className="absolute bottom-[10px] right-[10px] z-[10]">
            <img
              src="/icons/cart.png"
              alt=""
              width="auto"
              height="auto"
              className="object-contain h-[50px]"
            />
          </div>
        </Link>
        <Link
          href="/beachBlanket"
          className="flex-1 relative rounded-tl-3xl rounded-br-3xl bg-[#CC5500]/80 p-6 
          text-black  transition-colors hover:bg-[#ffff00]/35 sm:p-8 overflow-hidden"
        >
          <h2 className="mb-4 text-xl font-bold text-black">Beach Blanket</h2>
          <div className="absolute bottom-[10px] right-[10px] z-[10]">
            <img
              src="/icons/blanket.png"
              alt=""
              width="auto"
              height="auto"
              className="object-contain h-[40px] "
            />
          </div>
        </Link>

      </div>
    </SiteMenuBlack>
  );
}
