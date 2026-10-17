"use client";
import { Minus, Plus } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface QuantitySelectorProps {
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
  maxPurchaseQty: number;
  isPurchasable: boolean;
  maximumPurchaseQuantity?: number | null;
}

export function QuantitySelector({
  quantity,
  setQuantity,
  maxPurchaseQty,
  isPurchasable,
  maximumPurchaseQuantity,
}: QuantitySelectorProps) {
  return (
    <div className="mt-4">
      <h3 className="text-[13px] font-semibold mb-2 text-gray-700">
        Quantity
        {maximumPurchaseQuantity && (
          <span className="ml-2 text-xs font-normal text-gray-400">
            (max {maximumPurchaseQuantity} per order)
          </span>
        )}
      </h3>
      <div className="flex items-center gap-1.5 bg-gray-100  rounded-full px-1.5 py-1 w-fit ">
        <button
          onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
          disabled={quantity <= 1 || !isPurchasable}
          aria-label="Decrease quantity"
          className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center hover:from-orange-500 hover:to-orange-700 active:scale-95 transition-all duration-150 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed disabled:active:scale-100 text-white shadow-md shadow-orange-300/50"
        >
          <Minus className="w-3 h-3" strokeWidth={2.5} />
        </button>
        <span className="min-w-[32px] text-center text-[13px] font-bold text-black">
          {quantity}
        </span>
        <button
          onClick={() =>
            setQuantity((prev) => (prev < maxPurchaseQty ? prev + 1 : prev))
          }
          disabled={quantity >= maxPurchaseQty || !isPurchasable}
          aria-label="Increase quantity"
          className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center hover:from-orange-500 hover:to-orange-700 active:scale-95 transition-all duration-150 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed disabled:active:scale-100 text-white shadow-md shadow-orange-300/50"
        >
          <Plus className="w-3 h-3" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
