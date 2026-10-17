"use client";

import { TPosition } from "@/services/settings/bannerSlider.service";
import { AlignCenter, AlignLeft } from "lucide-react";

interface Props {
  value: TPosition;
  onChange: (v: TPosition) => void;
}

export default function PositionToggle({ value, onChange }: Props) {
  return (
    <div className="flex w-fit rounded-xl border border-slate-200 bg-slate-50 p-1 gap-1">
      {(["center", "left"] as TPosition[]).map((pos) => (
        <button
          key={pos}
          type="button"
          onClick={() => onChange(pos)}
          className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition-all ${
            value === pos
              ? "bg-white text-slate-800 shadow-sm ring-1 ring-slate-200"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          {pos === "center" ? (
            <AlignCenter className="h-3.5 w-3.5" />
          ) : (
            <AlignLeft className="h-3.5 w-3.5" />
          )}
          {pos.charAt(0).toUpperCase() + pos.slice(1)}
        </button>
      ))}
    </div>
  );
}
