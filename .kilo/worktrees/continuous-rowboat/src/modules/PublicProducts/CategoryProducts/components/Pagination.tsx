"use client";

import { ICategoryProductMeta } from "@/services/products/category.service";

interface PaginationProps {
  meta: ICategoryProductMeta;
  page: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  meta,
  page,
  onPageChange,
}: PaginationProps) {
  if (meta.totalPages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center gap-1.5 flex-wrap">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        ← Prev
      </button>

      {Array.from({ length: meta.totalPages }).map((_, i) => {
        const p = i + 1;
        const isActive = p === page;
        const isNear =
          Math.abs(p - page) <= 2 || p === 1 || p === meta.totalPages;

        if (!isNear) {
          if (p === 2 || p === meta.totalPages - 1) {
            return (
              <span key={p} className="text-gray-400 px-1">
                …
              </span>
            );
          }
          return null;
        }

        return (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 rounded-lg text-sm font-medium border transition-colors ${
              isActive
                ? "bg-blue-700 text-white border-blue-700"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {p}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(Math.min(meta.totalPages, page + 1))}
        disabled={page >= meta.totalPages}
        className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        Next →
      </button>
    </div>
  );
}
