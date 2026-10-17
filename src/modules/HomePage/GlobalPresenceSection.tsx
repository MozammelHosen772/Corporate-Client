// "use client";

// import { motion, useReducedMotion } from "framer-motion";
// import { BarChart3, Globe, PieChart, Users } from "lucide-react";
// import Image from "next/image";

// import Reveal from "./Reveal";

// // Map box is 560 x 220, so the SVG viewBox is 100 x 39.3 (y = top% * 0.393)
// const MAP_H = 39.3;

// const pins = [
//   { name: "New York", left: 17, top: 38 },
//   { name: "London", left: 46, top: 27 },
//   { name: "Dubai", left: 60, top: 48 },
//   { name: "Hong Kong", left: 78, top: 47 },
//   { name: "Singapore", left: 74, top: 68 },
// ];

// // Curved route between neighbouring hubs
// const arcs = pins.slice(0, -1).map((a, i) => {
//   const b = pins[i + 1];
//   const x1 = a.left;
//   const y1 = (a.top * MAP_H) / 100;
//   const x2 = b.left;
//   const y2 = (b.top * MAP_H) / 100;
//   const cx = (x1 + x2) / 2;
//   const cy = Math.min(y1, y2) - 7;
//   return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
// });

// const stats = [
//   {
//     icon: Globe,
//     value: "5",
//     unit: "Global hubs",
//     title: "Global reach",
//     text: "A truly international presence across continents.",
//   },
//   {
//     icon: BarChart3,
//     value: "30+",
//     unit: "Markets",
//     title: "Markets",
//     text: "Strategic presence in key global markets.",
//   },
//   {
//     icon: Users,
//     value: "10k+",
//     unit: "People",
//     title: "Workforce",
//     text: "A diverse and talented global team.",
//   },
//   {
//     icon: PieChart,
//     value: "$2B+",
//     unit: "Revenue",
//     title: "Revenue",
//     text: "Sustainable growth across our portfolio.",
//   },
// ];

// export default function GlobalPresenceSection() {
//   const reduce = useReducedMotion();

//   return (
//     <section
//       id="global"
//       className="relative overflow-hidden border-t border-[#c8a15a]/25 bg-gradient-to-b from-[#12100c] to-[#0c0a08] py-16 text-[#d8d2c8] sm:py-20"
//     >
//       <div className="relative mx-auto max-w-[1180px] px-5 sm:px-7">
//         {/* Header */}
//         <div className="mb-10 grid items-end gap-5 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
//           <Reveal>
//             <h2 className="font-serif text-4xl font-medium leading-[1.1] text-white sm:text-5xl">
//               A global presence.
//               <br />
//               <span className="text-[#c8a15a]">A lasting impact.</span>
//             </h2>
//           </Reveal>
//           <Reveal delay={0.1}>
//             <p className="max-w-[420px] border-l border-[#c8a15a]/40 pl-5 text-[15px] leading-[1.8] text-[#968f83]">
//               From New York to Singapore, our hubs connect capital, people and
//               markets across five financial centres.
//             </p>
//           </Reveal>
//         </div>

//         {/* Map: no background panel, up to 1400px wide */}
//         <div className="relative left-1/2 w-[min(100vw,1400px)] -translate-x-1/2 px-5 sm:px-7">
//           <motion.div
//             className="relative"
//             initial={{ opacity: 0, y: reduce ? 0 : 24 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true, margin: "-60px" }}
//             transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
//           >
//             <div className="relative mx-auto aspect-[560/220] w-full max-w-[1400px]">
//               <Image
//                 src="/images/world-map.png"
//                 alt="World map showing our offices"
//                 fill
//                 sizes="(min-width: 1400px) 1400px, 100vw"
//                 className="object-contain opacity-70"
//               />

