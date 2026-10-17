"use client";

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
import { BLOG_CATEGORIES } from "../constants/blog.constants";

interface Props {
  onPendingChange: (pending: boolean) => void;
  onCreate: () => void;
}

export default function AdminBlogFilters({ onPendingChange, onCreate }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    onPendingChange(isPending);
  }, [isPending, onPendingChange]);

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
      router.replace(queryString ? `?${queryString}` : "?");
    });
  };

  const handleSearch = (value: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => updateParam("search", value), 400);
  };

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-2 md:p-4">
      {/* Left Side - Filters */}
      <div className="flex flex-1 flex-wrap items-center gap-3">
        <label htmlFor="blog-search" className="sr-only">
          Search
        </label>
        <input
          id="blog-search"
          type="search"
          placeholder="Search blogs..."
          defaultValue={searchParams.get("search") ?? ""}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-slate-300"
        />

        {/* Status */}
        <Select
          value={searchParams.get("status") || "all"}
          onValueChange={(val) =>
            updateParam("status", val === "all" ? "" : val)
          }
        >
          <SelectTrigger className="w-[150px]" aria-label="Filter by status">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent className="max-w-[150px]">
            <SelectItem value="all">All Status</SelectItem>
            <SelectSeparator />
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
          </SelectContent>
        </Select>

        {/* Category */}
        <Select
          value={searchParams.get("category") || "all"}
          onValueChange={(val) =>
            updateParam("category", val === "all" ? "" : val)
          }
        >
          <SelectTrigger className="w-[180px]" aria-label="Filter by category">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent className="max-w-[180px]">
            <SelectItem value="all">All Categories</SelectItem>
            <SelectSeparator />
            {BLOG_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Right Side - Create */}
      <button
        onClick={onCreate}
        className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
      >
        <Plus className="h-4 w-4" />
        New Blog
      </button>
    </div>
  );
}
