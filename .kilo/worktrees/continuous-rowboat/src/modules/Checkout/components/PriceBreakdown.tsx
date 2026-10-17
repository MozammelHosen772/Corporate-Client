"use client";

import { Separator } from "@/components/ui/separator";
import { TValidateCouponResult } from "@/services/coupon/coupon.service";
import { Tag, Truck } from "lucide-react";
import { memo } from "react";

interface PriceBreakdownProps {
  subtotal: number;
  totalQuantity: number;
  effectiveCoupon: TValidateCouponResult | null;
  couponDiscount: number;
  finalDelivery: number;
  hasMixedShipping: boolean;
  freeItemCount: number;
  paidItemCount: number;
  total: number;
}

function PriceBreakdown({
  subtotal,
  totalQuantity,
  effectiveCoupon,
  couponDiscount,
  finalDelivery,
  hasMixedShipping,
  freeItemCount,
  paidItemCount,
  total,
}: PriceBreakdownProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-800">Order Summary</h3>

      <div className="space-y-2.5 text-sm">
        {/* Product Price */}
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">
            Product Price{" "}
            <span className="text-xs text-gray-400">
              ({totalQuantity} items)
            </span>
          </span>
          <span className="font-medium text-gray-800">
            ৳{subtotal.toLocaleString()}
          </span>
        </div>

        {/* Delivery Charge */}
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" />
            Delivery Charge
          </span>
          <span className="font-medium text-gray-800">
            {finalDelivery === 0 ? (
              <span className="text-emerald-600">
                {effectiveCoupon?.freeDelivery ? "Free (Coupon)" : "Free"}
              </span>
            ) : (
              `৳${finalDelivery.toLocaleString()}`
            )}
          </span>
        </div>

        {/* Discount */}
        {effectiveCoupon &&
          !effectiveCoupon.freeDelivery &&
          couponDiscount > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-emerald-600 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                Discount ({effectiveCoupon.code})
              </span>
              <span className="font-medium text-emerald-600">
                -৳{couponDiscount.toLocaleString()}
              </span>
            </div>
          )}

        {hasMixedShipping && !effectiveCoupon?.freeDelivery && (
          <p className="text-xs text-muted-foreground bg-blue-50 border border-blue-100 rounded-md px-2.5 py-1.5">
            {freeItemCount} item{freeItemCount > 1 ? "s" : ""} qualify for free
            delivery, {paidItemCount} item{paidItemCount > 1 ? "s" : ""} has a
            delivery charge.
          </p>
        )}
      </div>

      <Separator />

      {/* Total Payment */}
      <div className="flex items-center justify-between pt-0.5">
        <span className="text-[15px] font-bold text-gray-900">
          Total Payment
        </span>
        <span className="text-[19px] font-extrabold text-[#0f3ea9]">
          ৳{total.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

export default memo(PriceBreakdown);
