// "use client";

// import { motion } from "framer-motion";
// import { ArrowRight, ArrowUpRight } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";

// import Reveal from "./Reveal";

// const posts = [
//   {
//     title: "In Conversation: Building for Generations",
//     text: "A discussion on leadership, resilience and long-term value.",
//     image: "/images/media-1.jpg",
//     href: "/insights/building-for-generations",
//   },
//   {
//     title: "The Next Frontier in Sustainable Growth",
//     text: "Unlocking opportunities in a changing world.",
//     image: "/images/media-2.jpg",
//     href: "/insights/sustainable-growth",
//   },
//   {
//     title: "Leadership in a Changing World",
//     text: "Keynote remarks on innovation, people and purpose.",
//     image: "/images/media-3.jpg",
//     href: "/insights/leadership-changing-world",
//   },
// ];

// const [featured, ...others] = posts;

// const ease = [0.22, 1, 0.36, 1] as const;

// export default function MediaInsightsSection() {
//   return (
//     <section
//       id="insights"
//       className="relative overflow-hidden border-t border-[#c8a15a]/25 bg-gradient-to-b from-[#0c0a08] to-[#12100c] py-16 text-[#d8d2c8] sm:py-20"
//     >
//       <div
//         aria-hidden
//         className="pointer-events-none absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-[#c8a15a]/10 blur-[130px]"
//       />

//       <div className="relative mx-auto max-w-[1180px] px-5 sm:px-7">
//         {/* Header */}
//         <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
//           <Reveal>
//             <h2 className="font-serif text-4xl font-medium leading-[1.1] text-white sm:text-5xl">
//               Ideas for a
//               <br />
//               <span className="text-[#c8a15a]">brighter tomorrow.</span>
//             </h2>
//           </Reveal>

//           <Reveal delay={0.1}>
//             <Link
//               href="/insights"
//               className="group inline-flex items-center gap-2 border-b border-[#c8a15a]/60 pb-1 text-sm text-[#e0c28a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e0c28a]"
//             >
//               View all insights
//               <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
//             </Link>
//           </Reveal>
//         </div>

//         <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
//           {/* Featured post */}
//           <motion.div
//             initial={{ opacity: 0, y: 28 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true, margin: "-40px" }}
//             transition={{ duration: 0.7, ease }}
//           >
//             <Link
//               href={featured.href}
//               className="group relative block h-[380px] overflow-hidden border border-[#c8a15a]/25 transition-colors duration-300 hover:border-[#c8a15a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0c28a] sm:h-[440px] lg:h-full lg:min-h-[460px]"
//             >
//               <Image
//                 src={featured.image}
//                 alt=""
//                 fill
//                 sizes="(min-width: 1024px) 680px, 100vw"
//                 className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a08] via-[#0c0a08]/50 to-transparent" />

//               <span className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-[#c8a15a]/60 bg-[#0c0a08]/50 text-[#e0c28a] backdrop-blur-sm transition-colors duration-300 group-hover:bg-[#c8a15a] group-hover:text-[#0c0a08]">
//                 <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
//               </span>

//               <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
//                 <h3 className="max-w-[460px] font-serif text-3xl leading-tight text-white sm:text-4xl">
//                   {featured.title}
//                 </h3>
//                 <p className="mt-3 max-w-[420px] text-[15px] leading-relaxed text-[#d8d2c8]/80">
//                   {featured.text}
//                 </p>
//                 <span className="mt-5 inline-flex items-center gap-2 border-b border-[#c8a15a]/60 pb-1 text-sm text-[#e0c28a]">
//                   Read more
//                   <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
//                 </span>
//               </div>
//             </Link>
//           </motion.div>

//           {/* Side posts */}
//           <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-2">
//             {others.map((post, i) => (
//               <motion.div
//                 key={post.title}
//                 initial={{ opacity: 0, y: 28 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true, margin: "-40px" }}
//                 transition={{ duration: 0.6, delay: 0.15 + i * 0.12, ease }}
//               >
//                 <Link
//                   href={post.href}
//                   className="group flex h-full flex-col overflow-hidden border border-[#c8a15a]/25 bg-[#110e0b] transition-colors duration-300 hover:border-[#c8a15a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0c28a] lg:flex-row"
//                 >
//                   <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:w-[42%] lg:shrink-0">
//                     <Image
//                       src={post.image}
//                       alt=""
//                       fill
//                       sizes="(min-width: 1024px) 220px, (min-width: 640px) 50vw, 100vw"
//                       className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
//                     />
//                   </div>
//                   <div className="flex flex-1 flex-col p-5">
//                     <h3 className="font-serif text-xl leading-snug text-white">
//                       {post.title}
//                     </h3>
//                     <p className="mt-2 text-[13px] leading-relaxed text-[#968f83]">
//                       {post.text}
//                     </p>
//                     <span className="mt-auto inline-flex items-center gap-2 pt-4 text-[13px] text-[#e0c28a]">
//                       Read more
//                       <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
//                     </span>
//                   </div>
//                 </Link>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import Reveal from "./Reveal";

