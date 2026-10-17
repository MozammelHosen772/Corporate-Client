"use client";

import { ChevronDown, ListFilter, Loader2, RotateCcw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export interface IFilterOption {
  value: string;
  count: number;
}

interface FilterGroup {
  key: string; // URL query param name — যেমন "brand" বা "brands"
  label: string; // দেখানোর নাম — যেমন "Brand"
  options: IFilterOption[];
}

interface Props {
  groups: FilterGroup[]; // যতগুলো ফিল্টার গ্রুপ দরকার (brand/color/size — Shop হোক বা Category)
  showHeader?: boolean; // Shop page-এ header + card wrapper লাগে, Category-তে sidebar tree-এর নিচে বসলে নাও লাগতে পারে
  onApply?: () => void; // ✅ নতুন — Apply চাপার পর কলার-কে জানানোর জন্য (যেমন mobile drawer বন্ধ করা)
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

export default function ProductFilterPanel({
  groups,
  showHeader = true,
  onApply,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // প্রতিটা group-এর জন্য আলাদা selected state, key দিয়ে ম্যাপ করা
  const [selected, setSelected] = useState<Record<string, string[]>>(() => {
    const init: Record<string, string[]> = {};
    groups.forEach((g) => {
      init[g.key] = searchParams.get(g.key)?.split(",").filter(Boolean) ?? [];
    });
    return init;
  });

  const toggle = (groupKey: string, value: string) => {
    setSelected((prev) => {
      const current = prev[groupKey] ?? [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [groupKey]: next };
    });
  };

  const apply = () => {
    const params = new URLSearchParams(searchParams.toString());
    groups.forEach((g) => {
      const values = selected[g.key] ?? [];
      if (values.length) params.set(g.key, values.join(","));
      else params.delete(g.key);
    });
    params.delete("page");
    startTransition(() => {
      router.push(`?${params.toString()}`);
      onApply?.(); // ✅ নতুন — mobile drawer বন্ধ করার জন্য
    });
  };

  const clearAll = () => {
    const cleared: Record<string, string[]> = {};
    groups.forEach((g) => (cleared[g.key] = []));
    setSelected(cleared);

    const params = new URLSearchParams(searchParams.toString());
    groups.forEach((g) => params.delete(g.key));
    params.delete("page");
    startTransition(() => router.push(`?${params.toString()}`));
  };

  const hasActiveFilters = groups.some(
    (g) => (selected[g.key]?.length ?? 0) > 0,
  );
  const hasAnyOptions = groups.some((g) => g.options.length > 0);

  if (!hasAnyOptions) return null;

  const content = (
    <>
      <div
        className={showHeader ? "border-b border-gray-100 px-4 py-3" : "mb-1"}
      >
        <button
          onClick={apply}
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

      <div className={showHeader ? "space-y-5 px-4 py-4" : "space-y-5 mt-4"}>
        {groups.map(
          (g) =>
            g.options.length > 0 && (
              <FilterSection
                key={g.key}
                title={g.label}
                count={g.options.length}
              >
                <div className="max-h-48 space-y-1.5 overflow-y-auto pr-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-transparent">
                  {g.options.map((opt) => (
                    <label
                      key={opt.value}
                      className="flex cursor-pointer items-center justify-between gap-2 py-0.5 text-sm text-gray-600 hover:text-gray-900"
                    >
                      <span className="flex items-center gap-2 truncate">
                        <input
                          type="checkbox"
                          checked={(selected[g.key] ?? []).includes(opt.value)}
                          onChange={() => toggle(g.key, opt.value)}
                          className="h-3.5 w-3.5 shrink-0 rounded border-gray-300 text-orange-600 focus:ring-orange-500 focus:ring-offset-0"
                        />
                        <span className="truncate">{opt.value}</span>
                      </span>
                      <span className="shrink-0 text-xs text-gray-400">
                        {opt.count}
                      </span>
                    </label>
                  ))}
                </div>
              </FilterSection>
            ),
        )}
      </div>
    </>
  );

  if (!showHeader) {
    // Category sidebar-এ বসানোর জন্য — নিজস্ব card wrapper সহ, কিন্তু ছোট header
    return (
      <div className="mt-4 rounded-xl border border-gray-100 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
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
        {content}
      </div>
    );
  }

  // Shop page-এর পূর্ণাঙ্গ card wrapper
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
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
      {content}
    </div>
  );
}
