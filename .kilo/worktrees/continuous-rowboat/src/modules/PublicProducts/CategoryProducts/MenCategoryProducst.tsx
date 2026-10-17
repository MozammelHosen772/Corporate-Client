"use client";

import {
  ICategoryFilterOptions,
  ICategoryNodeInfo,
  ICategoryProduct,
  ICategoryProductMeta,
} from "@/services/products/category.service";
import { SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

import CategorySubNav from "./components/CategorySubNav";
import Pagination from "./components/Pagination";
import ProductCard from "./components/Productcard";
import { SidebarContent } from "./components/SidebarContent";
import { ProductCardSkeleton } from "./components/Skeleton";
import TopBar from "./components/Topbar";
import {
  DEFAULT_LIMIT,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_ORDER,
  SORT_OPTIONS,
} from "./constants/categoryProducts.constants.ts";

interface MenCategoryProductsProps {
  slug: string;
  initialProducts: ICategoryProduct[];
  initialMeta: ICategoryProductMeta;
  filterOptions: ICategoryFilterOptions; // ✅ নতুন
  categoryNode: ICategoryNodeInfo;
}

const parseListParam = (value: string | null): string[] =>
  value ? value.split(",").filter(Boolean) : [];

export default function MenCategoryProducts({
  slug,
  initialProducts,
  initialMeta,
  filterOptions,
  categoryNode,
}: MenCategoryProductsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const limit = Number(searchParams.get("limit") ?? DEFAULT_LIMIT);
  const sortBy = searchParams.get("sortBy") ?? DEFAULT_SORT_BY;
  const sortOrder = (searchParams.get("sortOrder") ?? DEFAULT_SORT_ORDER) as
    | "asc"
    | "desc";

  // ✅ multi-select filter states — সব URL থেকে derive করা
  const selectedBrands = parseListParam(searchParams.get("brandId"));
  const selectedColors = parseListParam(searchParams.get("color"));
  const selectedSizes = parseListParam(searchParams.get("size"));

  const currentSort =
    SORT_OPTIONS.find(
      (o) => o.sortBy === sortBy && o.sortOrder === sortOrder,
    ) ?? SORT_OPTIONS[0];

  const updateQuery = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => params.set(k, v));
    params.set("page", "1");
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  // ✅ checkbox toggle করলে array-তে add/remove করে URL আপডেট করে
  const handleToggleFilter = (
    type: "brandId" | "color" | "size",
    value: string,
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = parseListParam(params.get(type));
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    if (next.length) params.set(type, next.join(","));
    else params.delete(type);

    params.set("page", "1");
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const handleSortChange = (by: string, order: string) =>
    updateQuery({ sortBy: by, sortOrder: order });

  const handleLimitChange = (n: number) => updateQuery({ limit: String(n) });

  const handlePageChange = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const skeletonCount = limit || 12;

  return (
    <div className="min-h-screen bg-gray-50 -mt-2">
      <div className="max-w-[1400px] mx-auto px-1.5 py-6">
        <CategorySubNav categoryNode={categoryNode} />
        {/* Mobile top bar */}
        <div className="flex items-center justify-between mb-2 lg:hidden">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-800">
              {initialMeta.total}
            </span>{" "}
            Products
          </p>
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            <SlidersHorizontal size={15} />
            Filters
          </button>
        </div>

        {/* Mobile sidebar drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl p-5 overflow-y-auto z-50">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                  <SlidersHorizontal size={16} /> Filters
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-400 hover:text-gray-700 text-xl leading-none"
                >
                  ✕
                </button>
              </div>
              <SidebarContent
                currentSort={currentSort}
                limit={limit}
                onSortChange={handleSortChange}
                onLimitChange={handleLimitChange}
                filterOptions={filterOptions}
                selectedBrands={selectedBrands}
                selectedColors={selectedColors}
                selectedSizes={selectedSizes}
                onToggleFilter={handleToggleFilter}
              />
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-5 sticky top-24">
              <h2 className="font-bold text-gray-800 flex items-center gap-2 mb-5 text-sm">
                <SlidersHorizontal size={15} /> FILTERS
              </h2>
              <SidebarContent
                currentSort={currentSort}
                limit={limit}
                onSortChange={handleSortChange}
                onLimitChange={handleLimitChange}
                filterOptions={filterOptions}
                selectedBrands={selectedBrands}
                selectedColors={selectedColors}
                selectedSizes={selectedSizes}
                onToggleFilter={handleToggleFilter}
              />
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <TopBar total={initialMeta.total} />

            <div className="relative min-h-[200px]">
              {isPending && (
                <div className="absolute inset-0 z-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Array.from({ length: skeletonCount }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              )}

              <div
                className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-2 transition-opacity duration-150 ${
                  isPending ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
              >
                {initialProducts.length === 0 ? (
                  <div className="col-span-full bg-white rounded-xl shadow-sm py-24 flex flex-col items-center justify-center text-center">
                    <p className="text-4xl mb-3">🛍️</p>
                    <p className="text-gray-500 font-medium">
                      No products found in this category.
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Try adjusting the filters.
                    </p>
                  </div>
                ) : (
                  initialProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                )}
              </div>
            </div>

            <Pagination
              meta={initialMeta}
              page={initialMeta.page}
              onPageChange={handlePageChange}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