//               {/* connecting arcs */}
//               <svg
//                 aria-hidden
//                 viewBox={`0 0 100 ${MAP_H}`}
//                 className="pointer-events-none absolute inset-0 h-full w-full"
//               >
//                 {arcs.map((d, i) => (
//                   <motion.path
//                     key={d}
//                     d={d}
//                     fill="none"
//                     stroke="#c8a15a"
//                     strokeWidth={1.2}
//                     strokeDasharray="1.5 2"
//                     strokeLinecap="round"
//                     vectorEffect="non-scaling-stroke"
//                     initial={{
//                       pathLength: reduce ? 1 : 0,
//                       opacity: reduce ? 0.6 : 0,
//                     }}
//                     whileInView={{ pathLength: 1, opacity: 0.6 }}
//                     viewport={{ once: true }}
//                     transition={{
//                       duration: 1,
//                       delay: 0.9 + i * 0.35,
//                       ease: "easeInOut",
//                     }}
//                   />
//                 ))}
//                 {/* glowing dot travelling from one city to the next, then looping */}
//                 {!reduce &&
//                   arcs.map((d, i) => {
//                     const n = arcs.length;
//                     const a = i / n;
//                     const b = (i + 1) / n;
//                     const e = 0.001;
//                     return (
//                       <g key={`dot-${d}`} opacity="0">
//                         <circle r="1.6" fill="#c8a15a" opacity="0.35" />
//                         <circle r="0.7" fill="#f3dfae" />
//                         <animateMotion
//                           dur={`${n * 2.2}s`}
//                           begin="3.5s"
//                           repeatCount="indefinite"
//                           path={d}
//                           calcMode="linear"
//                           keyPoints="0;0;1;1"
//                           keyTimes={`0;${a};${b};1`}
//                         />
//                         <animate
//                           attributeName="opacity"
//                           dur={`${n * 2.2}s`}
//                           begin="3.5s"
//                           repeatCount="indefinite"
//                           values="0;0;1;1;0;0"
//                           keyTimes={`0;${a};${a + e};${b - e};${b};1`}
//                         />
//                       </g>
//                     );
//                   })}
//               </svg>

//               {/* pins */}
//               {pins.map((p, i) => (
//                 <motion.div
//                   key={p.name}
//                   className="absolute -translate-x-1/2 -translate-y-1/2"
//                   style={{ left: `${p.left}%`, top: `${p.top}%` }}
//                   initial={{ opacity: 0, scale: reduce ? 1 : 0.5 }}
//                   whileInView={{ opacity: 1, scale: 1 }}
//                   viewport={{ once: true }}
//                   transition={{ duration: 0.45, delay: 0.5 + i * 0.25 }}
//                 >
//                   <span className="relative flex h-3 w-3">
//                     {!reduce && (
//                       <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e0c28a] opacity-60" />
//                     )}
//                     <span className="relative h-3 w-3 rounded-full border-2 border-[#0c0a08] bg-[#e0c28a] shadow-[0_0_14px_#c8a15a]" />
//                   </span>
//                   <span className="absolute left-5 top-1/2 hidden -translate-y-1/2 whitespace-nowrap border border-[#c8a15a]/30 bg-[#0c0a08]/80 px-2 py-0.5 text-[11px] lg:text-[13px] text-[#e9e2d3] backdrop-blur-sm sm:block">
//                     {p.name}
//                   </span>
//                 </motion.div>
//               ))}
//             </div>

//             {/* mobile legend (labels are hidden on small maps) */}
//             <ul className="mt-4 flex flex-wrap justify-center gap-2 sm:hidden">
//               {pins.map((p) => (
//                 <li
//                   key={p.name}
//                   className="flex items-center gap-1.5 border border-[#c8a15a]/30 px-2.5 py-1 text-[11px] text-[#e9e2d3]"
//                 >
//                   <span className="h-1.5 w-1.5 rounded-full bg-[#e0c28a]" />
//                   {p.name}
//                 </li>
//               ))}
//             </ul>
//           </motion.div>
//         </div>

