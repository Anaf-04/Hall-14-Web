"use client";

import Image from "next/image";

export default function MachineCard({ machine }) {
    const leftTime = parseInt(machine["Left Time"], 10);
    const isAvailable = leftTime === 0;
    const isDryer = machine["Machine Type"] === "D";

    function timeBgClass() {
        if (leftTime < 10) return "bg-[#81cd00]";
        if (leftTime < 20) return "bg-[#cdb400]";
        if (leftTime < 25) return "bg-[#cd6200]";
        return "bg-[#8B0000]";
    }

    return (
        <div className="px-1 text-white flex-col gap-2 justify-between flex">
            {isDryer && (
                <div className="flex items-center justify-center gap-3 xl:hidden">
                    <div className="flex min-w-0 items-center gap-2">
                        <span className="shrink-0 text-[11px]">D{machine["Machine ID"]}</span>
                    </div>
                </div>
            )}
            <div className="flex items-center justify-center gap-1 xl:hidden">
                {isDryer ? (
                    <Image
                        src={isAvailable ? "/img/dryerOpen.png" : "/img/dryerClosed.png"}
                        alt=""
                        width={isAvailable ? 30 : 21}
                        height={100}
                        className={`${isAvailable ? "mr-2" : "opacity-40 mb-1.5"}`}
                    />
                ) : (
                    <Image
                        src={isAvailable ? "/img/washerOpen.png" : "/img/washerClosed.png"}
                        alt=""
                        width={isAvailable ? 30 : 21}
                        height={100}
                        className={`${isAvailable ? "ml-2" : "opacity-40 mt-1.5"}`}
                    />
                )}
            </div>
            {!isDryer && (
                <div className="flex items-center justify-center gap-3 xl:hidden">
                    <div className="flex min-w-0 items-center gap-2">
                        <span className="shrink-0 text-[11px]">W{machine["Machine ID"]}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
