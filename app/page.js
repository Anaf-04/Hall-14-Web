"use client";

import SiteMenu from "./components/SiteMenu";

export default function Home() {

  return (
    <SiteMenu
      afterHero={
        <div className="relative w-full h-[140px] sm:h-[570px]">
          <video
            src="/video/intro.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          />
            <a
              href="https://www.instagram.com/reel/DWYtXmIkQOD/?stkn=bmhhejdkNXEzdTM3"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 bg-[#8B0000]/10 flex items-center justify-center"
              aria-label="Watch on Instagram"
            >
              <svg
                viewBox="0 0 24 24"
                fill="white"
                className="w-3 h-3 sm:w-10 sm:h-10"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              <img
                src="/icons/playBorder.png"
                alt=""
                width="auto"
                height="auto"
                className="object-contain h-auto w-8 sm:w-20 absolute" 
              />
            </a>
          </div>
      }
    >
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
                    <h3 className=" text-xl text-[#fc8f01] font-bold ">BasketBall</h3>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="flex-1 flex-column gap-1 justify-center">
          <div className="flex-1 rounded-tl-3xl rounded-br-3xl bg-[#fc8f01]/30 p-6 text-white transition-colors sm:p-8">
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl">Resident Led Activities</h2> 
            <p className="text-sm leading-relaxed sm:text-base"> 
              Join as participants to earn returning points and make new friends!
            </p>
            <h3 className=" text-xs text-[#fc8f01] font-bold sm:text-xl mt-2">1. Hall 14 Treasure Hunt (9th Oct, 8-10pm)</h3>
            <h3 className=" text-xs text-[#fc8f01] font-bold sm:text-xl">2. Cineworld (16th Oct, 7-9pm)</h3>
            <h3 className=" text-xs text-[#fc8f01] font-bold sm:text-xl">3. Halloween Party!! (31st Oct, 7-10pm)</h3>
            <h3 className=" text-xs text-[#fc8f01] font-bold sm:text-xl">4. Mario Kart Fun Night (5th Nov, 6-9pm)</h3>
            <h3 className=" text-xs text-[#fc8f01] font-bold sm:text-xl">5. Kazakh Cultural Exchange Night (20th Nov, 6-9:30pm)</h3>
          </div>    
        </div>
      </div>
    </SiteMenu>
  );
}
