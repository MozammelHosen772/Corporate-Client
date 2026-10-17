"use client";

import { getShopProducts } from "@/services/products/products.service";
import { IPublicProduct } from "@/types/AdminProducts/AdminProducts.interface";
import { Loader2, PackageX } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ShopProductCard } from "./ShopProductCard";
import { TGridMode } from "./ShopToolbar";

interface Props {
  products: IPublicProduct[];
  meta: { total: number; page: number; limit: number; totalPages: number };
  gridMode?: TGridMode;
}

const GRID_CLASS: Record<TGridMode, string> = {
  "cols-2": "grid-cols-2",
  "cols-3": "grid-cols-2 sm:grid-cols-3",
  "cols-4": "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4",
  list: "grid-cols-1",
};

export default function ShopProductGrid({
  products: initialProducts,
  meta: initialMeta,
  gridMode = "cols-4",
}: Props) {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<IPublicProduct[]>(initialProducts);
  const [page, setPage] = useState(initialMeta.page);
  const [total, setTotal] = useState(initialMeta.total);
  const [loadingMore, setLoadingMore] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  const hasMore = products.length < total;

  useEffect(() => {
    if (!hasMore) return;

    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        const isVisible = entries[0]?.isIntersecting;
        if (!isVisible || loadingRef.current || !hasMore) return;

        loadingRef.current = true;
        setLoadingMore(true);

        try {
          const nextPage = page + 1;
          const brands =
            searchParams.get("brands")?.split(",").filter(Boolean) ?? [];
          const colors =
            searchParams.get("colors")?.split(",").filter(Boolean) ?? [];

          const result = await getShopProducts({
            page: nextPage,
            limit: initialMeta.limit,
            search: searchParams.get("search") || undefined,
            brandIds: brands.length ? brands : undefined,
            colors: colors.length ? colors : undefined,
            sortBy: searchParams.get("sortBy") || undefined,
            sortOrder:
              (searchParams.get("sortOrder") as "asc" | "desc") || undefined,
          });

          setProducts((prev) => [...prev, ...(result.data ?? [])]);
          setTotal(result.meta?.total ?? total);
          setPage(nextPage);
        } finally {
          setLoadingMore(false);
          loadingRef.current = false;
        }
      },
      { rootMargin: "300px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, page, initialMeta.limit, searchParams, total]);

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white py-16 text-center">
        <PackageX className="mb-3 h-9 w-9 text-gray-300" />
        <p className="text-sm font-medium text-gray-500">No products found</p>
        <p className="mt-1 text-xs text-gray-400">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div>
      <div className={`grid gap-3 ${GRID_CLASS[gridMode]}`}>
        {products.map((product) => (
          <ShopProductCard key={product.id} product={product} />
        ))}
      </div>

      {hasMore && (
        <div
          ref={sentinelRef}
          className="mt-8 flex items-center justify-center gap-2 py-4"
        >
          {loadingMore && (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
              <span className="text-xs font-medium text-gray-500">
                Loading more products...
              </span>
            </>
          )}
        </div>
      )}

      {!hasMore && products.length > initialMeta.limit && (
        <p className="mt-8 text-center text-xs text-gray-400">
          You ve reached the end — {products.length} of {total} products
        </p>
      )}
    </div>
  );
}
