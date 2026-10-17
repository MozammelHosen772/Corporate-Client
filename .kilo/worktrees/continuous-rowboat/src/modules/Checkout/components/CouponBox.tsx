"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TValidateCouponResult } from "@/services/coupon/coupon.service";
import { Loader2, X } from "lucide-react";
import { memo, useCallback } from "react";

interface CouponBoxProps {
  couponCode: string;
  setCouponCode: (v: string) => void;
  isApplyingCoupon: boolean;
  appliedCoupon: TValidateCouponResult | null;
  isCouponBelowMinimum: boolean;
  couponDiscount: number;
  subtotal: number;
  onApply: () => void;
  onRemove: () => void;
}

function CouponBox({
  couponCode,
  setCouponCode,
  isApplyingCoupon,
  appliedCoupon,
  isCouponBelowMinimum,
  couponDiscount,
  subtotal,
  onApply,
  onRemove,
}: CouponBoxProps) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onApply();
      }
    },
    [onApply],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCouponCode(e.target.value.toUpperCase());
    },
    [setCouponCode],
  );

  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">
        Have a Coupon?
      </Label>

      {!appliedCoupon && (
        <div className="flex gap-2">
          <Input
            type="text"
            value={couponCode}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Promo / Coupon Code"
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={onApply}
            disabled={isApplyingCoupon}
            className="shrink-0"
          >
            {isApplyingCoupon ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Apply"
            )}
          </Button>
        </div>
      )}

      {appliedCoupon && isCouponBelowMinimum && (
        <div className="flex items-center justify-between gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2">
          <div className="flex items-center gap-2 text-sm">
            <Badge className="bg-amber-100 text-amber-700 border border-amber-200 font-mono">
              {appliedCoupon.code}
            </Badge>
            <span className="text-amber-700 text-xs font-medium">
              Paused — add ৳
              {(appliedCoupon.minOrderAmount - subtotal).toLocaleString()} more
              to re-activate
            </span>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="text-muted-foreground hover:text-red-500 transition-colors"
            aria-label="Remove coupon"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {appliedCoupon && !isCouponBelowMinimum && (
        <div className="flex items-center justify-between gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2">
          <div className="flex items-center gap-2 text-sm">
            <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200 font-mono">
              {appliedCoupon.code}
            </Badge>
            <span className="text-emerald-700 text-xs font-medium">
              {appliedCoupon.freeDelivery
                ? "Free delivery applied"
                : `৳${couponDiscount.toLocaleString()} off applied`}
            </span>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="text-muted-foreground hover:text-red-500 transition-colors"
            aria-label="Remove coupon"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default memo(CouponBox);
