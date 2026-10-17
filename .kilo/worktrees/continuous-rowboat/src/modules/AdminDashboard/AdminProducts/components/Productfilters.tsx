"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useTransition } from "react";

const PRODUCT_STATUSES = ["ACTIVE", "INACTIVE"] as const;
const PRODUCT_SORT_OPTIONS = [
  { value: "price_asc", label: "Price: low–high" },
  { value: "price_desc", label: "Price: high–low" },
] as const;

interface Props {
  onPendingChange: (pending: boolean) => void;
}

export default function ProductFilters({ onPendingChange }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    onPendingChange(isPending);
  }, [isPending, onPendingChange]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");

    const queryString = params.toString();

    startTransition(() => {
      // ✅ push এর বদলে replace — history stack বাড়বে না
      router.replace(queryString ? `?${queryString}` : "?");
    });
  };

  const handleSearch = (value: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => updateParam("search", value), 400);
  };

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-2 md:p-4">
      {/* Search */}
      <label htmlFor="product-search" className="sr-only">
        Search products
      </label>
      <input
        id="product-search"
        type="search"
        aria-label="Search by name or SKU"
        placeholder="Search by name or SKU..."
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(e) => handleSearch(e.target.value)}
        className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-slate-300"
      />

      {/* Status Filter */}
      <Select
        value={searchParams.get("status") || "all"}
        onValueChange={(val) => updateParam("status", val === "all" ? "" : val)}
      >
        <SelectTrigger className="w-[140px]" aria-label="Filter by status">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent className="max-w-[140px]">
          <SelectItem value="all">All Status</SelectItem>
          <SelectSeparator />
          {PRODUCT_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort Filter */}
      <Select
        value={searchParams.get("sortOrder") || "default"}
        onValueChange={(val) =>
          updateParam("sortOrder", val === "default" ? "" : val)
        }
      >
        <SelectTrigger className="w-[160px]" aria-label="Sort products">
          <SelectValue placeholder="Default Order" />
        </SelectTrigger>
        <SelectContent className="max-w-[160px]">
          <SelectItem value="default">Default Order</SelectItem>
          <SelectSeparator />
          {PRODUCT_SORT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
