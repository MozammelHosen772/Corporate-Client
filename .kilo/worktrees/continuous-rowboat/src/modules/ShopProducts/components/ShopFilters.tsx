"use client";

import { IShopFilterOptions } from "@/services/products/products.service";
import { ChevronDown, ListFilter, Loader2, RotateCcw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

interface Props {
  filterOptions: IShopFilterOptions;
  onApply?: () => void;
}

function FilterSection({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
          {title}{" "}
          <span className="font-normal normal-case text-gray-400">
            ({count})
          </span>
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-gray-400 transition-transform ${
            open ? "" : "-rotate-90"
          }`}
        />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

export default function ShopFilters({ filterOptions, onApply }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentBrands =
    searchParams.get("brands")?.split(",").filter(Boolean) ?? [];
  const currentColors =
    searchParams.get("colors")?.split(",").filter(Boolean) ?? [];

  const [selectedBrands, setSelectedBrands] = useState<string[]>(currentBrands);
  const [selectedColors, setSelectedColors] = useState<string[]>(currentColors);

  const toggleBrand = (value: string) => {
    setSelectedBrands((prev) =>
      prev.includes(value) ? prev.filter((b) => b !== value) : [...prev, value],
    );
  };

  const toggleColor = (value: string) => {
    setSelectedColors((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value],
    );
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedBrands.length) params.set("brands", selectedBrands.join(","));
    else params.delete("brands");

    if (selectedColors.length) params.set("colors", selectedColors.join(","));
    else params.delete("colors");

    params.delete("page");

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });

    onApply?.();
  };

  const clearAll = () => {
    setSelectedBrands([]);
    setSelectedColors([]);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("brands");
    params.delete("colors");
    params.delete("page");

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });

    onApply?.();
  };

  const hasActiveFilters =
    selectedBrands.length > 0 || selectedColors.length > 0;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/60 px-4 py-3">
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-700">
          <ListFilter className="h-3.5 w-3.5" />
          Filters
        </span>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            disabled={isPending}
            className="flex items-center gap-1 text-[11px] font-medium text-orange-600 hover:text-orange-700"
          >
            <RotateCcw className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      {/* ── Apply Filters — এখন হেডারের ঠিক নিচেই, উপরে ───────────────── */}
      <div className="border-b border-gray-100 px-4 py-3">
        <button
          onClick={applyFilters}
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 py-2.5 text-xs font-bold text-white transition-all hover:from-orange-600 hover:to-red-600 disabled:opacity-60"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Apply Filters"
          )}
        </button>
      </div>

      <div className="space-y-5 px-4 py-4">
        {/* ── Brand ────────────────────────────────────────────────────── */}
        {filterOptions.brands.length > 0 && (
          <FilterSection title="Brand" count={filterOptions.brands.length}>
            <label className="mb-1.5 flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={selectedBrands.length === 0}
                onChange={() => setSelectedBrands([])}
                className="h-3.5 w-3.5 rounded border-gray-300 text-orange-600 focus:ring-orange-500 focus:ring-offset-0"
              />
              All Brands
            </label>

            <div className="max-h-48 space-y-1.5 overflow-y-auto pr-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-transparent">
              {filterOptions.brands.map((brand) => (
                <label
                  key={brand.value}
                  className="flex cursor-pointer items-center justify-between gap-2 py-0.5 text-sm text-gray-600 hover:text-gray-900"
                >
                  <span className="flex items-center gap-2 truncate">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand.value)}
                      onChange={() => toggleBrand(brand.value)}
                      className="h-3.5 w-3.5 shrink-0 rounded border-gray-300 text-orange-600 focus:ring-orange-500 focus:ring-offset-0"
                    />
                    <span className="truncate">{brand.value}</span>
                  </span>
                  <span className="shrink-0 text-xs text-gray-400">
                    {brand.count}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* ── Color ────────────────────────────────────────────────────── */}
        {filterOptions.colors.length > 0 && (
          <FilterSection title="Color" count={filterOptions.colors.length}>
            <div className="max-h-48 space-y-1.5 overflow-y-auto pr-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-transparent">
              {filterOptions.colors.map((color) => (
                <label
                  key={color.value}
                  className="flex cursor-pointer items-center justify-between gap-2 py-0.5 text-sm text-gray-600 hover:text-gray-900"
                >
                  <span className="flex items-center gap-2 truncate">
                    <input
                      type="checkbox"
                      checked={selectedColors.includes(color.value)}
                      onChange={() => toggleColor(color.value)}
                      className="h-3.5 w-3.5 shrink-0 rounded border-gray-300 text-orange-600 focus:ring-orange-500 focus:ring-offset-0"
                    />
                    <span className="truncate">{color.value}</span>
                  </span>
                  <span className="shrink-0 text-xs text-gray-400">
                    {color.count}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}
      </div>
    </div>
  );
}
