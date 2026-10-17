"use client";

import { useWhitelist, WhitelistItem } from "@/contexts/WhitelistContext";
import { ShieldCheck, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function WhitelistDropdown({
  onClose,
}: {
  onClose: () => void;
}) {
  const { items, removeFromWhitelist } = useWhitelist();

  const handleRemove = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromWhitelist(productId);
  };

  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-full w-[320px] z-50 pt-3">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-gray-800 font-semibold text-base">Whitelist</p>
          <p className="text-gray-500 text-xs mt-0.5">
            {items.length === 0
              ? "No products in whitelist"
              : `${items.length} product${items.length > 1 ? "s" : ""} saved`}
          </p>
        </div>

        <div className="max-h-[300px] overflow-y-auto">
          {items.length === 0 && (
            <div className="px-5 py-8 text-center">
              <ShieldCheck className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                Browse products and add them to your whitelist
              </p>
            </div>
          )}

          {items.map((item: WhitelistItem) => (
            <Link
              key={item.id}
              href={`/products/${item.slug}`}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors"
            >
              <div className="relative w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {item.name}
                </p>
                <p className="text-xs text-green-600 font-semibold">
                  ৳ {item.price.toLocaleString()}
                </p>
              </div>
              <button
                onClick={(e) => handleRemove(e, item.id)}
                aria-label={`Remove ${item.name} from whitelist`}
                className="p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </Link>
          ))}
        </div>

        {items.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
            <Link href="/whitelist" onClick={onClose}>
              <button className="w-full py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-medium hover:from-orange-600 hover:to-red-600 active:scale-[0.98] transition-all duration-200 shadow-sm shadow-orange-200">
                View Full Whitelist
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
