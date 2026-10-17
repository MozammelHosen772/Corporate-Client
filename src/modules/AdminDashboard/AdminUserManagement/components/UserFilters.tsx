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
  USER_ROLES,
  USER_STATUSES,
} from "../constants/adminUserManagement.constants";

interface Props {
  onPendingChange: (pending: boolean) => void;
}

export default function UserFilters({ onPendingChange }: Props) {
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
      <label htmlFor="user-search" className="sr-only">
        Search users
      </label>
      <input
        id="user-search"
        type="search"
        aria-label="Search by name or phone"
        placeholder="Search users name or phone..."
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(e) => handleSearch(e.target.value)}
        className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-slate-300"
      />

      {/* Role Filter */}
      <Select
        value={searchParams.get("role") || "all"}
        onValueChange={(val) => updateParam("role", val === "all" ? "" : val)}
      >
        <SelectTrigger className="w-[140px]" aria-label="Filter by role">
          <SelectValue placeholder="All Roles" />
        </SelectTrigger>
        <SelectContent className="max-w-[140px]">
          <SelectItem value="all">All Roles</SelectItem>
          <SelectSeparator />
          {USER_ROLES.map((role) => (
            <SelectItem key={role} value={role}>
              {role}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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
          {USER_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
