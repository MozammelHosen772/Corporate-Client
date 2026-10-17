"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  className?: string;
};

export default function Reveal({
  children,
  delay = 0,
  y = 24,
  x = 0,
  className,
}: Props) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{
        opacity: reduce ? 1 : 0,
        y: reduce ? 0 : y,
        x: reduce ? 0 : x,
      }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
