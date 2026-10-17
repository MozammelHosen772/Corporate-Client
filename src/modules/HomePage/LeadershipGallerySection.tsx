// "use client";

// import { AnimatePresence, motion } from "framer-motion";
// import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
// import Image from "next/image";
// import { useCallback, useEffect, useRef, useState } from "react";

// import Reveal from "./Reveal";

// const photos = [
//   {
//     src: "/images/gallery-1.jpg",
//     alt: "Leadership meeting",
//     className: "col-span-2 row-span-2 sm:col-span-3",
//   },
//   {
//     src: "/images/gallery-2.jpg",
//     alt: "Partnership in Dubai",
//     className: "col-span-2 sm:col-span-2",
//   },
//   {
//     src: "/images/gallery-3.jpg",
//     alt: "On site",
//     className: "col-span-1",
//   },
//   {
//     src: "/images/gallery-4.jpg",
//     alt: "Team discussion",
//     className: "col-span-1",
//   },
//   {
//     src: "/images/gallery-5.jpg",
//     alt: "Chairman portrait",
//     className: "col-span-1",
//   },
//   {
//     src: "/images/gallery-6.jpg",
//     alt: "City skyline",
//     className: "col-span-1",
//   },
// ];

// const ease = [0.22, 1, 0.36, 1] as const;

// export default function LeadershipGallerySection() {
//   const [open, setOpen] = useState<number | null>(null);
//   const closeRef = useRef<HTMLButtonElement>(null);
//   const lastTrigger = useRef<HTMLElement | null>(null);

//   const step = useCallback((d: number) => {
//     setOpen((i) => (i === null ? i : (i + d + photos.length) % photos.length));
//   }, []);

//   const close = useCallback(() => {
//     setOpen(null);
//     lastTrigger.current?.focus();
//   }, []);

//   // Keyboard controls + scroll lock while the lightbox is open
//   useEffect(() => {
//     if (open === null) return;
//     const onKey = (e: KeyboardEvent) => {
//       if (e.key === "Escape") close();
//       if (e.key === "ArrowRight") step(1);
//       if (e.key === "ArrowLeft") step(-1);
//     };
//     window.addEventListener("keydown", onKey);
//     const prev = document.body.style.overflow;
//     document.body.style.overflow = "hidden";
//     closeRef.current?.focus();
//     return () => {
//       window.removeEventListener("keydown", onKey);
//       document.body.style.overflow = prev;
//     };
//   }, [open, step, close]);

//   return (
//     <section
//       id="gallery"
//       className="relative overflow-hidden border-t border-[#c8a15a]/25 bg-gradient-to-b from-[#0c0a08] to-[#12100c] py-16 text-[#d8d2c8] sm:py-20"
//     >
//       <div
//         aria-hidden
//         className="pointer-events-none absolute -right-40 top-1/3 h-[420px] w-[420px] rounded-full bg-[#c8a15a]/10 blur-[130px]"
//       />

//       <div className="relative mx-auto max-w-[1180px] px-5 sm:px-7">
//         {/* Header */}
//         <div className="mb-10 grid items-end gap-5 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
//           <Reveal>
//             <h2 className="font-serif text-4xl font-medium leading-[1.1] text-white sm:text-5xl">
//               On the ground.
//               <br />
//               <span className="text-[#c8a15a]">For what matters.</span>
//             </h2>
//           </Reveal>
//           <Reveal delay={0.1}>
//             <p className="max-w-[420px] border-l border-[#c8a15a]/40 pl-5 text-[15px] leading-[1.8] text-[#968f83]">
//               Moments from meetings, sites and partnerships around the world —
//               people, partnerships and progress in action.
//             </p>
//           </Reveal>
//         </div>

//         {/* Bento grid */}
//         <div className="grid auto-rows-[150px] grid-cols-2 gap-2 sm:auto-rows-[190px] sm:grid-cols-6 sm:gap-3 lg:auto-rows-[220px]">
//           {photos.map((p, i) => (
//             <motion.div
//               key={p.src}
//               initial={{ opacity: 0, y: 28 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true, margin: "-40px" }}
//               transition={{ duration: 0.65, delay: i * 0.08, ease }}
//               className={p.className}
//             >
//               <button
//                 type="button"
//                 onClick={(e) => {
//                   lastTrigger.current = e.currentTarget;
//                   setOpen(i);
//                 }}
//                 aria-label={`View photo: ${p.alt}`}
//                 className="group relative block h-full w-full overflow-hidden border border-[#c8a15a]/20 text-left transition-colors duration-300 hover:border-[#c8a15a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0c28a]"
//               >
//                 <Image
//                   src={p.src}
//                   alt=""
//                   fill
//                   sizes="(min-width: 1024px) 590px, (min-width: 640px) 50vw, 100vw"
//                   className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a08]/85 via-[#0c0a08]/10 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

