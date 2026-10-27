"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { label: "HOME", href: "/" },
  { label: "FACILITIES", href: "/facilities" },
  { label: "HMT", href: "/hmt" },
  { label: "HALL RULES", href: "/hall-rules" },
];

const FEATHER_PATH =
  "M0 0 C0.495 2.475 0.495 2.475 1 5 C2.32 4.67 3.64 4.34 5 4 " +
  "C4.52500588 9.193269 2.6104144 12.76029192 -0.25 17 C-0.63285156 17.59039063 " +
  "-1.01570313 18.18078125 -1.41015625 18.7890625 C-8.20125205 29.10062603 -8.20125205 " +
  "29.10062603 -12 31 C-12 31.66 -12 32.32 -12 33 C-12.66 33 -13.32 33 -14 33 " +
  "C-14.13921875 33.86044922 -14.13921875 33.86044922 -14.28125 34.73828125 " +
  "C-15.70303324 39.21226222 -19.28242561 42.29236666 -23 45 C-26.18898505 " +
  "45.93012064 -28.63427816 46 -32 46 C-31.70802734 46.92039062 -31.70802734 " +
  "46.92039062 -31.41015625 47.859375 C-31 50 -31 50 -32.4375 52.25 C-32.953125 " +
  "52.8275 -33.46875 53.405 -34 54 C-34.66 52.02 -35.32 50.04 -36 48 C-40.24822374 " +
  "48.47202486 -42.19989709 50.96655518 -45 54 C-46.32 53.34 -47.64 52.68 -49 52 " +
  "C-47.34908222 47.70761377 -44.26245434 45.1206085 -41 42 C-41.33 41.34 -41.66 40.68 " +
  "-42 40 C-43.3266806 36.01995819 -43.33848239 33.19718159 -43 29 C-41.5 27 -41.5 27 " +
  "-40 26 C-37 27 -37 27 -36 29 C-36.0825 27.88625 -36.165 26.7725 -36.25 25.625 " +
  "C-35.63032259 20.19314025 -31.65117266 17.60652426 -27.65722656 14.41455078 " +
  "C-19.85963831 8.41325296 -19.85963831 8.41325296 -15.75 7.5 C-15.1725 7.335 " +
  "-14.595 7.17 -14 7 C-13.67 6.01 -13.34 5.02 -13 4 C-8.81828715 1.52898786 " +
  "-4.88395628 0 0 0 Z";

