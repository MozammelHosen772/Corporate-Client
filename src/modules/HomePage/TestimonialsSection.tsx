"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import Reveal from "./Reveal";

const testimonials = [
  {
    quote:
      "A rare combination of strategic vision, integrity and execution. G Group is a valued partner, and we look forward to many more years of creating impact together.",
    name: "Alex Carter",
    role: "Managing Partner, Global Investments",
  },
  {
    quote:
      "Their long-term thinking and discipline set them apart. Every engagement has been built on trust and delivered with excellence.",
    name: "Sarah Al-Mansoori",
    role: "Director, Gulf Infrastructure Fund",
  },
  {
    quote:
      "G Group understands that real growth comes from people and partnerships. They are a team we are proud to work with.",
    name: "David Chen",
    role: "CEO, Asia Pacific Logistics",
  },
  {
    quote:
      "Consistent, principled and forward-looking. A partner that creates value for every stakeholder involved.",
    name: "Maria Lopez",
    role: "Head of Strategy, Meridian Energy",
  },
  {
    quote:
      "From the first meeting to delivery, the standard of execution was exceptional. We expect many more projects together.",
    name: "James Whitfield",
    role: "Chairman, Whitfield Real Estate",
  },
];

// How long each testimonial stays (ms)
const DURATION = 6000;

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

export default function TestimonialsSection() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const inView = useInView(sectionRef, { amount: 0.35 });

  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [userPaused, setUserPaused] = useState(false);

  const playing = inView && !userPaused && !reduce;

  const go = useCallback((delta: number) => {
    setDir(delta);
    setIndex((i) => (i + delta + testimonials.length) % testimonials.length);
  }, []);

  const jump = (i: number) => {
    setDir(i >= index ? 1 : -1);
    setIndex(i);
  };

  // Auto-advance
  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => go(1), DURATION);
    return () => clearTimeout(id);
  }, [index, playing, go]);

  // Keep the active tab centred in the mobile scroller (without moving the page)
  useEffect(() => {
    const c = tabsRef.current;
    const el = tabRefs.current[index];
    if (!c || !el || c.scrollWidth <= c.clientWidth) return;
    c.scrollTo({
      left: el.offsetLeft - (c.clientWidth - el.clientWidth) / 2,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [index, reduce]);

  const current = testimonials[index];

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative overflow-hidden border-t border-[#c8a15a]/25 bg-gradient-to-b from-[#12100c] to-[#0c0a08] py-16 text-[#d8d2c8] sm:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-[#c8a15a]/10 blur-[140px]"
      />

      <div className="relative mx-auto max-w-[1180px] px-5 sm:px-7">
        {/* Header */}
        <Reveal>
          <div className="mx-auto max-w-[640px] text-center">
            <h2 className="font-serif text-4xl font-medium leading-[1.1] text-white sm:text-5xl">
              Enduring relationships.
              <br />
              <span className="text-[#c8a15a]">Greater possibilities.</span>
            </h2>
            <p className="mt-4 text-[15px] text-[#968f83]">
              What our partners say about working with G Group.
            </p>
          </div>
        </Reveal>

        {/* Quote stage */}
        <div className="relative mx-auto mt-12 max-w-[860px]">
          <span
            aria-hidden
            className="pointer-events-none absolute -top-10 left-0 select-none font-serif text-[200px] leading-none text-[#c8a15a]/15 sm:-left-6 sm:text-[260px]"
          >
            “
          </span>

          <div className="relative flex items-center gap-2 sm:gap-6">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={() => go(-1)}
              className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#c8a15a]/40 text-[#c8a15a] transition-colors hover:bg-[#c8a15a] hover:text-[#0c0a08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0c28a] sm:flex"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div
              className="relative min-h-[260px] flex-1 sm:min-h-[230px]"
              aria-live={playing ? "off" : "polite"}
            >
              <AnimatePresence mode="wait" custom={dir}>
                <motion.figure
                  key={index}
                  initial={{ opacity: 0, x: reduce ? 0 : dir * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: reduce ? 0 : dir * -40 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="text-center"
                >
                  <blockquote className="font-serif text-[22px] leading-[1.5] text-white sm:text-[28px]">
                    {current.quote}
                  </blockquote>
                  <figcaption className="mt-8 flex flex-col items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c8a15a]/60 bg-[#c8a15a]/10 text-sm tracking-wider text-[#e0c28a]">
                      {initials(current.name)}
                    </span>
                    <span>
                      <span className="block text-[15px] text-white">
                        {current.name}
                      </span>
                      <span className="block text-[13px] text-[#968f83]">
                        {current.role}
                      </span>
                    </span>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>

            <button
              type="button"
              aria-label="Next testimonial"
              onClick={() => go(1)}
              className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#c8a15a]/40 text-[#c8a15a] transition-colors hover:bg-[#c8a15a] hover:text-[#0c0a08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0c28a] sm:flex"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Partner tabs with auto-play progress */}
        <div className="mt-12 flex items-center gap-4">
          <div
            ref={tabsRef}
            className="relative flex flex-1 snap-x gap-3 overflow-x-auto pb-1 [scrollbar-width:none] lg:grid lg:grid-cols-5 lg:overflow-visible [&::-webkit-scrollbar]:hidden"
          >
            {testimonials.map((t, i) => {
              const isActive = i === index;
              return (
                <button
                  key={t.name}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  onClick={() => jump(i)}
                  aria-label={`Show testimonial from ${t.name}`}
                  aria-current={isActive}
                  className="group relative min-w-[200px] shrink-0 snap-center overflow-hidden border-t border-[#c8a15a]/20 pb-1 pt-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0c28a] lg:min-w-0"
                >
                  {/* progress line sits on the top border */}
                  {isActive && (
                    <motion.span
                      key={`${index}-${playing}`}
                      className="absolute left-0 top-0 h-[2px] w-full origin-left bg-[#c8a15a]"
                      initial={{ scaleX: playing ? 0 : 1 }}
                      animate={{ scaleX: 1 }}
                      transition={{
                        duration: playing ? DURATION / 1000 : 0,
                        ease: "linear",
                      }}
                    />
                  )}
                  <span
                    className={`block text-sm transition-colors duration-300 ${
                      isActive
                        ? "text-white"
                        : "text-[#968f83] group-hover:text-[#d8d2c8]"
                    }`}
                  >
                    {t.name}
                  </span>
                  <span
                    className={`mt-0.5 block text-xs leading-snug transition-colors duration-300 ${
                      isActive ? "text-[#c8a15a]" : "text-[#968f83]/60"
                    }`}
                  >
                    {t.role}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setUserPaused((p) => !p)}
            aria-label={userPaused ? "Play testimonials" : "Pause testimonials"}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#c8a15a]/40 text-[#c8a15a] transition-colors hover:bg-[#c8a15a] hover:text-[#0c0a08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0c28a]"
          >
            {userPaused ? (
              <Play className="h-4 w-4" />
            ) : (
              <Pause className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