//                 {/* expand hint */}
//                 <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-[#c8a15a]/60 bg-[#0c0a08]/50 text-[#e0c28a] opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
//                   <Maximize2 className="h-4 w-4" />
//                 </span>

//                 {/* caption */}
//                 <span className="absolute inset-x-0 bottom-0 flex items-center gap-2.5 p-3 sm:p-4">
//                   <span className="h-px w-5 bg-[#c8a15a] transition-all duration-500 group-hover:w-9" />
//                   <span className="text-[13px] text-white">{p.alt}</span>
//                 </span>
//               </button>
//             </motion.div>
//           ))}
//         </div>
//       </div>

//       {/* Lightbox */}
//       <AnimatePresence>
//         {open !== null && (
//           <motion.div
//             role="dialog"
//             aria-modal="true"
//             aria-label="Photo viewer"
//             className="fixed inset-0 z-50 flex items-center justify-center bg-[#0c0a08]/95 p-4 backdrop-blur-sm sm:p-10"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.25 }}
//             onClick={close}
//           >
//             <button
//               ref={closeRef}
//               type="button"
//               aria-label="Close"
//               onClick={close}
//               className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-[#c8a15a]/50 text-[#e0c28a] transition-colors hover:bg-[#c8a15a] hover:text-[#0c0a08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0c28a] sm:right-6 sm:top-6"
//             >
//               <X className="h-5 w-5" />
//             </button>

//             <button
//               type="button"
//               aria-label="Previous photo"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 step(-1);
//               }}
//               className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#c8a15a]/50 bg-[#0c0a08]/60 text-[#e0c28a] transition-colors hover:bg-[#c8a15a] hover:text-[#0c0a08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0c28a] sm:left-6"
//             >
//               <ChevronLeft className="h-5 w-5" />
//             </button>
//             <button
//               type="button"
//               aria-label="Next photo"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 step(1);
//               }}
//               className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#c8a15a]/50 bg-[#0c0a08]/60 text-[#e0c28a] transition-colors hover:bg-[#c8a15a] hover:text-[#0c0a08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0c28a] sm:right-6"
//             >
//               <ChevronRight className="h-5 w-5" />
//             </button>

//             <AnimatePresence mode="wait">
//               <motion.figure
//                 key={open}
//                 className="flex h-full w-full max-w-[1100px] flex-col"
//                 initial={{ opacity: 0, scale: 0.97 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.97 }}
//                 transition={{ duration: 0.3, ease }}
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className="relative min-h-0 flex-1">
//                   <Image
//                     src={photos[open].src}
//                     alt={photos[open].alt}
//                     fill
//                     sizes="100vw"
//                     className="object-contain"
//                     priority
//                   />
//                 </div>
//                 <figcaption className="mt-4 flex items-center justify-center gap-3 text-sm text-[#d8d2c8]">
//                   <span className="h-px w-6 bg-[#c8a15a]" />
//                   {photos[open].alt}
//                   <span className="text-xs text-[#968f83]">
//                     {open + 1} / {photos.length}
//                   </span>
//                 </figcaption>
//               </motion.figure>
//             </AnimatePresence>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </section>
//   );
// }

"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import Reveal from "./Reveal";

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
}

const DEFAULT_PHOTOS: GalleryPhoto[] = [
  { id: "default-1", src: "/images/gallery-1.jpg", alt: "Leadership meeting" },
  {
    id: "default-2",
    src: "/images/gallery-2.jpg",
    alt: "Partnership in Dubai",
  },
  { id: "default-3", src: "/images/gallery-3.jpg", alt: "On site" },
  { id: "default-4", src: "/images/gallery-4.jpg", alt: "Team discussion" },
  { id: "default-5", src: "/images/gallery-5.jpg", alt: "Chairman portrait" },
  { id: "default-6", src: "/images/gallery-6.jpg", alt: "City skyline" },
];

const ease = [0.22, 1, 0.36, 1] as const;

const BIG = "col-span-2 row-span-2 sm:col-span-3";

/**
 * Photo koyta ache tar upor base kore bento layout er class.
 * 6 ta hole original design; kom/beshi hole grid jeno faka na thake.
 */
function getLayout(i: number, total: number) {
  if (total === 1) return "col-span-2 row-span-2 sm:col-span-6";
  if (total === 2) return "col-span-1 row-span-2 sm:col-span-3";

  if (i === 0) return BIG;
  if (i === 1) {
    return total <= 5 ? "col-span-2 sm:col-span-3" : "col-span-2 sm:col-span-2";
  }
  if (total === 3 && i === 2) return "col-span-2 sm:col-span-3";
  if (total === 4 && i === 3) return "col-span-1 sm:col-span-2";
  if (i >= 6) return "col-span-1 sm:col-span-2";
  return "col-span-1";
}

interface LeadershipGallerySectionProps {
  photos?: GalleryPhoto[] | null;
}

