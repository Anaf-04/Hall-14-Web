"use client";

export default function MachineCard({ machine }) {
  const leftTime = parseInt(machine["Left Time"], 10);
  const isAvailable = leftTime === 0;

  function timeBgClass() {
    if (leftTime < 10) return "bg-[#81cd00]";
    if (leftTime < 20) return "bg-[#cdb400]";
    if (leftTime < 25) return "bg-[#cd6200]";
    return "bg-[#8B0000]";
  }

  return (
    <div className="rounded-tl-3xl rounded-br-3xl bg-black/70 p-4 text-white">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 font-bold">No. {machine["Machine ID"]}</span>
        </div>
        <span
          className={`shrink-0 px-2 py-1 text-xs font-semibold rounded-tl-xl rounded-br-xl ${
            isAvailable ? "bg-green-900 text-green-200" : timeBgClass()
          }`}
        >
          {isAvailable ? "Available" : leftTime}
        </span>
      </div>
    </div>
  );
}
