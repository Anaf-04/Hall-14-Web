"use client";

import SiteMenu from "./components/SiteMenu";

export default function Home() {
  return (
    <SiteMenu>
      <div className="flex w-[90%] flex-col gap-6 sm:w-[85%] sm:flex-row sm:justify-center py-24">
        <div className="flex-1 flex-column gap-1 justify-center">
          <div className="flex-1 rounded-tl-3xl rounded-br-3xl bg-black/70 p-6 text-white transition-colors sm:p-8">
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl">Welcome to Hall 14</h2>
          </div>
        </div>

        <div className="flex-1 rounded-tl-3xl rounded-br-3xl bg-black/70 p-6 text-white transition-colors sm:p-8">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl">Meet Our Residence Tutors</h2>
          <p className="text-sm leading-relaxed sm:text-base">
            Win exciting prizes and grab some snacks. Come down at G/F Lobby.
          </p>
          <h3 className=" text-2xl text-[#fc8f01] font-bold sm:text-3xl">7-9PM</h3>
          <h3 className=" text-2xl text-[#fc8f01] font-bold sm:text-3xl">August 24th - 28th</h3>
        </div> 
      </div>
    </SiteMenu>
  );
}
