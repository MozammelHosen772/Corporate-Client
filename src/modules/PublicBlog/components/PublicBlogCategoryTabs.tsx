"use client";

import { Badge } from "@/components/ui/badge";
import { BLOG_CATEGORIES } from "@/modules/AdminDashboard/AdminBlog/constants/blog.constants";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function PublicBlogCategoryTabs({
  currentCategory,
}: {
  currentCategory?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = currentCategory;

  const hrefFor = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (active === cat) params.delete("category");
    else params.set("category", cat);
    params.delete("page");
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  return (
    <nav className="flex flex-wrap gap-2 py-3" aria-label="Blog categories">
      {BLOG_CATEGORIES.map((cat) => (
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
