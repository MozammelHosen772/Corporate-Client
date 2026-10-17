"use client";

interface StockStatusProps {
  isAdminBlocked: boolean;
  isOutOfStock: boolean;
  stock: number;
  lowStockThreshold: number;
}

export function StockStatus({
  isAdminBlocked,
  isOutOfStock,
  stock,
  lowStockThreshold,
}: StockStatusProps) {
  return (
    <div className="mt-4 flex items-center gap-4">
      {isAdminBlocked ? (
        <p className="text-[14px] font-semibold text-gray-500">
          🚫 Currently not available for purchase
        </p>
      ) : isOutOfStock ? (
        <p className="text-[14px] font-semibold text-red-600">✕ Out of stock</p>
      ) : stock <= lowStockThreshold ? (
        <p className="text-[14px] font-semibold text-orange-600">
          ⚠️ Only {stock} items left in stock
        </p>
      ) : (
        <p className="text-[14px] font-semibold text-green-600">
          ✓ In Stock ({stock} units)
        </p>
      )}
    </div>
  );
}
