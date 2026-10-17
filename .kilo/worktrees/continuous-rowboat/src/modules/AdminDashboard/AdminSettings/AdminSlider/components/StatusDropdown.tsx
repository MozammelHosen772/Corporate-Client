"use client";

import { TSliderItem } from "@/services/settings/bannerSlider.service";
import { ChevronDown, ToggleLeft, ToggleRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Props {
  slider: TSliderItem;
  onToggle: (slider: TSliderItem) => void;
}

export default function StatusDropdown({ slider, onToggle }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
          slider.isActive
            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
            : "bg-red-100 text-red-700 hover:bg-red-200"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            slider.isActive ? "bg-emerald-500" : "bg-red-500"
          }`}
        />
        {slider.isActive ? "Active" : "Inactive"}
        <ChevronDown
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-1.5 w-40 rounded-xl border border-slate-100 bg-white py-1 shadow-xl">
          <button
            onClick={() => {
              setOpen(false);
              onToggle(slider);
            }}
            className={`flex w-full items-center gap-2.5 px-3 py-2 text-sm transition hover:bg-slate-50 ${
              slider.isActive ? "text-orange-600" : "text-emerald-600"
            }`}
          >
            {slider.isActive ? (
              <>
                <ToggleLeft className="h-4 w-4" />
                Deactivate
              </>
            ) : (
              <>
                <ToggleRight className="h-4 w-4" />
                Activate
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
