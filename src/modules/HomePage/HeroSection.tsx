// "use client";

// import {
//   motion,
//   useReducedMotion,
//   useScroll,
//   useTransform,
//   type Variants,
// } from "framer-motion";
// import { ArrowRight } from "lucide-react";
// import { Cormorant_Garamond } from "next/font/google";
// import Image from "next/image";
// import Link from "next/link";
// import { useRef } from "react";

// import { Button } from "@/components/ui/button";

// const serif = Cormorant_Garamond({
//   subsets: ["latin"],
//   weight: ["400", "500", "600"],
// });

// const EASE = [0.22, 1, 0.36, 1] as const;

// const stats = [
//   { value: "25+", label: "Years of legacy" },
//   { value: "7", label: "Business pillars" },
//   { value: "5", label: "Global hubs" },
// ];

// export default function HeroSection() {
//   const reduce = useReducedMotion();
//   const ref = useRef<HTMLElement>(null);

//   // Gentle parallax while scrolling past the hero
//   const { scrollYProgress } = useScroll({
//     target: ref,
//     offset: ["start start", "end start"],
//   });
//   const skylineY = useTransform(
//     scrollYProgress,
//     [0, 1],
//     reduce ? ["0%", "0%"] : ["0%", "14%"],
//   );
//   const leaderY = useTransform(
//     scrollYProgress,
//     [0, 1],
//     reduce ? ["0%", "0%"] : ["0%", "8%"],
//   );

//   // Heading line reveal (masked slide-up)
//   const line: Variants = {
//     hidden: { y: reduce ? 0 : "110%", opacity: reduce ? 1 : 0 },
//     show: (i: number) => ({
//       y: 0,
//       opacity: 1,
//       transition: { duration: 0.7, ease: EASE, delay: 0.15 + i * 0.12 },
//     }),
//   };

//   const fadeUp: Variants = {
//     hidden: { y: reduce ? 0 : 20, opacity: reduce ? 1 : 0 },
//     show: (delay: number) => ({
//       y: 0,
//       opacity: 1,
//       transition: { duration: 0.6, ease: EASE, delay },
//     }),
//   };

//   return (
//     <section ref={ref} className="bg-[#0c0a08] text-white">
//       <div className="relative mx-auto min-h-[620px] max-w-[1400px] overflow-hidden lg:min-h-[760px]">
//         {/* Soft edges so the 1400px box blends into the page on wide screens */}
//         <div
//           aria-hidden
//           className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#0c0a08] to-transparent"
//         />
//         <div
//           aria-hidden
//           className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#0c0a08] to-transparent"
//         />
//         {/* Background glow + skyline */}
//         <div className="pointer-events-none absolute inset-0">
//           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_60%,#2a2118_0%,transparent_55%),radial-gradient(ellipse_at_85%_40%,#3a2d1b_0%,transparent_45%),linear-gradient(100deg,#15110d,#0c0a08_60%,#17120b)]" />

//           <motion.div className="absolute inset-0" style={{ y: skylineY }}>
//             <motion.div
//               className="absolute inset-0"
//               initial={{ opacity: 0, scale: reduce ? 1 : 1.08 }}
//               animate={{ opacity: 0.6, scale: 1 }}
//               transition={{ duration: 1.4, ease: EASE }}
//             >
//               <Image
//                 src="/images/hero-skyline.jpg"
//                 alt=""
//                 fill
//                 priority
//                 sizes="100vw"
//                 className="object-cover object-right [mask-image:linear-gradient(90deg,transparent_30%,#000_75%)]"
//               />
//             </motion.div>
//           </motion.div>

//           {/* Soft gold light that slowly breathes */}
//           {!reduce && (
//             <motion.div
//               className="absolute right-[8%] top-[10%] h-80 w-80 rounded-full bg-[#c8a15a]/10 blur-3xl"
//               animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.15, 1] }}
//               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
//             />
//           )}

//           <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0c0a08] to-transparent" />
//         </div>

