"use client";

import { useEffect, useRef, useState } from "react";

type ScrollDirection = "up" | "down";

/**
 * Tracks scroll direction with a small threshold to avoid jitter,
 * and reports "up" whenever we're near the top of the page.
 */
export function useScrollDirection(threshold = 8, topOffset = 40) {
  const [direction, setDirection] = useState<ScrollDirection>("up");
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY;

    function update() {
      const currentY = window.scrollY;

      if (currentY <= topOffset) {
        setDirection("up");
      } else {
        const delta = currentY - lastY.current;
        if (Math.abs(delta) >= threshold) {
          setDirection(delta > 0 ? "down" : "up");
          lastY.current = currentY;
        }
      }
      ticking.current = false;
    }

    function onScroll() {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold, topOffset]);

  return direction;
}
