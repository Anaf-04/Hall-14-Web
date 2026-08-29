"use client";

export default function FacilityCard({ facility, label, icon, isMine, onReturn, returning, succeeded }) {
  const isAvailable = facility.status === "AVAILABLE";
  const resident = facility.resident;

  return (
    <div className="rounded-tl-3xl rounded-br-3xl bg-black/70 p-4 text-white">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {icon ? (
            <span className="shrink-0 flex items-center gap-1 font-bold">
              <img src={icon} alt="" className="h-auto w-10" />
            </span>
          ) : (
            <span className="shrink-0 font-bold">
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
            className="relative shrink-0 w-22 overflow-hidden cursor-pointer py-1 text-xs rounded-tl-xl rounded-br-xl bg-[#fc8f01] text-black disabled:cursor-default"
          >
            <span
              className={`absolute inset-0 bg-green-900 ease-linear transition-[width] ${succeeded
                  ? "w-full duration-300"
                  : returning
                    ? "w-[85%] duration-[3000ms]"
                    : "w-0 duration-200"
                }`}
            />
            <span className="relative z-10">Return</span>
          </button>
        ) : (<span
          className={`shrink-0 px-2 py-1 text-xs font-semibold rounded-tl-xl rounded-br-xl
            ${isAvailable ? "bg-green-900 text-green-200" : "bg-[#8B0000] text-white"
            }`}
        >
          {isAvailable ? "Available" : "Borrowed"}
        </span>)}

      </div>
    </div>
  );
}
