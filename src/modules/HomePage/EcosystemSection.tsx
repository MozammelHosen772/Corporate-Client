"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Building2,
  ConciergeBell,
  Cpu,
  HeartPulse,
  Leaf,
  Pause,
  Play,
  Ship,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import Reveal from "./Reveal";

const pillars = [
  {
    title: "Capital",
    text: "Investing in enduring value.",
    icon: BarChart3,
    href: "/enterprise/capital",
  },
  {
    title: "Energy",
    text: "Powering a cleaner future.",
    icon: Leaf,
    href: "/enterprise/energy",
  },
  {
    title: "Logistics",
    text: "Connecting markets globally.",
    icon: Ship,
    href: "/enterprise/logistics",
  },
  {
    title: "Hospitality",
    text: "Creating extraordinary experiences.",
    icon: ConciergeBell,
    href: "/enterprise/hospitality",
  },
  {
    title: "Technology",
    text: "Building for a smarter world.",
    icon: Cpu,
    href: "/enterprise/technology",
  },
  {
    title: "Healthcare",
    text: "Advancing healthier lives.",
    icon: HeartPulse,
    href: "/enterprise/healthcare",
  },
  {
    title: "Real Estate",
    text: "Shaping better communities.",
    icon: Building2,
    href: "/enterprise/real-estate",
  },
];

// How long each pillar stays open (ms)
const DURATION = 4000;

export default function EcosystemSection() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.35 });

  const [active, setActive] = useState(0);
  const [userPaused, setUserPaused] = useState(false);

  // Play only when visible, not manually paused, and motion is allowed
  const playing = inView && !userPaused && !reduce;

  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(
      () => setActive((a) => (a + 1) % pillars.length),
      DURATION,
    );
    return () => clearTimeout(id);
  }, [active, playing]);

  return (
    <section
      id="ecosystem"
      ref={ref}
      className="relative overflow-hidden border-t border-[#c8a15a]/25 bg-gradient-to-b from-[#0c0a08] to-[#12100c] py-16 text-[#d8d2c8] sm:py-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-10 h-[460px] w-[460px] rounded-full bg-[#c8a15a]/10 blur-[130px]"
      />

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-7">
        {/* Header */}
        <div className="mb-8 grid items-end gap-5 lg:mb-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <Reveal>
            <h2 className="font-serif text-4xl font-medium leading-[1.1] text-white sm:text-5xl">
              Seven pillars.
              <br />
              <span className="text-[#c8a15a]">One stronger tomorrow.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-[420px] border-l border-[#c8a15a]/40 pl-5 text-[15px] leading-[1.8] text-[#968f83]">
              A diversified group of companies, united by a shared purpose:
              building a more connected, sustainable and prosperous world.
            </p>
          </Reveal>
        </div>

        {/* Slider: row on desktop, column on mobile */}
        <div
          role="group"
          aria-roledescription="carousel"
          aria-label="Our seven pillars"
          className="flex h-[480px] flex-col gap-2 lg:h-[400px] lg:flex-row lg:gap-3"
        >
          {pillars.map(({ title, text, icon: Icon, href }, i) => {
            const isActive = active === i;
            return (
              <div
                key={title}
                style={{ flexGrow: isActive ? 5 : 1 }}
                className={`relative min-h-[44px] basis-0 overflow-hidden border transition-[flex-grow,border-color,background-color,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none lg:min-h-0 lg:min-w-0 ${
                  isActive
                    ? "border-[#c8a15a] bg-gradient-to-br from-[#241d12] to-[#100d0a] shadow-[0_0_40px_rgba(200,161,90,0.15)]"
                    : "border-[#c8a15a]/20 bg-[#14110c] hover:border-[#c8a15a]/50"
                }`}
              >
                {/* Click anywhere on a closed panel to open it */}
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Show ${title}`}
                  aria-current={isActive}
                  tabIndex={isActive ? -1 : 0}
                  className="absolute inset-0 z-0 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#e0c28a]"
                />

                <Icon
                  aria-hidden
                  className={`pointer-events-none absolute -right-6 -top-6 h-52 w-52 stroke-[0.6] text-[#c8a15a] transition-opacity duration-700 ${
                    isActive ? "opacity-[0.09]" : "opacity-0"
                  }`}
                />

                {/* icon */}
                <span
                  className={`pointer-events-none absolute left-3 top-[21px] flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border transition-all duration-500 lg:top-9 lg:h-11 lg:w-11 ${
                    isActive
                      ? "border-[#c8a15a] bg-[#c8a15a] text-[#0c0a08] lg:left-7 lg:translate-x-0"
                      : "border-[#c8a15a]/40 text-[#c8a15a] lg:left-1/2 lg:-translate-x-1/2"
                  }`}
                >
                  <Icon className="h-4 w-4 stroke-[1.5] lg:h-5 lg:w-5" />
                </span>

                {/* mobile title */}
                <span
                  className={`pointer-events-none absolute left-14 top-[21px] -translate-y-1/2 text-[15px] lg:hidden ${
                    isActive ? "text-white" : "text-[#d8d2c8]"
                  }`}
                >
                  {title}
                </span>

                {/* desktop collapsed label (vertical) */}
                <span
                  className={`pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 rotate-180 whitespace-nowrap text-sm tracking-[0.12em] text-[#d8d2c8] transition-opacity duration-300 [writing-mode:vertical-rl] lg:block ${
                    isActive ? "opacity-0" : "opacity-100 delay-300"
                  }`}
                >
                  {title}
                </span>

                {/* expanded content */}
                <div
                  aria-hidden={!isActive}
                  className={`pointer-events-none absolute left-14 right-4 top-11 z-10 transition-all duration-500 lg:bottom-0 lg:left-0 lg:right-auto lg:top-auto lg:w-[300px] lg:p-7 ${
                    isActive
                      ? "translate-y-0 opacity-100 delay-300"
                      : "translate-y-3 opacity-0"
                  }`}
                >
                  <h3 className="hidden font-serif text-3xl text-white lg:block">
                    {title}
                  </h3>
                  <p className="text-[13px] leading-snug text-[#968f83] lg:mt-2 lg:text-sm lg:leading-relaxed">
                    {text}
                  </p>
                  <Link
                    href={href}
                    tabIndex={isActive ? 0 : -1}
                    className={`group mt-2 inline-flex items-center gap-2 border-b border-[#c8a15a]/60 pb-0.5 text-[13px] text-[#e0c28a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e0c28a] lg:mt-5 lg:pb-1 lg:text-sm ${
                      isActive ? "pointer-events-auto" : ""
                    }`}
                  >
                    Visit enterprise
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 lg:h-4 lg:w-4" />
                  </Link>
                </div>

                {/* auto-play progress for the open panel */}
                {isActive && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-[#c8a15a]/15">
                    <motion.div
                      key={`${active}-${playing}`}
                      className="h-full origin-left bg-[#c8a15a]"
                      initial={{ scaleX: playing ? 0 : 1 }}
                      animate={{ scaleX: 1 }}
                      transition={{
                        duration: playing ? DURATION / 1000 : 0,
                        ease: "linear",
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="mt-5 flex items-center justify-end">
          <button
            type="button"
            onClick={() => setUserPaused((p) => !p)}
            aria-label={userPaused ? "Play slideshow" : "Pause slideshow"}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#c8a15a]/40 text-[#c8a15a] transition-colors hover:bg-[#c8a15a] hover:text-[#0c0a08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0c28a]"
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