export default function LeadershipGallerySection({
  photos,
}: LeadershipGallerySectionProps) {
  const reduce = useReducedMotion();
  const list = photos?.length ? photos : DEFAULT_PHOTOS;

  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  const step = useCallback(
    (d: number) => {
      setOpen((i) => (i === null ? i : (i + d + list.length) % list.length));
    },
    [list.length],
  );

  const close = useCallback(() => {
    setOpen(null);
    lastTrigger.current?.focus();
  }, []);

  // Keyboard controls + scroll lock while the lightbox is open
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, step, close]);

  const initial = reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 };
  const current = open !== null ? list[open] : null;

  return (
    <section
      id="gallery"
      className="relative overflow-hidden border-t border-[#c8a15a]/25 bg-gradient-to-b from-[#0c0a08] to-[#12100c] py-16 text-[#d8d2c8] sm:py-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/3 h-[420px] w-[420px] rounded-full bg-[#c8a15a]/10 blur-[130px]"
      />

      <div className="relative mx-auto max-w-[1180px] px-5 sm:px-7">
        {/* Header */}
        <div className="mb-10 grid items-end gap-5 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <Reveal>
            <h2 className="font-serif text-4xl font-medium leading-[1.1] text-white sm:text-5xl">
              On the ground.
              <br />
              <span className="text-[#c8a15a]">For what matters.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-[420px] border-l border-[#c8a15a]/40 pl-5 text-[15px] leading-[1.8] text-[#968f83]">
              Moments from meetings, sites and partnerships around the world —
              people, partnerships and progress in action.
            </p>
          </Reveal>
        </div>

        {/* Bento grid */}
        <div className="grid auto-rows-[150px] grid-cols-2 gap-2 sm:auto-rows-[190px] sm:grid-cols-6 sm:gap-3 lg:auto-rows-[220px]">
          {list.map((p, i) => (
            <motion.div
              key={p.id}
              initial={initial}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65, delay: (i % 6) * 0.08, ease }}
              className={getLayout(i, list.length)}
            >
              <button
                type="button"
                onClick={(e) => {
                  lastTrigger.current = e.currentTarget;
                  setOpen(i);
                }}
                aria-label={`View photo: ${p.alt}`}
                className="group relative block h-full w-full overflow-hidden border border-[#c8a15a]/20 bg-[#1a160f] text-left transition-colors duration-300 hover:border-[#c8a15a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0c28a]"
              >
                {p.src ? (
                  <Image
                    src={p.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 590px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#c8a15a]/20 to-[#1a160f]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a08]/85 via-[#0c0a08]/10 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

                {/* expand hint */}
                <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-[#c8a15a]/60 bg-[#0c0a08]/50 text-[#e0c28a] opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Maximize2 className="h-4 w-4" />
                </span>

                {/* caption */}
                <span className="absolute inset-x-0 bottom-0 flex items-center gap-2.5 p-3 sm:p-4">
                  <span className="h-px w-5 shrink-0 bg-[#c8a15a] transition-all duration-500 group-hover:w-9" />
                  <span className="line-clamp-1 text-[13px] text-white">
                    {p.alt}
                  </span>
                </span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {open !== null && current && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0c0a08]/95 p-4 backdrop-blur-sm sm:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
          >
            <button
              ref={closeRef}
              type="button"
              aria-label="Close"
              onClick={close}
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-[#c8a15a]/50 text-[#e0c28a] transition-colors hover:bg-[#c8a15a] hover:text-[#0c0a08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0c28a] sm:right-6 sm:top-6"
            >
              <X className="h-5 w-5" />
            </button>

            {list.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous photo"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#c8a15a]/50 bg-[#0c0a08]/60 text-[#e0c28a] transition-colors hover:bg-[#c8a15a] hover:text-[#0c0a08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0c28a] sm:left-6"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next photo"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                  className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#c8a15a]/50 bg-[#0c0a08]/60 text-[#e0c28a] transition-colors hover:bg-[#c8a15a] hover:text-[#0c0a08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0c28a] sm:right-6"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            <AnimatePresence mode="wait">
              <motion.figure
                key={current.id}
                className="flex h-full w-full max-w-[1100px] flex-col"
                initial={{ opacity: 0, scale: reduce ? 1 : 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: reduce ? 1 : 0.97 }}
                transition={{ duration: 0.3, ease }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative min-h-0 flex-1">
                  {current.src ? (
                    <Image
                      src={current.src}
                      alt={current.alt}
                      fill
                      sizes="100vw"
                      className="object-contain"
                      priority
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center border border-[#c8a15a]/20 bg-gradient-to-br from-[#c8a15a]/10 to-[#1a160f] text-sm text-[#968f83]">
                      No image
                    </div>
                  )}
                </div>
                <figcaption className="mt-4 flex items-center justify-center gap-3 text-sm text-[#d8d2c8]">
                  <span className="h-px w-6 bg-[#c8a15a]" />
                  {current.alt}
                  <span className="text-xs text-[#968f83]">
                    {(open ?? 0) + 1} / {list.length}
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