//         {/* Leader photo with gold halo */}
//         <motion.div
//           className="pointer-events-none absolute bottom-0 left-0 h-[78%] w-[300px] opacity-40 sm:w-[360px] sm:opacity-60 lg:left-[5%] lg:h-[92%] lg:w-[480px] lg:opacity-100"
//           style={{ y: leaderY }}
//         >
//           <motion.div
//             className="relative h-full w-full"
//             initial={{ x: reduce ? 0 : -40, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ duration: 0.9, ease: EASE, delay: 0.05 }}
//           >
//             {/* halo behind the portrait */}
//             <div
//               aria-hidden
//               className="absolute bottom-[8%] left-1/2 h-[75%] w-[90%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(200,161,90,0.32)_0%,transparent_65%)]"
//             />
//             <div
//               aria-hidden
//               className="absolute bottom-[14%] left-1/2 hidden aspect-square w-[78%] -translate-x-1/2 rounded-full border border-[#c8a15a]/25 lg:block"
//             />

//             <motion.div
//               className="relative h-full w-full"
//               animate={reduce ? undefined : { y: [0, -6, 0] }}
//               transition={{
//                 duration: 6,
//                 repeat: Infinity,
//                 ease: "easeInOut",
//                 delay: 1,
//               }}
//             >
//               <Image
//                 src="/images/hero-leader.png"
//                 alt="Group chairman"
//                 fill
//                 priority
//                 sizes="(min-width: 1024px) 480px, 360px"
//                 className="object-contain object-bottom"
//               />
//             </motion.div>
//           </motion.div>
//         </motion.div>

//         {/* Vertical tagline: line draws down, then text fades in */}
//         <div className="absolute left-8 top-36 hidden h-36 xl:block">
//           <motion.span
//             className="absolute left-0 top-0 block w-px origin-top bg-[#c8a15a]/40"
//             style={{ height: "100%" }}
//             initial={{ scaleY: 0 }}
//             animate={{ scaleY: 1 }}
//             transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
//           />
//           <motion.div
//             className="pl-3.5 text-xs leading-[1.9] tracking-[0.08em] text-[#968f83]"
//             variants={fadeUp}
//             initial="hidden"
//             animate="show"
//             custom={0.6}
//           >
//             People
//             <br />
//             Capital
//             <br />
//             Ideas
//           </motion.div>
//         </div>

//         {/* Content */}
//         <div className="relative mx-auto flex min-h-[620px] max-w-[1400px] items-center px-4 pb-40 pt-24 sm:px-6 lg:min-h-[760px] lg:px-8">
//           <div className="ml-auto w-full max-w-[600px] lg:mr-8">
//             <h1
//               className={`${serif.className} text-5xl font-medium leading-[1.04] sm:text-6xl lg:text-[76px]`}
//             >
//               <span className="block overflow-hidden pb-1">
//                 <motion.span
//                   className="block text-[#f3ecdc]"
//                   variants={line}
//                   initial="hidden"
//                   animate="show"
//                   custom={0}
//                 >
//                   Pioneering Growth,
//                 </motion.span>
//               </span>
//               <span className="block overflow-hidden pb-2">
//                 <motion.span
//                   className="relative block text-[#e0c28a]"
//                   variants={line}
//                   initial="hidden"
//                   animate="show"
//                   custom={1}
//                 >
//                   Empowering Legacies.
//                   {/* One-time light sweep over the heading */}
//                   {!reduce && (
//                     <motion.span
//                       aria-hidden
//                       className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent mix-blend-overlay"
//                       initial={{ x: "-120%" }}
//                       animate={{ x: "420%" }}
//                       transition={{ duration: 1, ease: "easeInOut", delay: 1 }}
//                     />
//                   )}
//                 </motion.span>
//               </span>
//             </h1>

