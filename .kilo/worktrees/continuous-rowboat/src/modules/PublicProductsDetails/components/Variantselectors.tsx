"use client";

import { useMemo, useState } from "react";

// ─── ColorSizeSelector ──────────────────────────────────────────────────────

function ColorSizeSelector({
  items,
  selected,
  onSelect,
}: {
  items: string[];
  selected: string;
  onSelect: (val: string) => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const LIMIT = 6;
  const visible = showAll ? items : items.slice(0, LIMIT);

  // ✅ Toggle logic — already selected item e click korle deselect (empty string) hobe,
  // na hole normal select
  const handleClick = (item: string) => {
    if (selected === item) {
      onSelect(""); // double click / same item click → inactive
    } else {
      onSelect(item);
    }
  };

  return (
    <div>
      <div
        className="flex flex-wrap gap-1.5 max-h-[72px] overflow-hidden"
        style={{ maxHeight: showAll ? "none" : "72px" }}
      >
        {visible.map((item) => (
          <button
            key={item}
            onClick={() => handleClick(item)}
            className={`px-3 py-1 rounded-md border text-[12px] font-medium transition-all ${
              selected === item
                ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white border-orange-600 shadow-sm shadow-orange-300/50"
                : "border-gray-300 text-gray-600 hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      {items.length > LIMIT && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-1.5 text-[12px] text-orange-600 hover:text-orange-700 hover:underline"
        >
          {showAll ? "Show less ▲" : `+${items.length - LIMIT} more ▼`}
        </button>
      )}
    </div>
  );
}

// ─── VariantSelectors ───────────────────────────────────────────────────────

interface Variation {
  color?: string;
  size?: string;
}

interface VariantSelectorsProps {
  variations: Variation[]; // ✅ raw variations pass korte hobe, filtering korar jonno
  colors: string[];
  selectedColor: string;
  onSelectColor: (color: string) => void;
  selectedSize: string;
  onSelectSize: (size: string) => void;
}

export function VariantSelectors({
  variations,
  colors,
  selectedColor,
  onSelectColor,
  selectedSize,
  onSelectSize,
}: VariantSelectorsProps) {
  // ✅ Selected color onujayi available sizes filter kora hocche.
  // Color select na thakle (empty), shob unique size dekhabe.
  // Color select thakle, sudhu shei color er variation e je size ache tai dekhabe.
  const availableSizes = useMemo(() => {
    const relevant = selectedColor
      ? variations.filter((v) => v.color === selectedColor)
      : variations;

    return [
      ...new Set(relevant.map((v) => v.size).filter(Boolean)),
    ] as string[];
  }, [variations, selectedColor]);

  // ✅ Color change hole, jodi age selected size ekhon ei color e available na thake,
  // tahole size selection reset kore dao (stale/invalid combo thakbe na)
  const handleSelectColor = (color: string) => {
    onSelectColor(color);

    if (selectedSize) {
      const relevant = color
        ? variations.filter((v) => v.color === color)
        : variations;
      const stillValid = relevant.some((v) => v.size === selectedSize);
      if (!stillValid) {
        onSelectSize("");
      }
    }
  };

  return (
    <>
      {colors.length > 0 && (
        <div className="mt-4">
          <h3 className="text-[13px] font-semibold mb-2 text-gray-700">
            Variant:{" "}
            <span className="text-orange-600">
              {selectedColor || "Select a color"}
            </span>
          </h3>
          <ColorSizeSelector
            items={colors}
            selected={selectedColor}
            onSelect={handleSelectColor}
          />
        </div>
      )}

      {/* ✅ শুধু তখনই দেখাবে যখন selected color এর জন্য সাইজ আছে */}
      {availableSizes.length > 0 && (
        <div className="mt-4">
          <h3 className="text-[13px] font-semibold mb-2 text-gray-700">
            Size:{" "}
            <span className="text-orange-600">
              {selectedSize || "Select a size"}
            </span>
          </h3>
          <ColorSizeSelector
            items={availableSizes}
            selected={selectedSize}
            onSelect={onSelectSize}
          />
        </div>
      )}
    </>
  );
}
