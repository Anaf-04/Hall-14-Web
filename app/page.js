"use client";

import SiteMenu from "./components/SiteMenu";

export default function Home() {
  return (
    <SiteMenu>
      <div className="flex w-[90%] flex-col gap-6 sm:w-[85%] sm:flex-row sm:justify-center py-24">
        <div className="flex-1 flex-column gap-1 justify-center">
          <div className="flex-1 rounded-tl-3xl rounded-br-3xl bg-black/70 p-6 text-white transition-colors sm:p-8">
            <h2 className="text-2xl font-bold sm:text-3xl">Welcome to Hall 14</h2>
          </div>

          <div className="flex-1 rounded-tl-3xl rounded-br-3xl bg-black/70 p-6 mt-6 text-white transition-colors sm:p-8">

            <div className="flex overflow-hidden">
              <div className="min-w-full flex flex-col gap-2 animate-slide-left">
                <h2 className="text-2xl font-bold text-white sm:text-3xl">Grab your Hall 14 Tshirt</h2>
                <div className="relative w-full h-24 sm:h-32 flex gap-3">
                  <img
                    src="/img/h14-tshirt.png"
                    alt="Hall 14 Tshirt"
                    className="h-full w-auto object-contain"
                  />
                  <div className="flex flex-col gap-3">
                    <h3 className=" text-xs sm:text-xl text-[#fc8f01] font-bold ">Join as helpers for hall events</h3>
                    <h3 className=" text-xs sm:text-xl text-[#fc8f01] font-bold ">Join the Hall 14 advocacy team</h3>
                  </div>
                </div>

              </div>

              <div className="min-w-full flex flex-col gap-2 animate-slide-left">
                <h2 className="text-2xl font-bold text-white sm:text-3xl">Exclusive for Players</h2>
                <div className="relative w-full h-22 sm:h-28 flex gap-3">
                  <img
                    src="/img/h14Players.png"
                    alt="Hall 14 Players"
                    className="h-full w-auto object-contain"
                  />
                  <div className="flex flex-col gap-3">
                    <h3 className=" text-xs sm:text-xl text-[#fc8f01] font-bold ">Join the Inter-Hall Contest Fun Day (ICFD) Competitions</h3>
                    <h3 className=" text-xs sm:text-xl text-[#fc8f01] font-bold ">Tug of War (September)</h3>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="flex-1 flex-column gap-1 justify-center">
          <div className="flex-1 rounded-tl-3xl rounded-br-3xl bg-[#35063E]/70 p-6 text-white transition-colors sm:p-8">
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl">Hall 14 Induction Night</h2>
            <p className="text-sm leading-relaxed sm:text-base">
              Get to know our Residence Master and Tutors. Participate in kahoot and games to win prizes. Free food. Lucky draws.
            </p>
            <h3 className=" text-2xl text-[#fc8f01] font-bold sm:text-3xl">7:30-9:30PM</h3>
            <h3 className=" text-2xl text-[#fc8f01] font-bold sm:text-3xl">September 3rd</h3>
          </div>
        </div>
      </div>
    </SiteMenu>
  );
}
