"use client";

import Image from "next/image";

export default function MobileLaundryDisplay({ machine }) {
    const leftTime = parseInt(machine["Left Time"], 10);
    const isAvailable = leftTime === 0;
    const isDryer = machine["Machine Type"] === "D";

    return (
        <div className="px-1 text-white flex-col gap-2 justify-between flex">
            {isDryer && (
                <div className="flex items-center justify-center gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                        <span className="shrink-0 text-[11px]">D{machine["Machine ID"]}</span>
                    </div>
                </div>
            )}
            <div className="flex items-center justify-center gap-1">
                {isDryer ? (
                    <div className={`${isAvailable ? "w-[30px] mr-2" : "w-[21px] opacity-40 mb-1.5 "}`}>
                        <Image
                            src={isAvailable ? "/icons/dryerOpen.png" : "/icons/dryerClosed.png"}
                            alt=""
                            width={100}
                            height={100}
                            style={{ width: "100%", height: "auto" }}
                        />
                    </div>
                ) : (
                    <div className={`${isAvailable ? "w-[30px] ml-2" : "w-[21px] opacity-40 mt-1.5"}`}>
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
            {!isDryer && (
                <div className="flex items-center justify-center gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                        <span className="shrink-0 text-[11px]">W{machine["Machine ID"]}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
