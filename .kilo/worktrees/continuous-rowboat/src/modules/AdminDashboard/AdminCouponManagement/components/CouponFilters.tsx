"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

interface Props {
  onPendingChange: (pending: boolean) => void;
}

export default function CouponFilters({ onPendingChange }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const status = searchParams.get("status") ?? "all";

  useEffect(() => {
    onPendingChange(isPending);
  }, [isPending, onPendingChange]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (search) params.set("search", search);
      else params.delete("search");
      params.set("page", "1");

      startTransition(() => {
        router.push(`/admin/dashboard/coupons-management?${params.toString()}`);
      });
    }, 400);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleStatusChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val === "all") params.delete("status");
    else params.set("status", val);
    params.set("page", "1");

    startTransition(() => {
      router.push(`/admin/dashboard/coupons-management?${params.toString()}`);
    });
  };

  return (
    <div className="mb-4 flex flex-col sm:flex-row gap-3">
      <Input
        placeholder="Search by coupon code..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-xs"
      />

      <Select value={status} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