//         {/* Stats */}
//         <dl className="mt-10 grid grid-cols-2 gap-y-8 lg:grid-cols-4 lg:gap-y-0">
//           {stats.map(({ icon: Icon, value, unit, title, text }, i) => (
//             <Reveal key={title} delay={0.1 + i * 0.08} y={16}>
//               <div
//                 className={`flex h-full flex-col gap-3 px-4 sm:px-6 ${
//                   i > 0 ? "lg:border-l lg:border-[#c8a15a]/20" : "lg:pl-0"
//                 } ${i % 2 === 1 ? "border-l border-[#c8a15a]/20 lg:border-l" : ""}`}
//               >
//                 <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c8a15a]/50 text-[#c8a15a]">
//                   <Icon className="h-5 w-5 stroke-[1.4]" />
//                 </span>
//                 <dt className="flex items-baseline gap-2">
//                   <span className="font-serif text-3xl text-white sm:text-4xl">
//                     {value}
//                   </span>
//                   <span className="text-xs text-[#c8a15a]">{unit}</span>
//                 </dt>
//                 <dd>
//                   <span className="block text-sm text-[#e9e2d3]">{title}</span>
//                   <span className="mt-0.5 block text-[13px] leading-snug text-[#968f83]">
//                     {text}
//                   </span>
//                 </dd>
//               </div>
//             </Reveal>
//           ))}
//         </dl>
//       </div>
//     </section>
//   );
// }
"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BarChart3,
  ExternalLink,
  Globe,
  MapPin,
  PieChart,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import Reveal from "./Reveal";

// Map box is 560 x 220, so the SVG viewBox is 100 x 39.3 (y = top% * 0.393)
const MAP_H = 39.3;

// TODO: address ar website tomar company er asol tottho diye replace koro
const pins = [
  {
    name: "New York",
    left: 17,
    top: 38,
    address: "350 Fifth Avenue, New York, NY 10118, USA",
    website: "https://www.example.com",
  },
  {
    name: "London",
    left: 46,
    top: 27,
    address: "20 Fenchurch Street, London EC3M 3BY, UK",
    website: "https://www.example.com",
  },
  {
    name: "Dubai",
    left: 60,
    top: 48,
    address: "Level 20, Emirates Towers, Sheikh Zayed Road, Dubai, UAE",
    website: "https://www.example.com",
  },
  {
    name: "Hong Kong",
    left: 78,
    top: 47,
    address: "88 Queensway, Admiralty, Hong Kong",
    website: "https://www.example.com",
  },
  {
    name: "Singapore",
    left: 74,
    top: 68,
    address: "1 Raffles Place, Singapore 048616",
    website: "https://www.example.com",
  },
];

type Pin = (typeof pins)[number];

const hostOf = (url: string) => {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
};

// Curved route between neighbouring hubs
const arcs = pins.slice(0, -1).map((a, i) => {
  const b = pins[i + 1];
  const x1 = a.left;
  const y1 = (a.top * MAP_H) / 100;
  const x2 = b.left;
  const y2 = (b.top * MAP_H) / 100;
  const cx = (x1 + x2) / 2;
  const cy = Math.min(y1, y2) - 7;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
});

const stats = [
  {
    icon: Globe,
    value: "5",
    unit: "Global hubs",
    title: "Global reach",
    text: "A truly international presence across continents.",
  },
  {
    icon: BarChart3,
    value: "30+",
    unit: "Markets",
    title: "Markets",
    text: "Strategic presence in key global markets.",
  },
  {
    icon: Users,
    value: "10k+",
    unit: "People",
    title: "Workforce",
    text: "A diverse and talented global team.",
  },
  {
    icon: PieChart,
    value: "$2B+",
    unit: "Revenue",
    title: "Revenue",
    text: "Sustainable growth across our portfolio.",
  },
];

/** Address + website content, shared by the map popover and the mobile card */
function LocationInfo({ pin, onClose }: { pin: Pin; onClose: () => void }) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-serif text-lg leading-tight text-white">
          {pin.name}
        </h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close location details"
          className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#968f83] transition-colors hover:bg-[#c8a15a] hover:text-[#0c0a08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0c28a]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <span className="my-3 block h-px w-8 bg-[#c8a15a]" />

      <p className="flex items-start gap-2 text-[13px] leading-relaxed text-[#d8d2c8]">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#c8a15a]" />
        <span>{pin.address}</span>
      </p>

      <a
        href={pin.website}
        target="_blank"
        rel="noopener noreferrer"
        className="group/link mt-3 inline-flex items-center gap-2 border-b border-[#c8a15a]/60 pb-0.5 text-[13px] text-[#e0c28a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e0c28a]"
      >
        <Globe className="h-4 w-4" />
        {hostOf(pin.website)}
        <ExternalLink className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
      </a>
    </>
  );
}

