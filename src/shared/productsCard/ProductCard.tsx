"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Heart, ImageOff, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type StockLevel = "HIGH" | "MEDIUM" | "LOW" | "OUT";

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  mrpPrice: number;
  discountedPrice?: number;
  discountPercentage?: number;
  imageUrl?: string;
  stockLevel?: StockLevel;
  stock?: number;
  showStockOut: boolean;
  isWishlisted?: boolean;
  onAddToCart?: () => void;
  // ✅ optional — dile "Buy Now" ei function call korbe (checkout e navigate
  // korar jonno), na dile fallback hisebe onAddToCart call hobe ar button
  // label o "Add to Cart" dekhabe — tai label kokhonoi misleading hobe na
  onBuyNow?: () => void;
  onWishlist?: () => void;
  className?: string;
}
const stockConfig: Record<
  StockLevel,
  { label: string; bar: string; text: string; width: string }
> = {
  HIGH: {
    label: "HIGH",
    bar: "bg-blue-500",
    text: "text-blue-600",
    width: "w-[80%]",
  },
  MEDIUM: {
    label: "MEDIUM",
    bar: "bg-orange-400",
    text: "text-orange-500",
    width: "w-[50%]",
  },
  LOW: {
    label: "LOW",
    bar: "bg-red-500",
    text: "text-red-500",
    width: "w-[20%]",
  },
  OUT: {
    label: "OUT",
    bar: "bg-gray-300",
    text: "text-gray-400",
    width: "w-0",
  },
};

export function ProductCard({
  slug,
  name,
  mrpPrice,
  discountedPrice,
  discountPercentage,
  imageUrl,
  stockLevel,
  stock,
  showStockOut,
  isWishlisted = false,
  onAddToCart,
  onBuyNow,
  onWishlist,
  className,
}: ProductCardProps) {
  const displayPrice = discountedPrice ?? mrpPrice;
  const hasDiscount = !!discountedPrice && discountedPrice < mrpPrice;

  const resolvedDiscountPercentage =
    discountPercentage ??
    (hasDiscount
      ? Math.round(((mrpPrice - discountedPrice!) / mrpPrice) * 100)
      : undefined);

  const allStock = stockLevel ? stockConfig[stockLevel] : null;

  const isOut =
    stockLevel === "OUT" || (stock !== undefined && stock <= 0) || showStockOut;

  const isValidImage =
    imageUrl &&
    !imageUrl.match(/\.(pdf|mp4|mov|avi|mkv|webm)(\?.*)?$/i) &&
    !imageUrl.includes("/pdfs/") &&
    !imageUrl.includes("/videos/");

  // ✅ label ar handler ekjaigay thik kora — button-e ja lekha thakbe,
  // click korle thik shei kajta-i hobe
  const hasRealBuyNow = typeof onBuyNow === "function";
  const buttonLabel = isOut
    ? "Out of Stock"
    : hasRealBuyNow
      ? "Buy Now"
      : "Add to Cart";

  const handlePrimaryAction = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasRealBuyNow) {
      onBuyNow?.();
    } else {
      onAddToCart?.();
    }
  };

  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-lg border border-border bg-card overflow-hidden",
        "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-orange-200",
        className,
      )}
    >
      {/* Image */}
      <Link
        href={`/products/${slug}`}
        aria-label={`View ${name}`}
        className="block"
      >
        <div className="relative h-32 md:h-42 overflow-hidden bg-muted">
          {isValidImage ? (
            <Image
              src={imageUrl!}
              alt={name}
              fill
              sizes="(max-width: 640px) 70vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <ImageOff className="w-7 h-7" strokeWidth={1.5} />
              <span className="text-xs">No image</span>
            </div>
          )}

          {/* Discount ribbon */}
          {resolvedDiscountPercentage && resolvedDiscountPercentage > 0 && (
            <div className="absolute -left-6 top-2 w-20 -rotate-45 bg-orange-500 py-0.5 text-center text-[8px] font-bold text-white shadow-sm md:-left-8 md:top-3 md:w-28 md:text-[10px]">
              {resolvedDiscountPercentage}% OFF
            </div>
          )}

          {/* ✅ FIX: isWishlisted onujayi heart filled/red thakbe, ar
              already-wishlisted obosthay hover chara-o (opacity-100) dekhabe
              — nahole user bujhte parbe na product ta wishlist e ache */}
          <button
            onClick={(e) => {
              e.preventDefault();
              onWishlist?.();
            }}
            aria-label={
              isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
            aria-pressed={isWishlisted}
            className={cn(
              "absolute top-2 right-2 w-7 h-7 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-200",
              isWishlisted
                ? "bg-white text-red-500 opacity-100"
                : "bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white opacity-0 group-hover:opacity-100",
            )}
          >
            <Heart
              className="w-3.5 h-3.5"
              fill={isWishlisted ? "currentColor" : "none"}
            />
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-col gap-2 p-2 md:p-3 flex-1">
        {/* Name */}
        <Link href={`/products/${slug}`}>
          <h3 className="text-[13px] md:text-sm font-medium leading-snug text-foreground line-clamp-2 min-h-[36px] md:min-h-[40px] hover:text-orange-600 transition-colors">
            {name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-base md:text-lg font-semibold text-orange-500 font-mono">
            ৳{displayPrice.toLocaleString("en-BD")}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through font-mono">
              ৳{mrpPrice.toLocaleString("en-BD")}
            </span>
          )}
        </div>

        {/* Stock Level */}
        {allStock && (
          <div className="flex flex-col gap-1">
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  allStock.bar,
                  allStock.width,
                )}
              />
            </div>
            <p className="text-[9px] md:text-[10px] font-semibold tracking-wide uppercase text-muted-foreground">
              Stock level:{" "}
              <span className={cn("font-bold", allStock.text)}>
                {allStock.label}
              </span>
              {stock !== undefined && (
                <span className="text-muted-foreground font-normal ml-1">
                  ({stock} items)
                </span>
              )}
            </p>
          </div>
        )}

        <Separator className="my-0.5" />

        {/* Primary Action Button */}
        <Button
          size="sm"
          disabled={isOut}
          className={cn(
            "w-full h-9 text-xs font-bold rounded-lg gap-1.5 transition-all duration-200",
            isOut
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 active:scale-[0.98] text-white shadow-sm hover:shadow-orange-200 hover:shadow-md",
          )}
          onClick={handlePrimaryAction}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {buttonLabel}
        </Button>
      </div>
    </article>
  );
}
