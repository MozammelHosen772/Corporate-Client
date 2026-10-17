"use client";

import { ShoppingCart } from "lucide-react";

interface ActionButtonsProps {
  onAddToCart: () => void;
  onBuyNow: () => void;
  isPurchasable: boolean;
  purchaseButtonLabel: string | null;
}

export function ActionButtons({
  onAddToCart,
  onBuyNow,
  isPurchasable,
  purchaseButtonLabel,
}: ActionButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 md:gap-4 mt-6">
      <button
        onClick={onAddToCart}
        disabled={!isPurchasable}
        className="h-[42px] md:h-[50px] rounded-lg border-1 border-orange-500 text-orange-600 text-[13px] md:text-[15px] font-semibold flex items-center justify-center gap-1.5 hover:bg-orange-500 hover:text-white active:scale-[0.98] transition-all duration-300 disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed"
      >
        <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
        {purchaseButtonLabel ?? "Add To Cart"}
      </button>
      <button
        onClick={onBuyNow}
        disabled={!isPurchasable}
        className="h-[42px] md:h-[50px] rounded-lg text-[13px] md:text-[15px] font-semibold transition-all duration-300 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 active:scale-[0.98] text-white shadow-sm shadow-orange-300/50 hover:shadow-md hover:shadow-orange-300/60"
      >
        {purchaseButtonLabel ?? "Buy Now"}
      </button>
    </div>
  );
}
