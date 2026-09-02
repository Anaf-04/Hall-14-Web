"use client";

import Image from "next/image";

export default function MachineCard({ machine, borrower }) {
  const leftTime = parseInt(machine["Left Time"], 10);
  const isAvailable = leftTime === 0;
  const isDryer = machine["Machine Type"] === "D";

  function timeBgClass() {
    if (leftTime < 5) return "bg-green-600 text-black";
    if (leftTime < 10) return "bg-[#81cd00] text-black";
    if (leftTime < 15) return "bg-[#cd9c00] text-black";
    if (leftTime < 20) return "bg-[#cdb400] text-black";
    if (leftTime < 25) return "bg-[#cd6200] text-black";
    return "bg-[#8B0000] text-black";
  }

  return (
    <div className="rounded-tl-3xl rounded-br-3xl bg-black/70 p-4 text-white flex-col gap-2 flex justify-between">
      <div className="hidden xl:flex items-center justify-center gap-3">
        {isDryer ? (
          <div className={`${isAvailable ? "w-[100px] mr-7" : "w-[70px] opacity-40 mt-5"} `}>
            <Image
              src={isAvailable ? "/icons/dryerOpen.png" : "/icons/dryerClosed.png"}
              alt=""
              width={100}
              height={100}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        ) : (
          <div className={`${isAvailable ? "w-[100px] ml-7" : "w-[70px] opacity-40 mt-5"}`}>
            <Image
              src={isAvailable ? "/icons/washerOpened.png" : "/icons/washerClosed.png"}
              alt=""
              width={100}
              height={100}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 xl:flex-col">
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 font-bold">{isDryer ? "D" : "W"}{machine["Machine ID"]}</span>
        </div>
        {borrower && (
          <div className="hidden sm:flex lg:flex-col items-center gap-3 text-xs text-white/70 ">
            <div>{borrower.name?.split(" ")[0]}</div>
            <div>Room {borrower.room_number}</div>
            <div>+852 {borrower.phone_number}</div>
          </div>
        )}
        <span
          className={`shrink-0 px-2 py-1 text-xs font-semibold rounded-tl-xl rounded-br-xl w-25 text-center ${isAvailable ? "bg-green-900 text-green-200" : timeBgClass()
            }`}
        >
          {isAvailable ? "Available" : `${leftTime} mins`}
        </span>
      </div>
      {borrower && (
        <div className="flex sm:flex-col gap-3 text-xs text-white/70 sm:hidden">
          <div>{borrower.name?.split(" ")[0]}</div>
          <div>Room {borrower.room_number}</div>
          <div>+852 {borrower.phone_number}</div>
        </div>
      )}
    </div>
  );
}
