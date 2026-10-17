// BlogCategoryTabs.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const CATEGORIES = [
  "Tech Tips",
  "Repair Guides",
  "Product Updates",
  "Announcements",
  "General",
];

export default function BlogCategoryTabs({
  currentCategory,
}: {
  currentCategory?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // currentCategory না থাকলে কোনো ট্যাব active থাকবে না, কিন্তু সব blog (unfiltered) load হবে
  const active = currentCategory;

  const hrefFor = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    // একই category তে আবার click করলে filter clear হয়ে সব blog দেখাবে
    if (active === cat) params.delete("category");
    else params.set("category", cat);
    params.delete("page");
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  return (
    <nav className="flex flex-wrap gap-2 py-3" aria-label="Blog categories">
      {CATEGORIES.map((cat) => (
        <Link key={cat} href={hrefFor(cat)} scroll={false} prefetch>
          <Badge
            variant={active === cat ? "default" : "outline"}
            className={`cursor-pointer px-4 py-1.5 text-sm ${
              active === cat
                ? "bg-orange-600 hover:bg-orange-700"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {cat}
          </Badge>
        </Link>
      ))}
    </nav>
  );
}
