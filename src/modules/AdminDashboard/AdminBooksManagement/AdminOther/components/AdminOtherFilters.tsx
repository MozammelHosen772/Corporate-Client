"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useTransition } from "react";

interface Props {
  onPendingChange: (pending: boolean) => void;
  onCreate: () => void;
}

export default function AdminOtherFilters({
  onPendingChange,
  onCreate,
}: Props) {
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
      <label htmlFor="other-search" className="sr-only">
        Search Others
      </label>
      <Input
        id="Other-search"
        type="search"
        aria-label="Search by title"
        placeholder="Search Others by title..."
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(e) => handleSearch(e.target.value)}
        className="flex-1 "
      />

      {/* Publish Filter */}
      <Select
        value={searchParams.get("publish") || "all"}
        onValueChange={(val) =>
          updateParam("publish", val === "all" ? "" : val)
        }
      >
        <SelectTrigger
          className="w-[150px]"
          aria-label="Filter by publish status"
        >
          <SelectValue placeholder="All Others" />
        </SelectTrigger>
        <SelectContent className="max-w-[150px]">
          <SelectItem value="all">All Others</SelectItem>
          <SelectSeparator />
          <SelectItem value="true">Published</SelectItem>
          <SelectItem value="false">Unpublished</SelectItem>
        </SelectContent>
      </Select>

      <button
        onClick={onCreate}
        className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Add Other
      </button>
    </div>
  );
}
