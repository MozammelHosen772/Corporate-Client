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

function truncateName(name: string, maxWords = 8): string {
  const words = name.trim().split(/\s+/);
  if (words.length <= maxWords) return name;
  return words.slice(0, maxWords).join(" ") + "...";
}

const DEFAULT_SHOW = 8;

export default function RelatedProductsSidebar({
  relatedProducts,
}: {
  relatedProducts: RelatedProduct[];
}) {
  const [showAll, setShowAll] = useState(false);

  const visibleProducts = showAll
    ? relatedProducts
    : relatedProducts.slice(0, DEFAULT_SHOW);

  const hasMore = relatedProducts.length > DEFAULT_SHOW;

  return (
    <div className="hidden xl:block">
      <div className="sticky top-4 overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="border-b border-gray-100 px-4 py-3">
          <h2 className="flex items-center gap-2 text-[15px] font-bold text-gray-800">
            <span className="inline-block h-4 w-1 rounded-full bg-orange-800" />
            RELATED PRODUCTS
          </h2>
        </div>

        <div className="divide-y divide-gray-50">
          {relatedProducts.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-gray-400">
              No related products found
            </p>
          ) : (
            visibleProducts.map((item) => {
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
                  className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50"
                >
                  <div className="relative h-[64px] w-[64px] flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                        <span className="text-[10px] text-gray-400">
                          No Image
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-[13px] leading-[18px] text-gray-700 transition-colors group-hover:text-orange-700">
                      {truncateName(item.name, 8)}
                    </p>

                    <div className="mt-1 flex items-center gap-2">
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
            })
          )}
        </div>

        {hasMore && (
          <div className="border-t border-gray-100 px-4 py-3">
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="w-full rounded-lg border border-orange-500 py-2 text-[13px] font-semibold text-orange-500 transition-colors hover:bg-orange-500 hover:text-white"
            >
              {showAll
                ? "Show Less"
                : `See More (${relatedProducts.length - DEFAULT_SHOW})`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
