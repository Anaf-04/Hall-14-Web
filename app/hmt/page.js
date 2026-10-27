"use client";

import { useEffect, useRef } from "react";
import SiteMenuWhite from "../components/SiteMenuWhite";

const ANIM_CSS = `
.hmt-anim [data-anim="img"] {
  opacity: 0;
  transform: translateX(-80px);
}
.hmt-anim [data-anim="img"][data-show] {
  opacity: 1;
  transform: translateX(0);
  transition: opacity 0.7s ease-out, transform 0.7s ease-out;
}
.hmt-anim [data-anim="type"] {
  clip-path: inset(0 100% 0 0);
}
.hmt-anim [data-anim="type"][data-show] {
  clip-path: inset(0 0 0 0);
  transition: clip-path var(--type-duration, 1.5s) steps(var(--type-steps, 20), end);
}
@media (prefers-reduced-motion: reduce) {
  .hmt-anim [data-anim] {
    opacity: 1 !important;
    transform: none !important;
    clip-path: none !important;
    transition: none !important;
  }
}
`;

export default function HMT() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const targets = root.querySelectorAll("img, h1, h2, h3, div.h-1");
    targets.forEach((el) => {
      if (el.tagName === "IMG") {
        el.dataset.anim = "img";
        return;
      }
      el.dataset.anim = "type";
      const chars = el.textContent.trim().length;
      const steps = chars || 20;
      el.style.setProperty("--type-steps", steps);
      el.style.setProperty(
        "--type-duration",
        `${Math.min(Math.max(steps * 0.07, 0.8), 2.5)}s`
      );
    });

    // IntersectionObserver treats a fully clip-path'd target as invisible, so
    // the typewriter elements would never trigger. Bounding rects ignore clip-path.
    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      targets.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const margin = Math.min(rect.height * 0.15, 40);
        const visible = rect.bottom > margin && rect.top < vh - margin;
        if (visible) {
          if (!el.hasAttribute("data-show")) el.setAttribute("data-show", "");
        } else if (el.hasAttribute("data-show")) {
          el.removeAttribute("data-show");
        }
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, true);
    window.addEventListener("resize", schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <SiteMenuWhite>
      <style>{ANIM_CSS}</style>
      <div ref={rootRef} className="hmt-anim flex flex-col w-[100%] my-25 gap-1 sm:justify-center p-4 sm:p-12">
        <h1 className="mb-4 text-2xl font-bold sm:text-3xl text-[#8b0000]">HALL MANAGEMENT TEAM</h1>
        <div className="flex gap-2">
          <img
            src="/HMT/profCrystal.png"
            alt="HMT"
            className="object-contain rounded-tl-3xl rounded-br-3xl w-[200px]"
          />
          <div className="flex flex-col">
            <h2 className="mt-1 font-bold text-2xl text-[#fff]">Residence <br></br>Master</h2>
            <h3 className="mt-1 font-bold text-sm text-[#fc8f01]">Associate Head</h3>
            <h3 className="mt-1 font-bold text-sm text-[#fc8f01]">Associate Professor</h3>
            <h3 className="mt-1 font-bold text-xs text-[#8b0000]">Department of Media and Communication</h3>
          </div>
        </div>

        <h1 className="mt-4 text-2xl font-bold sm:text-3xl text-[#8b0000]">2026-2027</h1>
        <div className="w-full mb-1 h-1 bg-[#8b0000]"></div>
        <div className="grid grid-cols-3 sm:grid-cols-7 gap-1 flex sm:flex-start">
          <div className="w-[130px]">
            <img
              src="/HMT/anaf.png"
              alt="HMT"
              className="object-contain rounded-tl-3xl rounded-br-3xl"
            />
            <h2 className="mt-1 font-bold text-lg text-[#fff]">Senior</h2>
          </div>
          <div className="w-[130px]">
            <img
              src="/HMT/changyuan.png"
              alt="HMT"
              className="object-contain rounded-tl-3xl rounded-br-3xl"
            />
            <h2 className="mt-1 font-bold text-lg text-[#fff]">Disciplinary</h2>
          </div>
          <div className="w-[130px]">
            <img
              src="/HMT/ruilin.png"
              alt="HMT"
              className="object-contain rounded-tl-3xl rounded-br-3xl"
            />
            <h2 className="mt-1 font-bold text-lg text-[#fff]">Finance</h2>
          </div>
          <div className="w-[130px]">
            <img
              src="/HMT/ethan.png"
              alt="HMT"
              className="object-contain rounded-tl-3xl rounded-br-3xl"
            />
            <h2 className="mt-1 font-bold text-lg text-[#fff]">ICFD</h2>
          </div>
          <div className="w-[130px]">
            <img
              src="/HMT/ruhi.png"
              alt="HMT"
              className="object-contain rounded-tl-3xl rounded-br-3xl"
            />
            <h2 className="mt-1 font-bold text-lg text-[#fff]">Events</h2>
          </div>
          <div className="w-[130px]">
            <img
              src="/HMT/islam.png"
              alt="HMT"
              className="object-contain rounded-tl-3xl rounded-br-3xl"
            />
            <h2 className="mt-1 font-bold text-lg text-[#fff]">Facilities</h2>
          </div>
          <div className="w-[130px]">
            <img
              src="/HMT/chessa.png"
              alt="HMT"
              className="object-contain rounded-tl-3xl rounded-br-3xl"
            />
            <h2 className="mt-1 font-bold text-lg text-[#fff]">Advocacy</h2>
          </div>
        </div>
        <h1 className="mt-4 text-2xl font-bold sm:text-3xl text-[#8b0000]">2025-2026</h1>
        <div className="w-full h-1 mb-1 bg-[#8b0000]"></div>
        <div className="grid grid-cols-3 sm:grid-cols-8 gap-1">
          <div className="w-[130px]">
            <img
              src="/HMT/mashal.png"
              alt="HMT"
              className="object-contain rounded-tl-3xl rounded-br-3xl"
            />
            <h2 className="mt-1 font-bold text-lg text-[#fff]">Senior</h2>
          </div>
          <div className="w-[130px]">
            <img
              src="/HMT/ruilin.png"
              alt="HMT"
              className="object-contain rounded-tl-3xl rounded-br-3xl"
            />
            <h2 className="mt-1 font-bold text-lg text-[#fff]">Finance</h2>
          </div>
          <div className="w-[130px]">
            <img
              src="/HMT/kezia.png"
              alt="HMT"
              className="object-contain rounded-tl-3xl rounded-br-3xl"
            />
            <h2 className="mt-1 font-bold text-lg text-[#fff]">Events</h2>
          </div>
          <div className="w-[130px]">
            <img
              src="/HMT/audrey.png"
              alt="HMT"
              className="object-contain rounded-tl-3xl rounded-br-3xl"
            />
            <h2 className="mt-1 font-bold text-lg text-[#fff]">Advocacy</h2>
          </div>
          <div className="w-[130px]">
            <img
              src="/HMT/rayan.png"
              alt="HMT"
              className="object-contain rounded-tl-3xl rounded-br-3xl"
            />
            <h2 className="mt-1 font-bold text-lg text-[#fff]">ICFD</h2>
          </div>
          <div className="w-[130px]">
            <img
              src="/HMT/jessie.png"
              alt="HMT"
              className="object-contain rounded-tl-3xl rounded-br-3xl"
            />
            <h2 className="mt-1 font-bold text-lg text-[#fff]">Disciplinary</h2>
          </div>
          <div className="w-[130px]">
            <img
              src="/HMT/intiser.png"
              alt="HMT"
              className="object-contain rounded-tl-3xl rounded-br-3xl"
            />
            <h2 className="mt-1 font-bold text-lg text-[#fff]">Facilities (A)</h2>
          </div>
          <div className="w-[130px]">
            <img
              src="/HMT/anaf.png"
              alt="HMT"
              className="object-contain rounded-tl-3xl rounded-br-3xl"
            />
            <h2 className="mt-1 font-bold text-lg text-[#fff]">Facilities (B)</h2>
          </div>
        </div>
        <h1 className="mt-4 text-2xl mb-1 font-bold sm:text-3xl text-[#8b0000]">2024-2025</h1>
        <div className="w-full h-1 bg-[#8b0000]"></div>
        <div className="grid grid-cols-3 sm:grid-cols-7 gap-1">
          <div className="w-[130px]">
            <img
              src="/HMT/myrzabek.png"
              alt="HMT"
              className="object-contain rounded-tl-3xl rounded-br-3xl"
            />
            <h2 className="mt-1 font-bold text-lg text-[#fff]">Senior</h2>
          </div>
          <div className="w-[130px]">
            <img
              src="/HMT/mashal.png"
              alt="HMT"
              className="object-contain rounded-tl-3xl rounded-br-3xl"
            />
            <h2 className="mt-1 font-bold text-lg text-[#fff]">Disciplinary</h2>
          </div>
          <div className="w-[130px]">
            <img
              src="/HMT/kezia.png"
              alt="HMT"
              className="object-contain rounded-tl-3xl rounded-br-3xl"
            />
            <h2 className="mt-1 font-bold text-lg text-[#fff]">Events</h2>
          </div>
          <div className="w-[130px]">
            <img
              src="/HMT/audrey.png"
              alt="HMT"
              className="object-contain rounded-tl-3xl rounded-br-3xl"
            />
            <h2 className="mt-1 font-bold text-lg text-[#fff]">Advocacy</h2>
          </div>
          <div className="w-[130px]">
            <img
              src="/HMT/faran.png"
              alt="HMT"
              className="object-contain rounded-tl-3xl rounded-br-3xl"
            />
            <h2 className="mt-1 font-bold text-lg text-[#fff]">Finance</h2>
          </div>
          <div className="w-[130px]">
            <img
              src="/HMT/rayan.png"
              alt="HMT"
              className="object-contain rounded-tl-3xl rounded-br-3xl"
            />
            <h2 className="mt-1 font-bold text-lg text-[#fff]">ICFD</h2>
          </div>
          <div className="w-[130px]">
            <img
              src="/HMT/intiser.png"
              alt="HMT"
              className="object-contain rounded-tl-3xl rounded-br-3xl"
            />
            <h2 className="mt-1 font-bold text-lg text-[#fff]">Facilities</h2>
          </div>
        </div>
      </div>
    </SiteMenuWhite>
  );
}