//             <motion.p
//               className="mt-6 max-w-[460px] border-l border-[#c8a15a]/40 pl-5 text-base leading-[1.8] text-[#d8d2c8]/80"
//               variants={fadeUp}
//               initial="hidden"
//               animate="show"
//               custom={0.55}
//             >
//               A diversified group building enduring businesses across seven
//               essential sectors, for people, partners and generations to come.
//             </motion.p>

//             <motion.div
//               className="mt-9 flex flex-col gap-3 sm:flex-row"
//               variants={fadeUp}
//               initial="hidden"
//               animate="show"
//               custom={0.7}
//             >
//               <Button
//                 asChild
//                 className="group h-12 rounded-none border border-[#c8a15a] bg-[#c8a15a] px-7 text-sm font-medium text-[#120e09] transition-all duration-300 hover:bg-[#e0c28a] hover:shadow-[0_0_28px_rgba(200,161,90,0.4)]"
//               >
//                 <Link href="/#ecosystem">
//                   Explore ecosystem
//                   <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
//                 </Link>
//               </Button>

//               <Button
//                 asChild
//                 variant="outline"
//                 className="group h-12 rounded-none border-[#c8a15a]/70 bg-transparent px-7 text-sm font-normal text-[#e0c28a] transition-all duration-300 hover:border-[#c8a15a] hover:bg-[#c8a15a]/10 hover:text-[#e0c28a]"
//               >
//                 <Link href="/contact">
//                   Connect with us
//                   <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
//                 </Link>
//               </Button>
//             </motion.div>
//           </div>
//         </div>

//         {/* Stats strip */}
//         <motion.div
//           className="absolute inset-x-0 bottom-0 border-t border-[#c8a15a]/25 bg-[#0c0a08]/60 backdrop-blur-md"
//           variants={fadeUp}
//           initial="hidden"
//           animate="show"
//           custom={0.9}
//         >
//           <dl className="mx-auto grid max-w-[1180px] grid-cols-3 px-4 sm:px-7">
//             {stats.map((s, i) => (
//               <div
//                 key={s.label}
//                 className={`flex flex-col gap-0.5 py-4 sm:flex-row sm:items-baseline sm:gap-3 sm:py-5 ${
//                   i > 0 ? "border-l border-[#c8a15a]/20 pl-4 sm:pl-8" : ""
//                 }`}
//               >
//                 <dt
//                   className={`${serif.className} text-3xl font-medium text-[#e0c28a] sm:text-4xl`}
//                 >
//                   {s.value}
//                 </dt>
//                 <dd className="text-xs text-[#968f83] sm:text-sm">{s.label}</dd>
//               </div>
//             ))}
//           </dl>
//         </motion.div>
//       </div>
//     </section>
//   );
// }

"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Cormorant_Garamond } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import TiptapRenderer from "@/shared/tiptapEditor/TiptapRenderer";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const EASE = [0.22, 1, 0.36, 1] as const;

const stats = [
  { value: "25+", label: "Years of legacy" },
  { value: "7", label: "Business pillars" },
  { value: "5", label: "Global hubs" },
];

const DEFAULT_TITLE = "Pioneering Growth, Empowering Legacies.";
const DEFAULT_DESCRIPTION =
  "<p>A diversified group building enduring businesses across seven essential sectors, for people, partners and generations to come.</p>";
const DEFAULT_IMAGE = "/images/hero-leader.png";

interface HeroSectionProps {
  title?: string | null;
  description?: string | null;
  imageUrl?: string | null;
}

/**
 * Splits the title into two lines so the existing design
 * (line 1 white, line 2 gold) stays exactly the same.
 * - splits after the first comma or newline if present
 * - otherwise splits roughly in the middle by words
 */
const splitTitle = (title: string): [string, string] => {
  const clean = title.trim();

  const newlineIdx = clean.indexOf("\n");
  if (newlineIdx > -1) {
    return [
      clean.slice(0, newlineIdx).trim(),
      clean.slice(newlineIdx + 1).trim(),
    ];
  }

  const commaIdx = clean.indexOf(",");
  if (commaIdx > -1 && commaIdx < clean.length - 1) {
    return [
      clean.slice(0, commaIdx + 1).trim(),
      clean.slice(commaIdx + 1).trim(),
    ];
  }

  const words = clean.split(/\s+/);
  if (words.length < 2) return [clean, ""];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
};