export default function GlobalPresenceSection() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Close on outside click / Escape
  useEffect(() => {
    if (active === null) return;
    const onDown = (e: PointerEvent) => {
      if (mapRef.current && !mapRef.current.contains(e.target as Node)) {
        setActive(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [active]);

  const toggle = (i: number) => setActive((cur) => (cur === i ? null : i));
  const close = () => setActive(null);
  const activePin = active !== null ? pins[active] : null;

  return (
    <section
      id="global"
      className="relative overflow-hidden border-t border-[#c8a15a]/25 bg-gradient-to-b from-[#12100c] to-[#0c0a08] py-16 text-[#d8d2c8] sm:py-20"
    >
      <div className="relative mx-auto max-w-[1180px] px-5 sm:px-7">
        {/* Header */}
        <div className="mb-10 grid items-end gap-5 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <Reveal>
            <h2 className="font-serif text-4xl font-medium leading-[1.1] text-white sm:text-5xl">
              A global presence.
              <br />
              <span className="text-[#c8a15a]">A lasting impact.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-[420px] border-l border-[#c8a15a]/40 pl-5 text-[15px] leading-[1.8] text-[#968f83]">
              From New York to Singapore, our hubs connect capital, people and
              markets across five financial centres.
            </p>
          </Reveal>
        </div>

        {/* Map: no background panel, up to 1400px wide */}
        <div className="relative left-1/2 w-[min(100vw,1400px)] -translate-x-1/2 px-5 sm:px-7">
          <motion.div
            ref={mapRef}
            className="relative"
            initial={{ opacity: 0, y: reduce ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative mx-auto aspect-[560/220] w-full max-w-[1400px]">
              <Image
                src="/images/world-map.png"
                alt="World map showing our offices"
                fill
                sizes="(min-width: 1400px) 1400px, 100vw"
                className="object-contain opacity-70"
              />

              {/* connecting arcs */}
              <svg
                aria-hidden
                viewBox={`0 0 100 ${MAP_H}`}
                className="pointer-events-none absolute inset-0 h-full w-full"
              >
                {arcs.map((d, i) => (
                  <motion.path
                    key={d}
                    d={d}
                    fill="none"
                    stroke="#c8a15a"
                    strokeWidth={1.2}
                    strokeDasharray="1.5 2"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    initial={{
                      pathLength: reduce ? 1 : 0,
                      opacity: reduce ? 0.6 : 0,
                    }}
                    whileInView={{ pathLength: 1, opacity: 0.6 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1,
                      delay: 0.9 + i * 0.35,
                      ease: "easeInOut",
                    }}
                  />
                ))}
                {/* glowing dot travelling from one city to the next, then looping */}
                {!reduce &&
                  arcs.map((d, i) => {
                    const n = arcs.length;
                    const a = i / n;
                    const b = (i + 1) / n;
                    const e = 0.001;
                    return (
                      <g key={`dot-${d}`} opacity="0">
                        <circle r="1.6" fill="#c8a15a" opacity="0.35" />
                        <circle r="0.7" fill="#f3dfae" />
                        <animateMotion
                          dur={`${n * 2.2}s`}
                          begin="3.5s"
                          repeatCount="indefinite"
                          path={d}
                          calcMode="linear"
                          keyPoints="0;0;1;1"
                          keyTimes={`0;${a};${b};1`}
                        />
                        <animate
                          attributeName="opacity"
                          dur={`${n * 2.2}s`}
                          begin="3.5s"
                          repeatCount="indefinite"
                          values="0;0;1;1;0;0"
                          keyTimes={`0;${a};${a + e};${b - e};${b};1`}
                        />
                      </g>
                    );
                  })}
              </svg>

              {/* pins */}
              {pins.map((p, i) => {
                const isActive = active === i;
                // Popover jeno map er baire kete na jay: right half e left dike khulbe
                const openLeft = p.left > 55;
                const openUp = p.top > 55;

                return (
                  <motion.div
                    key={p.name}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 ${
                      isActive ? "z-40" : "z-10"
                    }`}
                    style={{ left: `${p.left}%`, top: `${p.top}%` }}
                    initial={{ opacity: 0, scale: reduce ? 1 : 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: 0.5 + i * 0.25 }}
                  >
                    <button
                      type="button"
                      onClick={() => toggle(i)}
                      aria-expanded={isActive}
                      aria-label={`${p.name} office details`}
                      className="-m-2 block cursor-pointer rounded-full p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0c28a]"
                    >
                      <span className="relative flex h-3 w-3">
                        {!reduce && (
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e0c28a] opacity-60" />
                        )}
                        <span
                          className={`relative h-3 w-3 rounded-full border-2 border-[#0c0a08] bg-[#e0c28a] shadow-[0_0_14px_#c8a15a] transition-transform duration-300 ${
                            isActive ? "scale-150" : "hover:scale-125"
                          }`}
                        />
                      </span>
                    </button>

                    {/* city label (hidden while its card is open) */}
                    {!isActive && (
                      <span className="pointer-events-none absolute left-5 top-1/2 hidden -translate-y-1/2 whitespace-nowrap border border-[#c8a15a]/30 bg-[#0c0a08]/80 px-2 py-0.5 text-[11px] text-[#e9e2d3] backdrop-blur-sm sm:block lg:text-[13px]">
                        {p.name}
                      </span>
                    )}

                    {/* popover (tablet / desktop) */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          role="dialog"
                          aria-label={`${p.name} office`}
                          initial={{
                            opacity: 0,
                            y: reduce ? 0 : openUp ? 8 : -8,
                          }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className={`absolute hidden w-[270px] border border-[#c8a15a]/50 bg-[#0c0a08]/95 p-4 text-left shadow-[0_10px_40px_rgba(0,0,0,0.6)] backdrop-blur-md sm:block ${
                            openLeft ? "right-0" : "left-0"
                          } ${openUp ? "bottom-full mb-3" : "top-full mt-3"}`}
                        >
                          <LocationInfo pin={p} onClose={close} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* mobile legend (labels are hidden on small maps) */}
            <ul className="mt-4 flex flex-wrap justify-center gap-2 sm:hidden">
              {pins.map((p, i) => (
                <li key={p.name}>
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-pressed={active === i}
                    className={`flex items-center gap-1.5 border px-2.5 py-1 text-[11px] transition-colors ${
                      active === i
                        ? "border-[#c8a15a] bg-[#c8a15a]/15 text-white"
                        : "border-[#c8a15a]/30 text-[#e9e2d3]"
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#e0c28a]" />
                    {p.name}
                  </button>
                </li>
              ))}
            </ul>

            {/* mobile details card */}
            <AnimatePresence>
              {activePin && (
                <motion.div
                  key={activePin.name}
                  initial={{ opacity: 0, y: reduce ? 0 : 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-4 border border-[#c8a15a]/40 bg-[#0c0a08]/80 p-4 sm:hidden"
                >
                  <LocationInfo pin={activePin} onClose={close} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Stats */}
        <dl className="mt-10 grid grid-cols-2 gap-y-8 lg:grid-cols-4 lg:gap-y-0">
          {stats.map(({ icon: Icon, value, unit, title, text }, i) => (
            <Reveal key={title} delay={0.1 + i * 0.08} y={16}>
              <div
                className={`flex h-full flex-col gap-3 px-4 sm:px-6 ${
                  i > 0 ? "lg:border-l lg:border-[#c8a15a]/20" : "lg:pl-0"
                } ${i % 2 === 1 ? "border-l border-[#c8a15a]/20 lg:border-l" : ""}`}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c8a15a]/50 text-[#c8a15a]">
                  <Icon className="h-5 w-5 stroke-[1.4]" />
                </span>
                <dt className="flex items-baseline gap-2">
                  <span className="font-serif text-3xl text-white sm:text-4xl">
                    {value}
                  </span>
                  <span className="text-xs text-[#c8a15a]">{unit}</span>
                </dt>
                <dd>
                  <span className="block text-sm text-[#e9e2d3]">{title}</span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-[#968f83]">
                    {text}
                  </span>
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
