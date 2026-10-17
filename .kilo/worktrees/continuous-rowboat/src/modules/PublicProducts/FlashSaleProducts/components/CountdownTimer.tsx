"use client";

import { UseCountdown } from "./UseCountdown";

export function CountdownTimer({ onExpired }: { onExpired?: () => void }) {
  const timeLeft = UseCountdown(onExpired);

  if (!timeLeft) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span>Hurry up! Offer ends in:</span>

        {Array.from({ length: 3 }).map((_, i) => (
          <span
            key={i}
            className="bg-[#1a2e4a] text-white text-sm font-semibold px-2.5 py-1 rounded-md min-w-[36px] text-center"
          >
            --
          </span>
        ))}
      </div>
    );
  }

  const { h, m, s } = timeLeft;

  return (
    <div className="flex items-center gap-2 text-sm text-slate-500">
      <span>Hurry up! Offer ends in:</span>

      {[h, m, s].map((unit, i) => (
        <span
          key={i}
          className="bg-[#1a2e4a] text-white text-sm font-semibold px-2.5 py-1 rounded-md min-w-[36px] text-center tabular-nums"
        >
          {unit}
        </span>
      ))}
    </div>
  );
}
