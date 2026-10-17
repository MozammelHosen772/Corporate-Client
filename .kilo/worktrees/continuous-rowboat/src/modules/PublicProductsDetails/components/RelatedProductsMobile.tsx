"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  mrpPrice: number;
  sellingPrice: number | null;
  productMedia: { url: string; fileType: string }[];
}

export default function RelatedProductsMobile({
  relatedProducts,
}: {
  relatedProducts: RelatedProduct[];
}) {
  const [visibleCount, setVisibleCount] = useState(8);
  const [loading, setLoading] = useState(false);

  if (relatedProducts.length === 0) return null;

  const visibleProducts = relatedProducts.slice(0, visibleCount);
  const hasMore = visibleCount < relatedProducts.length;

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 8);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="mt-4 xl:hidden">
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="border-b border-gray-100 px-4 py-3">
          <h2 className="flex items-center gap-2 text-[15px] font-bold text-gray-800">
            <span className="inline-block h-4 w-1 rounded-full bg-orange-800" />
            RELATED PRODUCTS
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-3">
          {visibleProducts.map((item) => {
            const imageUrl = item.productMedia?.find(
              (m) => m.fileType === "IMAGE",
            )?.url;
            const hasDiscount =
              item.sellingPrice != null && item.sellingPrice < item.mrpPrice;
            const displayPrice = item.sellingPrice ?? item.mrpPrice;

            return (
              <Link
                key={item.id}
                href={`/products/${item.slug}`}
                className="group overflow-hidden rounded-xl border border-gray-100 transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-square bg-gray-50">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                      <span className="text-[11px] text-gray-400">
                        No Image
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-0.5 p-2">
                  <p className="line-clamp-2 text-[12px] font-medium leading-snug text-gray-700 transition-colors group-hover:text-orange-700">
                    {item.name}
                  </p>

                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-bold text-orange-500">
                      ৳ {displayPrice.toLocaleString()}
                    </p>
                    {hasDiscount && (
                      <p className="text-[11px] text-gray-400 line-through">
                        ৳ {item.mrpPrice.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}

          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="overflow-hidden rounded-xl border border-gray-100"
              >
                <div className="aspect-square animate-pulse bg-gray-200" />
                <div className="space-y-2 p-2">
                  <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            ))}
        </div>

        {hasMore && !loading && (
          <div className="border-t border-gray-100 px-4 py-3">
            <button
              onClick={handleLoadMore}
              className="w-full rounded-lg border border-orange-500 py-2 text-[13px] font-semibold text-orange-500 transition-colors hover:bg-orange-500 hover:text-white"
            >
              Load More ({relatedProducts.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
