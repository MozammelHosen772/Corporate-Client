"use client";

import { LayoutGrid, List, Rows3, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export type TGridMode = "cols-2" | "cols-3" | "cols-4" | "list";

const SORT_OPTIONS = [
  { label: "Latest", sortBy: "createdAt", sortOrder: "desc" },
  { label: "Price: Low to High", sortBy: "sellingPrice", sortOrder: "asc" },
  { label: "Price: High to Low", sortBy: "sellingPrice", sortOrder: "desc" },
  { label: "Name: A to Z", sortBy: "name", sortOrder: "asc" },
] as const;

const VIEW_MODES: { mode: TGridMode; icon: typeof LayoutGrid }[] = [
  { mode: "cols-2", icon: Rows3 },
  { mode: "cols-3", icon: LayoutGrid },
  { mode: "cols-4", icon: SlidersHorizontal }, // নিচে override করছি আসল আইকন দিয়ে
  { mode: "list", icon: List },
];

interface Props {
  totalProducts: number;
  showingCount: number;
  gridMode: TGridMode;
  onGridModeChange: (mode: TGridMode) => void;
}

export default function ShopToolbar({
  totalProducts,
  showingCount,
  gridMode,
  onGridModeChange,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSortBy = searchParams.get("sortBy") || "createdAt";
  const currentSortOrder = searchParams.get("sortOrder") || "desc";

  const handleSortChange = (value: string) => {
    const selected = SORT_OPTIONS.find(
      (o) => `${o.sortBy}-${o.sortOrder}` === value,
    );
    if (!selected) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", selected.sortBy);
    params.set("sortOrder", selected.sortOrder);
    params.delete("page");

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <div className="mb-3 border-b border-gray-100 pb-3">
      {/* ── সারি ১: কাউন্ট + ভিউ টগল + সর্ট ─────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
          <SlidersHorizontal className="h-3.5 w-3.5 text-gray-400" />
          {totalProducts.toLocaleString("en-US")}{" "}
          <span className="text-gray-400">PRODUCTS</span>
        </span>

        <div className="flex items-center gap-4">
          {/* View mode toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 p-0.5">
            {[
              { mode: "cols-2" as TGridMode, icon: Rows3 },
              { mode: "cols-3" as TGridMode, icon: LayoutGrid },
              { mode: "cols-4" as TGridMode, icon: LayoutGrid },
              { mode: "list" as TGridMode, icon: List },
            ].map(({ mode, icon: Icon }) => (
              <button
                key={mode}
                onClick={() => onGridModeChange(mode)}
                title={mode}
                className={`flex h-6 w-6 items-center justify-center rounded-md transition-colors ${
                  gridMode === mode
                    ? "bg-orange-500 text-white"
                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>

          {/* Sort by */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-400">SORT BY:</span>
            <select
              value={`${currentSortBy}-${currentSortOrder}`}
              onChange={(e) => handleSortChange(e.target.value)}
              disabled={isPending}
              className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.label} value={`${o.sortBy}-${o.sortOrder}`}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── সারি ২: "Showing X products" ─────────────────────────────── */}
      <p className="mt-2 text-xs text-gray-400">
        SHOWING{" "}
        <span className="font-semibold text-gray-600">{showingCount}</span>{" "}
        PRODUCTS
      </p>
    </div>
  );
}
