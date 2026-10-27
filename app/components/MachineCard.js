"use client";
import { useState, } from "react";
import Image from "next/image";

function formatHkTime(dateString) {
  if (!dateString) return null;
  return new Date(dateString).toLocaleTimeString("en-HK", {
    timeZone: "Asia/Hong_Kong",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatHkDate(dateString) {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString("en-HK", {
    timeZone: "Asia/Hong_Kong",
    day: "2-digit",
    month: "short",
  });
}

export default function MachineCard({ machine, facility, borrower }) {
  const leftTime = parseInt(machine["Left Time"], 10);
  const isAvailable = leftTime === 0;
  const isDryer = machine["Machine Type"] === "D";
  const [showLastBorrowerDetail, setShowLastBorrowerDetail] = useState(false);
  const resident = facility?.resident;

  const usedPct = leftTime != null
    ? Math.min(100, Math.round((60 - leftTime) / 60 * 100))
    : null;

  // isAvailable ? "bg-green-900" : "bg-blue-400/60"

  return (
    <div className={`rounded-tl-3xl rounded-br-3xl ${isAvailable ? "bg-green-900" : "bg-[#8b0000]/60"}  text-white relative flex-col flex justify-between`}>
      <div className="rounded-tl-3xl flex items-center justify-between gap-3 bg-black p-4">
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 font-bold">{isDryer ? "D" : "W"}{machine["Machine ID"]}</span>
        </div>
        {borrower && (
          <div className="flex flex-col gap-1 text-xs text-white/70 ">
            <div>{borrower.name?.split(" ")[0]}</div>
            <div>Room {borrower.room_number}</div>
          </div>
        )}
        <span
          className={`shrink-0 px-2 py-1 text-xs font-semibold rounded-tl-xl rounded-br-xl w-25 text-center ${isAvailable  ? "bg-green-900 text-green-200" : "border-1 border-[#8B0000] text-[#8B0000]"
            }`}
        >
          {isAvailable ? "Available" : `${leftTime} mins`} 
        </span>
      </div>
      {isAvailable ? (
        <>
          <div
            className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${showLastBorrowerDetail ? "max-h-24" : "max-h-0"
              }`}
          >
            <div className="w-full bg-[#8b0000]/10 py-2 px-4 text-xs text-white">
              <div className="flex flex-col gap-1">
                <div>{resident?.name}</div>
                <div>Room {resident?.room_number}</div>
                <div>Phone: +852 {resident?.phone_number}</div>
                <div>Time: {formatHkTime(facility?.last_borrowed_at)} - {formatHkTime(facility?.last_returned_at)} ({formatHkDate(facility?.last_borrowed_at)})</div>
              </div>
            </div>
          </div>
          <div
            onClick={() => setShowLastBorrowerDetail((prev) => !prev)}
            className="flex w-full cursor-pointer items-center justify-between py-1 px-4 text-xs font-bold text-black"
          >
            <span>{showLastBorrowerDetail ? "Hide Previous Borrower Detail" : "Show Previous Borrower Detail"}</span>
            <span className={`inline-block transition-transform duration-300 ${showLastBorrowerDetail ? "rotate-180" : ""}`}>
              \/
            </span>
          </div>
        </>
      ) : (
        usedPct != null && (
          <div className="relative h-4 w-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-black transition-[width] duration-500 ease-linear"
              style={{ width: `${usedPct}%` }}
            />
          </div>
        )
      )}
    </div>
  );
}
