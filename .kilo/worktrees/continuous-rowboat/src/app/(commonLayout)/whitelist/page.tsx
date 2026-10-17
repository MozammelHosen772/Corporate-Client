"use client";

import { useWhitelist } from "@/contexts/WhitelistContext";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function WhitelistPage() {
  const { items, removeFromWhitelist, clearWhitelist } = useWhitelist();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-5">
            <Heart className="w-9 h-9 text-orange-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Your Whitelist is Empty
          </h1>
          <p className="text-gray-500 mb-6">
            Browse products and add your favorites to see them here
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium hover:from-orange-600 hover:to-red-600 active:scale-[0.98] transition-all shadow-sm shadow-orange-200"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-sm shadow-orange-200">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                My Whitelist
              </h1>
              <p className="text-sm text-gray-500">
                {items.length} product{items.length > 1 ? "s" : ""} saved
              </p>
            </div>
          </div>
          <button
            onClick={clearWhitelist}
            className="px-4 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 active:scale-[0.98] transition-all"
          >
            Clear All
          </button>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <Link href={`/products/${item.slug}`} className="block">
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  )}

                  {/* remove icon - top right, floats over image */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeFromWhitelist(item.id);
                    }}
                    aria-label={`Remove ${item.name} from whitelist`}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 sm:p-4">
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1.5 min-h-[2.5rem]">
                    {item.name}
                  </h3>
                  <p className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent font-bold text-base">
                    ৳ {item.price.toLocaleString()}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
