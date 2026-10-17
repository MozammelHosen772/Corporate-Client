"use client";

import { Barcode, ChevronRight, Search, Tag, Truck, Video } from "lucide-react";
import { useRouter } from "next/navigation";

interface MoreItem {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
}

export default function MoreTab({ productId }: { productId: string }) {
  const router = useRouter();

  const items: MoreItem[] = [
    {
      id: "barcode",
      label: "Barcode",
      description: "Manage barcode for this product",
      icon: <Barcode className="h-5 w-5" />,
      href: `/admin/dashboard/products/${productId}/barcode`,
    },
    {
      id: "offer",
      label: "Offer",
      description: "Set promotional offers and discounts",
      icon: <Tag className="h-5 w-5" />,
      href: `/admin/dashboard/products/${productId}/offer`,
    },
    {
      id: "video",
      label: "Video",
      description: "Add product demo videos",
      icon: <Video className="h-5 w-5" />,
      href: `/admin/dashboard/products/${productId}/video`,
    },
    {
      id: "shipping",
      label: "Shipping & Return",
      description: "Configure shipping rules and return policy",
      icon: <Truck className="h-5 w-5" />,
      href: `/admin/dashboard/products/${productId}/shipping`,
    },
    {
      id: "seo",
      label: "SEO",
      description: "Meta title, description, keywords",
      icon: <Search className="h-5 w-5" />,
      href: `/admin/dashboard/products/${productId}/seo`,
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-700">More Options</h2>
      </div>
      <div className="divide-y divide-slate-100">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => item.href && router.push(item.href)}
            className="w-full px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors text-left"
          >
            <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
              {item.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800">{item.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {item.description}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-300 flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
