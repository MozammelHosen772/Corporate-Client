"use client";

import {
  ISearchProduct,
  searchProducts,
} from "@/services/products/searchProducts.service";
import { Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useTransition } from "react";

// ─── Helper ───────────────────────────────────────────────────────────────────

function getFirstImageUrl(media: { url: string }[]): string | undefined {
  return media.find(
    (m) => !m.url.includes("/pdfs/") && !m.url.includes("/videos/"),
  )?.url;
}

function getDisplayPrice(product: ISearchProduct): number {
  return product.sellingPrice ?? product.mrpPrice ?? 0;
}

// ─── Dropdown ─────────────────────────────────────────────────────────────────

function SearchDropdown({
  loading,
  results,
  searchQuery,
  onClose,
}: {
  loading: boolean;
  results: ISearchProduct[];
  searchQuery: string;
  onClose: () => void;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-xl max-h-[400px] overflow-y-auto">
      {loading && (
        <div className="px-4 py-3 text-sm text-gray-400 flex items-center gap-2">
          <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-orange-300 border-t-orange-500 animate-spin" />
          Searching...
        </div>
      )}

      {!loading && results.length === 0 && (
        <div className="px-4 py-6 text-sm text-gray-400 text-center">
          No products found for &quot;{searchQuery}&quot;
        </div>
      )}

      {!loading &&
        results.map((product) => {
          const imageUrl = getFirstImageUrl(product.productMedia);
          const displayPrice = getDisplayPrice(product);
          return (
            <Link
              href={`/products/${product.slug}`}
              key={product.id}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 border-b border-gray-50 last:border-0 transition-colors"
            >
              {imageUrl ? (
                <div className="w-11 h-11 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    width={44}
                    height={44}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-11 h-11 rounded-lg bg-gray-100 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {product.name}
                </p>
                <p className="text-xs text-orange-500 font-semibold mt-0.5">
                  ৳ {displayPrice.toLocaleString()}
                </p>
              </div>
            </Link>
          );
        })}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ProductSearchProps {
  variant?: "desktop" | "mobile";
}

export default function ProductSearch({
  variant = "desktop",
}: ProductSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [results, setResults] = useState<ISearchProduct[]>([]);
  const [isPending, startTransition] = useTransition();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const showDropdown = searchOpen && searchQuery.length >= 2;

  const closeSearch = () => {
    setSearchQuery("");
    setSearchOpen(false);
    setMobileExpanded(false);
    setResults([]);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (value.trim().length < 2) {
      setResults([]);
      return;
    }
    timerRef.current = setTimeout(() => {
      startTransition(async () => {
        try {
          const data = await searchProducts(value);
          setResults(data);
        } catch {
          setResults([]);
        }
      });
    }, 300);
  };

  const inputClass =
    "w-full pl-9 pr-9 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full outline-none focus:bg-white focus:border-orange-300 focus:ring-2 focus:ring-orange-100 transition-all duration-200";

  // ── Mobile ──────────────────────────────────────────────────────────────────
  if (variant === "mobile") {
    return (
      <>
        {!mobileExpanded && (
          <div className="relative flex items-center w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              placeholder="Search products..."
              value=""
              onChange={() => {}}
              onFocus={() => setMobileExpanded(true)}
              className={inputClass + " cursor-pointer"}
            />
          </div>
        )}

        {mobileExpanded && (
          <>
            {/* ✅ z-40 — dropdown (z-[60]) এর নিচে */}
            <div className="fixed inset-0 z-40" onPointerDown={closeSearch} />

            <div className="fixed top-[57px] left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-lg px-3 py-2.5">
              <div className="relative flex items-center">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />

                <input
                  ref={searchRef}
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => setTimeout(() => setSearchOpen(false), 300)}
                  autoFocus
                  className={inputClass}
                />

                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    if (searchQuery) setSearchQuery("");
                    else closeSearch();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* ✅ z-[60] — overlay (z-40) এর উপরে */}
                {showDropdown && (
                  <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-[60]">
                    <SearchDropdown
                      loading={isPending}
                      results={results}
                      searchQuery={searchQuery}
                      onClose={() => {
                        searchRef.current?.blur();
                        closeSearch();
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  // ── Desktop ─────────────────────────────────────────────────────────────────
  return (
    <div className="relative flex items-center w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />

      <input
        ref={searchRef}
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => setSearchOpen(true)}
        onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
        className={inputClass}
      />

      {searchQuery && (
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            closeSearch();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {/* ✅ z-50 */}
      {showDropdown && (
        <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-50">
          <SearchDropdown
            loading={isPending}
            results={results}
            searchQuery={searchQuery}
            onClose={closeSearch}
          />
        </div>
      )}
    </div>
  );
}
