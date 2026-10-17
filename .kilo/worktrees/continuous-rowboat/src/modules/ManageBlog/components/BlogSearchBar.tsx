"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BlogSearchBar({
  currentSearch,
}: {
  currentSearch?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(currentSearch ?? "");
  // আগের currentSearch ট্র্যাক করি যাতে render-এর সময়েই বুঝতে পারি prop পাল্টেছে কিনা
  const [prevSearch, setPrevSearch] = useState(currentSearch ?? "");

  // effect না, render-time adjustment — React এর recommended pattern
  if ((currentSearch ?? "") !== prevSearch) {
    setPrevSearch(currentSearch ?? "");
    setValue(currentSearch ?? "");
  }

  useEffect(() => {
    if (value === (currentSearch ?? "")) return;

    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set("search", value);
      else params.delete("search");
      params.delete("page");

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input
        placeholder="Search articles..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-12 rounded-full pl-10 shadow-sm"
      />
    </div>
  );
}
