"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function BlogPublicPagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const hrefFor = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `${pathname}?${params.toString()}`;
  };

  const handleNav = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // সব page number দেখানো (দরকার হলে পরে ellipsis logic যোগ করা যাবে)
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-14 flex items-center justify-center gap-6 text-sm font-medium text-slate-600">
      {currentPage > 1 ? (
        <Link
          href={hrefFor(currentPage - 1)}
          scroll={false}
          onClick={handleNav}
          className="flex items-center gap-1 transition-colors hover:text-orange-500"
        >
          <span aria-hidden>←</span> Previous
        </Link>
      ) : (
        <span className="flex items-center gap-1 text-slate-300">
          <span aria-hidden>←</span> Previous
        </span>
      )}

      <div className="flex items-center gap-2">
        {pages.map((p) =>
          p === currentPage ? (
            <span
              key={p}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-semibold text-white"
            >
              {p}
            </span>
          ) : (
            <Link
              key={p}
              href={hrefFor(p)}
              scroll={false}
              onClick={handleNav}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-sm text-slate-600 transition-colors hover:border-orange-300 hover:text-orange-500"
            >
              {p}
            </Link>
          ),
        )}
      </div>

      {currentPage < totalPages ? (
        <Link
          href={hrefFor(currentPage + 1)}
          scroll={false}
          onClick={handleNav}
          className="flex items-center gap-1 transition-colors hover:text-orange-500"
        >
          Next <span aria-hidden>→</span>
        </Link>
      ) : (
        <span className="flex items-center gap-1 text-slate-300">
          Next <span aria-hidden>→</span>
        </span>
      )}
    </div>
  );
}
