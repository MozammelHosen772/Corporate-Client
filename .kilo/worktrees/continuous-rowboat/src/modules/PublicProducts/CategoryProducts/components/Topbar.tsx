"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useTransition } from "react";
import { SORT_OPTIONS } from "../constants/categoryProducts.constants.ts";

interface TopBarProps {
  total: number;
  onPendingChange?: (pending: boolean) => void;
}

export default function TopBar({ total, onPendingChange }: TopBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const sortBy = searchParams.get("sortBy") ?? "createdAt";
  const sortOrder = searchParams.get("sortOrder") ?? "desc";
  const currentValue = `${sortBy}__${sortOrder}`;

  useEffect(() => {
    onPendingChange?.(isPending);
  }, [isPending, onPendingChange]);

  const handleSortChange = (value: string) => {
    const [by, order] = value.split("__");
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", by);
    params.set("sortOrder", order);
    params.delete("page");
    const queryString = params.toString();

    startTransition(() => {
      router.replace(queryString ? `?${queryString}` : "?");
    });
  };

  return (
    <div
      className={`mb-4  flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-1.5 md:p-4 transition-opacity duration-200 ${
        isPending ? "opacity-50 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Total count */}
      <p className="flex-1 text-sm text-slate-500">
        Showing <span className="font-semibold text-slate-800">{total}</span>{" "}
        products
      </p>

      {/* Sort Select */}
      <Select value={currentValue} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[150px]" aria-label="Sort products">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((opt) => (
            <SelectItem
              key={`${opt.sortBy}__${opt.sortOrder}`}
              value={`${opt.sortBy}__${opt.sortOrder}`}
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
