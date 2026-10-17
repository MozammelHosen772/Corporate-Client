// "use client";

// import { motion, useReducedMotion } from "framer-motion";
// import Image from "next/image";

// import Reveal from "./Reveal";

// const stats = [
//   { value: "25+", label: "Years of Legacy" },
//   { value: "12", label: "Business Sectors" },
//   { value: "10k+", label: "Lives Impacted" },
// ];

// export default function AboutSection() {
//   const reduce = useReducedMotion();

//   return (
//     <section
//       id="about"
//       className="relative overflow-hidden border-t border-[#c8a15a]/25 bg-gradient-to-b from-[#0c0a08] to-[#12100c] py-16 text-[#d8d2c8] sm:py-20"
//     >
//       {/* soft gold glow */}
//       <div
//         aria-hidden
//         className="pointer-events-none absolute -left-32 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[#c8a15a]/10 blur-[120px]"
//       />

//       <div className="relative mx-auto grid max-w-[1400px] items-center gap-10 px-5 sm:px-7 lg:grid-cols-[380px_1fr] lg:gap-16">
//         {/* Photo with frame + curtain reveal */}
//         <div className="relative mx-auto w-full max-w-[380px] lg:mx-0">
//           <div
//             aria-hidden
//             className="absolute -bottom-3 -right-3 h-full w-full border border-[#c8a15a]/50"
//           />
//           <motion.div
//             className="group relative aspect-[4/5] overflow-hidden bg-[#1a160f]"
//             initial={{ clipPath: reduce ? "inset(0)" : "inset(0 100% 0 0)" }}
//             whileInView={{ clipPath: "inset(0 0% 0 0)" }}
//             viewport={{ once: true, margin: "-60px" }}
//             transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
//           >
//             <Image
//               src="/images/about-leader.jpg"
//               alt="Group chairman"
//               fill
//               sizes="(min-width: 1024px) 380px, 90vw"
//               className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a08]/90 via-transparent to-transparent" />
//             <div className="absolute bottom-0 left-0 p-5">
//               <p className="text-base font-medium text-white">Chairman</p>
//               <p className="text-[10px] uppercase tracking-[0.22em] text-[#c8a15a]">
//                 G Group
//               </p>
//             </div>
//           </motion.div>
//         </div>

//         {/* Content */}
//         <div>
//           <Reveal>
//             <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-[#c8a15a]">
//               <span className="h-px w-8 bg-[#c8a15a]" />
//               About
//             </span>
//           </Reveal>

//           <Reveal delay={0.08}>
//             <h2 className="mb-5 mt-3 flex items-center gap-4 text-4xl font-medium leading-tight text-white sm:text-5xl">
//               A Visionary Leader
//               <motion.span
//                 className="hidden h-px w-16 origin-left bg-[#c8a15a] sm:block"
//                 initial={{ scaleX: 0 }}
//                 whileInView={{ scaleX: 1 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.7, delay: 0.5 }}
//               />
//             </h2>
//           </Reveal>

//           <Reveal delay={0.16}>
//             <p className="max-w-[560px] text-[15px] leading-[1.8] text-[#d8d2c8]/90">
//               I am a firm believer that capital, when guided by purpose, can
//               transform industries and improve lives. Through G Group, we build
//               enduring businesses across essential sectors, create opportunities
//               for people, and contribute to a more prosperous, sustainable
//               tomorrow.
//             </p>
//           </Reveal>

//           {/* Quote card */}
//           <Reveal delay={0.24} y={16}>
//             <div className="relative mt-7 max-w-[560px] border-l-2 border-[#c8a15a] bg-[#c8a15a]/[0.06] py-4 pl-6 pr-5">
//               <span
//                 aria-hidden
//                 className="absolute -top-2 left-4 font-serif text-5xl leading-none text-[#c8a15a]/40"
//               >
//                 “
//               </span>
//               <p className="text-sm italic leading-relaxed text-[#e9e2d3]">
//                 Long-term thinking for a brighter tomorrow.
//               </p>
//             </div>
//           </Reveal>

//           {/* Stats */}
//           <Reveal delay={0.32} y={16}>
//             <dl className="mt-8 grid max-w-[560px] grid-cols-3 gap-4 border-t border-[#c8a15a]/20 pt-6">
//               {stats.map((s) => (
//                 <div key={s.label}>
//                   <dt className="text-2xl font-medium text-[#c8a15a] sm:text-3xl">
//                     {s.value}
//                   </dt>
//                   <dd className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#968f83]">
//                     {s.label}
//                   </dd>
//                 </div>
//               ))}
//             </dl>
//           </Reveal>
//         </div>
//       </div>
//     </section>
//   );
// }
"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

