"use client";

import { Package, RotateCcw, ShieldCheck, Truck } from "lucide-react";

interface DeliveryInfoGridProps {
  shippingType?: string;
  shippingCost?: number;
  refundable: boolean;
  warranty?: string | null;
  tags?: string[] | null;
}

export function DeliveryInfoGrid({
  shippingType,
  shippingCost,
  refundable,
  warranty,
  tags,
}: DeliveryInfoGridProps) {
  return (
    <div className="mt-6 p-2 md:p-3 rounded-lg border ">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
            <Truck className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <p className="text-[12px] text-gray-500">Delivery</p>
            <p className="text-[13px] font-semibold text-gray-800">
              {shippingType === "free"
                ? "Free Delivery"
                : `৳${shippingCost ?? 0}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
            <RotateCcw className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <p className="text-[12px] text-gray-500">Returns</p>
            <p className="text-[13px] font-semibold text-gray-800">
              {refundable ? "7 Days Easy Return" : "Non-refundable"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <p className="text-[12px] text-gray-500">Warranty</p>
            <p className="text-[13px] font-semibold text-gray-800">
              {warranty || "No Warranty"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
            <Package className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <p className="text-[12px] text-gray-500">Tags</p>
            <p className="text-[13px] font-semibold text-gray-800">
              {tags?.join(", ") || "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