export default function SiteMenu({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pageTop, setPageTop] = useState(false);
  const pageTopButtonRef = useRef(null);

  useEffect(() => {
    const pageTopButton = pageTopButtonRef.current;

    if (!pageTopButton) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setPageTop(false);
      }
    });

    observer.observe(pageTopButton);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden">
        <Image
          src="/img/backgroundBlack.png"
          alt=""
          fill
          priority
          className="object-cover -z-10"
        />

        <div
          className={`fixed inset-0 z-30 flex bg-black transition-opacity duration-500 ${menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
        >
          <nav className="relative flex flex-1 flex-col items-start justify-center overflow-hidden pb-30">
            <Image
              src="/icons/Hall14Logo.png"
              alt=""
              fill
              className="object-cover absolute right-50 grayscale-100 opacity-10 -z-10"
            />
            <Image
              src="/icons/halloween.jpg"
              alt=""
              fill
              className="object-cover absolute grayscale-10 opacity-90 -z-20"
            />
            {NAV_LINKS.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  transitionDelay: menuOpen ? `${index * 75}ms` : "0ms",
                  textShadow:
                    "1px 1px 0px #8b0000, 2px 2px 0px #8b0000, 3px 3px 0px #8b0000, 4px 4px 0px #8b0000, 5px 5px 0px #a35c00, 6px 6px 1px rgba(0,0,0,0.1), 7px 7px 6px rgba(0,0,0,0.3)",
                }}
                className={`inline-block px-8 py-4 text-3xl font-bold text-[#FFF] hover:text-[#fc8f01] transition-all duration-100 sm:text-4xl ${menuOpen
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-12 opacity-0"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <nav className="absolute inset-x-0 top-0 z-20 grid h-20 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center bg-[#000000b3] px-4 text-white sm:px-8">
          <span className="justify-self-end pr-3 text-xl font-bold sm:text-2xl">
            CITYUHK
          </span>
          <Image
            src="/icons/navImg.png"
            alt="Hall 14 logo"
            width={72}
            height={72}
            className="h-16 w-16 object-contain"
          />
          <span className="justify-self-start pl-3 text-xl font-bold sm:text-2xl">
            HALL 14
          </span>
        </nav>

        {children}

        <a
          href="https://www.instagram.com/cityuhall14?igsi=MTJ2dDgzZ3pqZTk0MA=="
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Hall 14 on Instagram"
          className={`group fixed top-4 right-4 z-50 flex h-18 w-18 items-center justify-center 
            border-2 border-[#8B0000] bg-black transition-[transform,opacity,background-color] 
            ease-out hover:opacity-20 ${menuOpen
              ? "translate-x-0 opacity-100"
              : "pointer-events-none translate-x-100 opacity-0"
            }`}
        >
          <span className="absolute bottom-full right-0 top-35 whitespace-nowrap -rotate-90 text-lg font-bold text-white">
            Follow us
          </span>
          <span className="absolute left-[-20] top-8 -translate-x-full -translate-y-1/2 whitespace-nowrap text-lg font-bold text-white">
            Our Instagram Page
          </span>
          <svg
            fill="#8B0000"
            width="48"
            height="48"
            viewBox="0 0 32 32"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M22.3,8.4c-0.8,0-1.4,0.6-1.4,1.4c0,0.8,0.6,1.4,1.4,1.4c0.8,0,1.4-0.6,1.4-1.4C23.7,9,23.1,8.4,22.3,8.4z" />
            <path d="M16,10.2c-3.3,0-5.9,2.7-5.9,5.9s2.7,5.9,5.9,5.9s5.9-2.7,5.9-5.9S19.3,10.2,16,10.2z M16,19.9c-2.1,0-3.8-1.7-3.8-3.8c0-2.1,1.7-3.8,3.8-3.8c2.1,0,3.8,1.7,3.8,3.8C19.8,18.2,18.1,19.9,16,19.9z" />
            <path d="M20.8,4h-9.5C7.2,4,4,7.2,4,11.2v9.5c0,4,3.2,7.2,7.2,7.2h9.5c4,0,7.2-3.2,7.2-7.2v-9.5C28,7.2,24.8,4,20.8,4z M25.7,20.8c0,2.7-2.2,5-5,5h-9.5c-2.7,0-5-2.2-5-5v-9.5c0-2.7,2.2-5,5-5h9.5c2.7,0,5,2.2,5,5V20.8z" />
          </svg>
        </a>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="hover:cursor-pointer transition-transform
        duration-300 hover:scale-90 group fixed bottom-4
        left-4 z-50 flex flex-col border-2 border-[#fc8f01] h-18 w-18
        items-center justify-center bg-black"
        >
          <svg
            width="70"
            height="70"
            viewBox="0 0 130 130"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g
              className={`transition-all duration-750 ease-out delay-0 ${menuOpen
                ? "-translate-x-[220px] translate-y-[60px] opacity-0"
                : "translate-x-0 translate-y-[60px] opacity-100 group-hover:translate-y-[70px]"
                }`}
            >
              <path d={FEATHER_PATH} fill="#fc8f01" transform="rotate(45 100 100)" />
            </g>
            <g
              className={`transition-all duration-750 ease-out delay-100 ${menuOpen
                ? "-translate-x-[220px] translate-y-[100px] opacity-0"
                : "translate-x-0 translate-y-[100px] opacity-100 group-hover:translate-y-[100px]"
                }`}
            >
              <path d={FEATHER_PATH} fill="#fc8f01" transform="rotate(45 100 100)" />
            </g>
            <g
              className={`transition-all duration-750 ease-out delay-200 ${menuOpen
                ? "-translate-x-[220px] translate-y-[140px] opacity-0"
                : "translate-x-0 translate-y-[140px] opacity-100 group-hover:translate-y-[130px]"
                }`}
            >
              <path d={FEATHER_PATH} fill="#fc8f01" transform="rotate(45 100 100)" />
            </g>

            {/* CROSS SIGN */}
            <g
              className={`transition-all duration-500 ease-out ${menuOpen
                ? "translate-x-[70px] translate-y-[55px] opacity-100 delay-[100ms]"
                : "-translate-x-[0px] -translate-y-[-120px] opacity-0 delay-0"
                }`}
            >
              <path d={FEATHER_PATH} fill="#fc8f01" />
            </g>
            <g
              className={`transition-all duration-500 ease-out ${menuOpen
                ? "translate-x-[70px] translate-y-[30px] opacity-100 delay-[100ms]"
                : "-translate-x-[0px] -translate-y-[40px] opacity-0 delay-0"
                }`}
            >
              <path d={FEATHER_PATH} fill="#fc8f01" transform="rotate(90 -20 20)" />
            </g>
            <g
              className={`transition-all duration-500 ease-out ${menuOpen
                ? "translate-x-[100px] translate-y-[65px] opacity-100 delay-[100ms]"
                : "-translate-x-[-150px] -translate-y-[-120px] opacity-0 delay-0"
                }`}
            >
              <path d={FEATHER_PATH} fill="#fc8f01" transform="rotate(-90 -20 20)" />
            </g>
            <g
              className={`transition-all duration-500 ease-out ${menuOpen
                ? "translate-x-[100px] translate-y-[35px] opacity-100 delay-[100ms]"
                : "-translate-x-[-160px] -translate-y-[40px] opacity-0 delay-0"
                }`}
            >
              <path d={FEATHER_PATH} fill="#fc8f01" transform="rotate(180 -20 20)" />
            </g>
          </svg>
        </button>
      </div>

      <footer className="flex h-[200px] shrink-0 flex-col bg-black text-white">
        <div className="flex flex-1 flex-col items-center justify-center gap-1">
          <button
            ref={pageTopButtonRef}
            type="button"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              setPageTop(true);
            }}
            className="group flex flex-col items-center gap-1 text-white transition-colors hover:opacity-50 cursor-pointer"
          >
            <svg
              width="70"
              height="70"
              viewBox="0 0 130 130"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g
                className={`transition-all duration-500 ease-out ${pageTop
                  ? "-translate-x-[0px] -translate-y-[-120px] opacity-0 delay-0"
                  : "translate-x-[70px] translate-y-[60px] opacity-100 delay-[100ms]"
                  }`}
              >
                <path d={FEATHER_PATH} fill="#8b0000" />
              </g>
              <g
                className={`transition-all duration-500 ease-out ${pageTop
                  ? "-translate-x-[-150px] -translate-y-[-120px] opacity-0 delay-0"
                  : "translate-x-[100px] translate-y-[65px] opacity-100 delay-[100ms]"
                  }`}
              >
                <path d={FEATHER_PATH} fill="#8b0000" transform="rotate(-90 -20 20)" />
              </g>
            </svg>
            <span className="text-sm font-bold tracking-wide">PAGE TOP</span>
          </button>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-1 px-8 text-center text-xs text-white/70 sm:text-sm">
          <div className="flex w-[100%] items-center justify-center gap-2">
            <a href="mailto:hall14mos@gmail.com" className="text-white/70 hover:text-[#8b0000]">
              Contact Us |
            </a>
            <a href="https://www.cityu.edu.hk/sro/StudentHousing/UGHalls/HallAdmission/MOS/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#8b0000]">
              Ma on Shan Compound |
            </a>
            <a href="https://www.cityu.edu.hk/sro/AboutUs/MOS/ResidenceHalls/SR14.htm" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#8b0000]">
              About Us
            </a>
          </div>
          <p>&copy; {new Date().getFullYear()} Hall 14, City University of Hong Kong. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
