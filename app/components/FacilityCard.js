"use client";
import { useState, } from "react";

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

export default function FacilityCard({ facility, label, icon, isMine, onReturn, returning, succeeded }) {
  const isAvailable = facility.status === "AVAILABLE";
  const resident = facility.resident;
  const [showLastBorrowerDetail, setShowLastBorrowerDetail] = useState(false);

  return (
    <div className="rounded-tl-3xl rounded-br-3xl bg-[#8b0000]/60 text-white relative">
      <div className="rounded-tl-3xl flex items-center justify-between gap-3 bg-black p-4">
        <div className="flex min-w-0 items-center gap-2">
          {icon ? (
            <span className="shrink-0 flex items-center gap-1 font-bold">
              <img src={icon} alt="" className="h-auto w-10" />
            </span>
          ) : (
            <span className="shrink-0 font-bold flex items-center gap-1">
              {facility.floor != null ? <img src={`/img/floor${facility.floor}.png`} alt="" className="h-auto w-7" /> : null}
              {facility.floor != null ? `Floor ${facility.floor}` : label}
            </span>
          )}
          {!isAvailable && resident?.room_number && (
            icon ? (
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 text-xs text-white/70">
                <div>{resident.name?.split(" ")[0]}</div>
                <div>Room {resident.room_number}</div>
                <div>+852 {resident.phone_number}</div>
              </div>
            ) : (
              <span className="truncate text-sm text-white/70">
                Room {resident.room_number}
              </span>
            )
          )}
        </div>
        {isMine ? (
          <button
            onClick={() => onReturn(facility.id)}
            disabled={returning || succeeded}
            className="relative shrink-0 w-20 overflow-hidden cursor-pointer py-1 text-xs rounded-tl-xl rounded-br-xl bg-[#fc8f01] text-black disabled:cursor-default"
          >
            <span
              className={`absolute inset-0 bg-green-900 ease-linear transition-[width] ${succeeded
                ? "w-full duration-300"
                : returning
                  ? "w-[85%] duration-[3000ms]"
                  : "w-0 duration-200"
                }`}
            />
            <span className="relative z-10 font-semibold">Return</span>
          </button>
        ) : (
          <span
            className={`shrink-0 px-2 py-1 text-xs font-semibold rounded-tl-xl rounded-br-xl
            ${isAvailable ? "bg-green-900 text-green-200" : "bg-[#8B0000] text-white"
              }`}
          >
            {isAvailable ? "Available" : "Borrowed"}
          </span>)}
      </div>
      {isAvailable && (
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
                <div>
                  Time: {formatHkTime(facility.last_borrowed_at)} - {formatHkTime(facility.last_returned_at)} ({formatHkDate(facility.last_borrowed_at)})
                </div>
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
      )}

    </div>
  );
}
