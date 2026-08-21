"use client";

import Image from "next/image";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-10 flex min-h-screen w-screen items-center justify-center bg-black/50">
      <div className="absolute inset-x-0 bottom-0 h-full w-full bg-[#8b0000] z-5" />
      <Image
        src="/img/eye.svg"
        alt="Loading vacuum availability"
        fill
        priority
        className="z-10 object-contain opacity-80"
      />
    </div>
  );
}