import TiptapRenderer from "@/shared/tiptapEditor/TiptapRenderer";

import Reveal from "./Reveal";

const stats = [
  { value: "25+", label: "Years of Legacy" },
  { value: "12", label: "Business Sectors" },
  { value: "10k+", label: "Lives Impacted" },
];

const DEFAULT_TITLE = "A Visionary Leader";
const DEFAULT_DESCRIPTION =
  "<p>I am a firm believer that capital, when guided by purpose, can transform industries and improve lives. Through G Group, we build enduring businesses across essential sectors, create opportunities for people, and contribute to a more prosperous, sustainable tomorrow.</p>";
const DEFAULT_IMAGE = "/images/about-leader.jpg";

interface AboutSectionProps {
  title?: string | null;
  description?: string | null;
  imageUrl?: string | null;
}

export default function AboutSection({
  title,
  description,
  imageUrl,
}: AboutSectionProps) {
  const reduce = useReducedMotion();

  const aboutTitle = title?.trim() ? title : DEFAULT_TITLE;
  const aboutDescription = description?.trim()
    ? description
    : DEFAULT_DESCRIPTION;
  const aboutImage = imageUrl?.trim() ? imageUrl : DEFAULT_IMAGE;

  return (
    <section
      id="about"
      className="relative overflow-hidden border-t border-[#c8a15a]/25 bg-gradient-to-b from-[#0c0a08] to-[#12100c] py-16 text-[#d8d2c8] sm:py-20"
    >
      {/* soft gold glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[#c8a15a]/10 blur-[120px]"
      />

      <div className="relative mx-auto grid max-w-[1400px] items-center gap-10 px-5 sm:px-7 lg:grid-cols-[380px_1fr] lg:gap-16">
        {/* Photo with frame + curtain reveal */}
        <div className="relative mx-auto w-full max-w-[380px] lg:mx-0">
          <div
            aria-hidden
            className="absolute -bottom-3 -right-3 h-full w-full border border-[#c8a15a]/50"
          />
          <motion.div
            className="group relative aspect-[4/5] overflow-hidden bg-[#1a160f]"
            initial={{ clipPath: reduce ? "inset(0)" : "inset(0 100% 0 0)" }}
            whileInView={{ clipPath: "inset(0 0% 0 0)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={aboutImage}
              alt={title?.trim() || "Group chairman"}
              fill
              sizes="(min-width: 1024px) 380px, 90vw"
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a08]/90 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-5">
              <p className="text-base font-medium text-white">Chairman</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#c8a15a]">
                G Group
              </p>
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-[#c8a15a]">
              <span className="h-px w-8 bg-[#c8a15a]" />
              About
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="mb-5 mt-3 flex items-center gap-4 text-4xl font-medium leading-tight text-white sm:text-5xl">
              {aboutTitle}
              <motion.span
                className="hidden h-px w-16 origin-left bg-[#c8a15a] sm:block"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.5 }}
              />
            </h2>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="max-w-[560px] text-[15px] leading-[1.8] text-[#d8d2c8]/90 [&_p]:m-0 [&_p+p]:mt-3">
              <TiptapRenderer html={aboutDescription} />
            </div>
          </Reveal>

          {/* Quote card */}
          <Reveal delay={0.24} y={16}>
            <div className="relative mt-7 max-w-[560px] border-l-2 border-[#c8a15a] bg-[#c8a15a]/[0.06] py-4 pl-6 pr-5">
              <span
                aria-hidden
                className="absolute -top-2 left-4 font-serif text-5xl leading-none text-[#c8a15a]/40"
              >
                “
              </span>
              <p className="text-sm italic leading-relaxed text-[#e9e2d3]">
                Long-term thinking for a brighter tomorrow.
              </p>
            </div>
          </Reveal>

          {/* Stats */}
          <Reveal delay={0.32} y={16}>
            <dl className="mt-8 grid max-w-[560px] grid-cols-3 gap-4 border-t border-[#c8a15a]/20 pt-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="text-2xl font-medium text-[#c8a15a] sm:text-3xl">
                    {s.value}
                  </dt>
                  <dd className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#968f83]">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
