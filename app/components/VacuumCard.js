"use client";

export default function VacuumCard({ vacuum, isMine, onReturn, returning }) {
  const isAvailable = vacuum.status === "AVAILABLE";
  const resident = vacuum.resident;

  return (
    <div className="rounded-tl-3xl rounded-br-3xl bg-black/70 p-4 text-white">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 font-bold">Floor {vacuum.floor}</span>
          {!isAvailable && resident?.room_number && (
            <span className="truncate text-sm text-white/70">
              Room {resident.room_number}
            </span>
          )}
        </div>
        {isMine ? (
          <button
            onClick={() => onReturn(vacuum.id)}
            disabled={returning}
            className="shrink-0 px-8 cursor-pointer py-1 text-xs rounded-tl-xl rounded-br-xl bg-[#fc8f01] text-black disabled:opacity-50"
          >
            {returning ? "Returning..." : "Return"}
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