export interface InsightPost {
  title: string;
  text: string;
  image: string;
  href: string;
}

const DEFAULT_IMAGE = "/images/media-1.jpg";

const DEFAULT_POSTS: InsightPost[] = [
  {
    title: "In Conversation: Building for Generations",
    text: "A discussion on leadership, resilience and long-term value.",
    image: "/images/media-1.jpg",
    href: "/insights/building-for-generations",
  },
  {
    title: "The Next Frontier in Sustainable Growth",
    text: "Unlocking opportunities in a changing world.",
    image: "/images/media-2.jpg",
    href: "/insights/sustainable-growth",
  },
  {
    title: "Leadership in a Changing World",
    text: "Keynote remarks on innovation, people and purpose.",
    image: "/images/media-3.jpg",
    href: "/insights/leadership-changing-world",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

interface MediaInsightsSectionProps {
  posts?: InsightPost[] | null;
}

export default function MediaInsightsSection({
  posts,
}: MediaInsightsSectionProps) {
  const reduce = useReducedMotion();

  const list = posts?.length ? posts : DEFAULT_POSTS;
  const [featured, ...others] = list;

  const initial = reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 };

  return (
    <section
      id="insights"
      className="relative overflow-hidden border-t border-[#c8a15a]/25 bg-gradient-to-b from-[#0c0a08] to-[#12100c] py-16 text-[#d8d2c8] sm:py-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-[#c8a15a]/10 blur-[130px]"
      />

      <div className="relative mx-auto max-w-[1180px] px-5 sm:px-7">
        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <Reveal>
            <h2 className="font-serif text-4xl font-medium leading-[1.1] text-white sm:text-5xl">
              Ideas for a
              <br />
              <span className="text-[#c8a15a]">brighter tomorrow.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <Link
              href="/insights"
              className="group inline-flex items-center gap-2 border-b border-[#c8a15a]/60 pb-1 text-sm text-[#e0c28a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e0c28a]"
            >
              View all insights
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div
          className={`grid gap-5 ${others.length ? "lg:grid-cols-[1.35fr_1fr]" : ""}`}
        >
          {/* Featured post */}
          <motion.div
            initial={initial}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease }}
          >
            <Link
              href={featured.href}
              className="group relative block h-[380px] overflow-hidden border border-[#c8a15a]/25 bg-[#1a160f] transition-colors duration-300 hover:border-[#c8a15a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0c28a] sm:h-[440px] lg:h-full lg:min-h-[460px]"
            >
              <Image
                src={featured.image?.trim() || DEFAULT_IMAGE}
                alt=""
                fill
                sizes="(min-width: 1024px) 680px, 100vw"
                className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a08] via-[#0c0a08]/50 to-transparent" />

              <span className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-[#c8a15a]/60 bg-[#0c0a08]/50 text-[#e0c28a] backdrop-blur-sm transition-colors duration-300 group-hover:bg-[#c8a15a] group-hover:text-[#0c0a08]">
                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>

              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
                <h3 className="max-w-[460px] font-serif text-3xl leading-tight text-white sm:text-4xl">
                  {featured.title}
                </h3>
                {featured.text && (
                  <p className="mt-3 line-clamp-3 max-w-[420px] text-[15px] leading-relaxed text-[#d8d2c8]/80">
                    {featured.text}
                  </p>
                )}
                <span className="mt-5 inline-flex items-center gap-2 border-b border-[#c8a15a]/60 pb-1 text-sm text-[#e0c28a]">
                  Read more
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Side posts */}
          {others.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-2">
              {others.map((post, i) => (
                <motion.div
                  key={post.href}
                  initial={initial}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.6,
                    delay: 0.15 + i * 0.12,
                    ease,
                  }}
                >
                  <Link
                    href={post.href}
                    className="group flex h-full flex-col overflow-hidden border border-[#c8a15a]/25 bg-[#110e0b] transition-colors duration-300 hover:border-[#c8a15a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0c28a] lg:flex-row"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#1a160f] lg:aspect-auto lg:w-[42%] lg:shrink-0">
                      <Image
                        src={post.image?.trim() || DEFAULT_IMAGE}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 220px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="line-clamp-2 font-serif text-xl leading-snug text-white">
                        {post.title}
                      </h3>
                      {post.text && (
                        <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-[#968f83]">
                          {post.text}
                        </p>
                      )}
                      <span className="mt-auto inline-flex items-center gap-2 pt-4 text-[13px] text-[#e0c28a]">
                        Read more
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
