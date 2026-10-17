"use client";

interface ProductPriceBlockProps {
  currentPrice: number;
  mrpPrice: number;
  sellingPrice: number | null;
  hasDiscount: boolean;
  discountPercentage: number;
}

export function ProductPriceBlock({
  currentPrice,
  mrpPrice,
  sellingPrice,
  hasDiscount,
  discountPercentage,
}: ProductPriceBlockProps) {
  return (
    <div className="mt-4 border-b border-gray-200 pb-4">
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="text-[28px] md:text-[36px] font-bold text-orange-600">
          ৳ {currentPrice.toLocaleString()}
        </h2>
        {hasDiscount && (
          <p className="line-through text-gray-400 text-lg">
            ৳ {mrpPrice.toLocaleString()}
          </p>
        )}
        {hasDiscount && (
          <span className="rounded-md bg-red-50 px-2 py-0.5 text-sm font-bold text-red-600">
            {discountPercentage}% OFF
          </span>
        )}
      </div>
      {hasDiscount && (
        <p className="text-green-600 text-[13px] font-semibold mt-1">
          You save ৳ {(mrpPrice - (sellingPrice ?? 0)).toLocaleString()}
        </p>
      )}
    </div>
  );
}