export default function HeroSection({
  title,
  description,
  imageUrl,
}: HeroSectionProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const [line1, line2] = splitTitle(title?.trim() ? title : DEFAULT_TITLE);
  const heroDescription = description?.trim()
    ? description
    : DEFAULT_DESCRIPTION;
  const heroImage = imageUrl?.trim() ? imageUrl : DEFAULT_IMAGE;

  // Gentle parallax while scrolling past the hero
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const skylineY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : ["0%", "14%"],
  );
  const leaderY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : ["0%", "8%"],
  );

  // Heading line reveal (masked slide-up)
  const line: Variants = {
    hidden: { y: reduce ? 0 : "110%", opacity: reduce ? 1 : 0 },
    show: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: EASE, delay: 0.15 + i * 0.12 },
    }),
  };

  const fadeUp: Variants = {
    hidden: { y: reduce ? 0 : 20, opacity: reduce ? 1 : 0 },
    show: (delay: number) => ({
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: EASE, delay },
    }),
  };

  return (
    <section ref={ref} className="bg-[#0c0a08] text-white">
      <div className="relative mx-auto max-w-[1400px] overflow-hidden lg:min-h-[760px]">
        {/* Soft edges so the 1400px box blends into the page on wide screens */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#0c0a08] to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#0c0a08] to-transparent"
        />

        {/* Background glow + skyline */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_60%,#2a2118_0%,transparent_55%),radial-gradient(ellipse_at_85%_40%,#3a2d1b_0%,transparent_45%),linear-gradient(100deg,#15110d,#0c0a08_60%,#17120b)]" />

          <motion.div className="absolute inset-0" style={{ y: skylineY }}>
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0, scale: reduce ? 1 : 1.08 }}
              animate={{ opacity: 0.6, scale: 1 }}
              transition={{ duration: 1.4, ease: EASE }}
            >
              <Image
                src="/images/hero-skyline.jpg"
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover object-right [mask-image:linear-gradient(90deg,transparent_30%,#000_75%)]"
              />
            </motion.div>
          </motion.div>

          {/* Soft gold light that slowly breathes */}
          {!reduce && (
            <motion.div
              className="absolute right-[8%] top-[10%] h-80 w-80 rounded-full bg-[#c8a15a]/10 blur-3xl"
              animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.15, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          )}

          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0c0a08] to-transparent" />
        </div>

        {/* Vertical tagline: line draws down, then text fades in */}
        <div className="absolute left-8 top-36 z-[2] hidden h-36 xl:block">
          <motion.span
            className="absolute left-0 top-0 block w-px origin-top bg-[#c8a15a]/40"
            style={{ height: "100%" }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
          />
          <motion.div
            className="pl-3.5 text-xs leading-[1.9] tracking-[0.08em] text-[#968f83]"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.6}
          >
            People
            <br />
            Capital
            <br />
            Ideas
          </motion.div>
        </div>

        {/* Content: mobile = image on top (centered), then text.
            Desktop = image centered in the left half, text on the right. */}
        <div className="relative z-[1] mx-auto flex min-h-[620px] max-w-[1400px] flex-col px-4 pb-32 pt-24 sm:px-6 lg:grid lg:min-h-[760px] lg:grid-cols-2 lg:items-center lg:gap-8 lg:px-8 lg:pb-40">
          {/* Leader photo with gold halo */}
          <motion.div
            className="pointer-events-none relative mx-auto h-[340px] w-[280px] shrink-0 sm:h-[420px] sm:w-[340px] lg:absolute lg:bottom-0 lg:left-0 lg:h-[92%] lg:w-1/2"
            style={{ y: leaderY }}
          >
            <motion.div
              className="relative mx-auto h-full w-full lg:max-w-[480px]"
              initial={{ x: reduce ? 0 : -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.05 }}
            >
              {/* halo behind the portrait */}
              <div
                aria-hidden
                className="absolute bottom-[8%] left-1/2 h-[75%] w-[100%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(200,161,90,0.32)_0%,transparent_65%)]"
              />
              <div
                aria-hidden
                className="absolute bottom-[14%] left-1/2 hidden aspect-square w-[78%] -translate-x-1/2 rounded-full border border-[#c8a15a]/25 lg:block"
              />

              <motion.div
                className="relative h-full w-full"
                animate={reduce ? undefined : { y: [0, -6, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                <Image
                  src={heroImage}
                  alt={title?.trim() || "Group chairman"}
                  fill
                  priority
                  sizes="(min-width: 1024px) 480px, 340px"
                  className="object-contain object-bottom"
                />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Text */}
          <div className="mt-8 w-full max-w-[600px] lg:col-start-2 lg:ml-auto lg:mr-8 lg:mt-0">
            <h1
              className={`${serif.className} text-5xl font-medium leading-[1.04] sm:text-6xl lg:text-[76px]`}
            >
              <span className="block overflow-hidden pb-1">
                <motion.span
                  className="block text-[#f3ecdc]"
                  variants={line}
                  initial="hidden"
                  animate="show"
                  custom={0}
                >
                  {line1}
                </motion.span>
              </span>
              {line2 && (
                <span className="block overflow-hidden pb-2">
                  <motion.span
                    className="relative block text-[#e0c28a]"
                    variants={line}
                    initial="hidden"
                    animate="show"
                    custom={1}
                  >
                    {line2}
                    {/* One-time light sweep over the heading */}
                    {!reduce && (
                      <motion.span
                        aria-hidden
                        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent mix-blend-overlay"
                        initial={{ x: "-120%" }}
                        animate={{ x: "420%" }}
                        transition={{
                          duration: 1,
                          ease: "easeInOut",
                          delay: 1,
                        }}
                      />
                    )}
                  </motion.span>
                </span>
              )}
            </h1>

            <motion.div
              className="mt-6 max-w-[460px] border-l border-[#c8a15a]/40 pl-5 text-base leading-[1.8] text-[#d8d2c8]/80 [&_p]:m-0 [&_p+p]:mt-3"
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.55}
            >
              <TiptapRenderer html={heroDescription} />
            </motion.div>

            <motion.div
              className="mt-9 flex flex-col gap-3 sm:flex-row"
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.7}
            >
              <Button
                asChild
                className="group h-12 rounded-none border border-[#c8a15a] bg-[#c8a15a] px-7 text-sm font-medium text-[#120e09] transition-all duration-300 hover:bg-[#e0c28a] hover:shadow-[0_0_28px_rgba(200,161,90,0.4)]"
              >
                <Link href="/#ecosystem">
                  Explore ecosystem
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="group h-12 rounded-none border-[#c8a15a]/70 bg-transparent px-7 text-sm font-normal text-[#e0c28a] transition-all duration-300 hover:border-[#c8a15a] hover:bg-[#c8a15a]/10 hover:text-[#e0c28a]"
              >
                <Link href="/contact">
                  Connect with us
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Stats strip */}
        <motion.div
          className="absolute inset-x-0 bottom-0 z-[2] border-t border-[#c8a15a]/25 bg-[#0c0a08]/60 backdrop-blur-md"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.9}
        >
          <dl className="mx-auto grid max-w-[1180px] grid-cols-3 px-4 sm:px-7">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col gap-0.5 py-4 sm:flex-row sm:items-baseline sm:gap-3 sm:py-5 ${
                  i > 0 ? "border-l border-[#c8a15a]/20 pl-4 sm:pl-8" : ""
                }`}
              >
                <dt
                  className={`${serif.className} text-3xl font-medium text-[#e0c28a] sm:text-4xl`}
                >
                  {s.value}
                </dt>
                <dd className="text-xs text-[#968f83] sm:text-sm">{s.label}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
