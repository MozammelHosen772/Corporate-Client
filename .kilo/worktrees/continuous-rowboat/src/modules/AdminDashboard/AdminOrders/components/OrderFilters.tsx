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
import {
  ORDER_STATUS_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
  PAYMENT_TYPE_OPTIONS,
} from "../constants/order.constants";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
] as const;

interface Props {
  onPendingChange: (pending: boolean) => void;
}

export default function OrderFilters({ onPendingChange }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    onPendingChange(isPending);
  }, [isPending, onPendingChange]);

  // ✅ timer cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    const queryString = params.toString();

    startTransition(() => {
      // ✅ replace — history stack বাড়বে না
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
      <label htmlFor="order-search" className="sr-only">
        Search orders
      </label>
      <input
        id="order-search"
        type="search"
        aria-label="Search by name or phone"
        placeholder="Search by name or phone..."
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(e) => handleSearch(e.target.value)}
        className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-slate-300"
      />

      {/* Order Status */}
      <Select
        value={searchParams.get("status") || "all"}
        onValueChange={(val) => updateParam("status", val === "all" ? "" : val)}
      >
        <SelectTrigger className="w-[150px]" aria-label="Filter by status">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent className="max-w-[150px]">
          <SelectItem value="all">All Status</SelectItem>
          <SelectSeparator />
          {ORDER_STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Payment Type */}
      <Select
        value={searchParams.get("paymentType") || "all"}
        onValueChange={(val) =>
          updateParam("paymentType", val === "all" ? "" : val)
        }
      >
        <SelectTrigger
          className="w-[170px]"
          aria-label="Filter by payment type"
        >
          <SelectValue placeholder="All Payment Types" />
        </SelectTrigger>
        <SelectContent className="max-w-[170px]">
          <SelectItem value="all">All Payment Types</SelectItem>
          <SelectSeparator />
          {PAYMENT_TYPE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Payment Status */}
      <Select
        value={searchParams.get("paymentStatus") || "all"}
        onValueChange={(val) =>
          updateParam("paymentStatus", val === "all" ? "" : val)
        }
      >
        <SelectTrigger
          className="w-[160px]"
          aria-label="Filter by payment status"
        >
          <SelectValue placeholder="All Payment Status" />
        </SelectTrigger>
        <SelectContent className="max-w-[160px]">
          <SelectItem value="all">All Payment Status</SelectItem>
          <SelectSeparator />
          {PAYMENT_STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort */}
      <Select
        value={searchParams.get("sortOrder") || "newest"}
        onValueChange={(val) =>
          updateParam("sortOrder", val === "newest" ? "" : val)
        }
      >
        <SelectTrigger className="w-[145px]" aria-label="Sort orders">
          <SelectValue placeholder="Newest first" />
        </SelectTrigger>
        <SelectContent className="max-w-[145px]">
          {SORT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
