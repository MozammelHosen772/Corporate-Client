"use client";

import { useWhitelist } from "@/contexts/WhitelistContext";
import { useCart } from "@/hooks/useCart";
import { ProductCard, StockLevel } from "@/shared/productsCard/ProductCard";
import { IPublicProduct } from "@/types/AdminProducts/AdminProducts.interface";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";

function getStockLevel(stock: number | undefined): StockLevel {
  if (stock === undefined || stock <= 0) return "OUT";
  if (stock <= 10) return "LOW";
  if (stock <= 50) return "MEDIUM";
  return "HIGH";
}

function resolveCardImage(
  media:
    | { url: string; fileType?: string; isMain?: boolean }[]
    | null
    | undefined,
) {
  if (!media?.length) return undefined;
  return (
    media.find(
      (m) => m.isMain && m.fileType !== "PDF" && m.fileType !== "VIDEO",
    )?.url ??
    media.find((m) => m.fileType !== "PDF" && m.fileType !== "VIDEO")?.url ??
    media[0]?.url
  );
}

export function ShopProductCard({ product }: { product: IPublicProduct }) {
  const router = useRouter();
  const { addToCart, cartItems } = useCart();
  const { isInWhitelist, toggleWhitelist } = useWhitelist();

  const stockLevel = getStockLevel(product.stock);

  const hasDiscount =
    product.sellingPrice != null && product.sellingPrice < product.mrpPrice;

  const displayPrice = hasDiscount ? product.sellingPrice! : product.mrpPrice;
  const imageUrl = resolveCardImage(product.productMedia);
  const isWishlisted = isInWhitelist(product.id);

  const hasVariations = (product.variations?.length ?? 0) > 0;

  const isAlreadyInCart = useMemo(
    () =>
      cartItems?.some(
        (ci) =>
          ci.id === product.id &&
          ci.selectedColor === "" &&
          ci.selectedSize === "",
      ),
    [cartItems, product.id],
  );

  const addCurrentItemToCart = () => {
    addToCart({
      id: product.id,
      slug: product.slug,
      title: product.name,
      shortTitle: product.name,
      image: imageUrl ?? "",
      price: displayPrice,
      oldPrice: hasDiscount ? product.mrpPrice : undefined,
      discount: hasDiscount
        ? String(
            Math.round(
              ((product.mrpPrice - product.sellingPrice!) / product.mrpPrice) *
                100,
            ),
          )
        : "0",
      quantity: 1,
      maxPurchaseQty: product.stock ?? 1,
      selectedColor: "",
      selectedSize: "",
      sku: product.id,
      stock: product.stock ?? 0,
      shippingType: "flat_rate",
      shippingCost: 0,
      isQuantityMultiply: false,
    });
  };

  const handleAddToCart = () => {
    if (hasVariations) {
      router.push(`/products/${product.slug}`);
      return;
    }

    if (isAlreadyInCart) {
      toast.error(`${product.name} already added`);
      return;
    }
    addCurrentItemToCart();
    toast.success(`${product.name} added to cart`);
  };

  const handleBuyNow = () => {
    if (hasVariations) {
      router.push(`/products/${product.slug}`);
      return;
    }

    if (!isAlreadyInCart) {
      addCurrentItemToCart();
      toast.success(`${product.name} added to cart`);
    }
    router.push("/checkout");
  };

  const handleWishlist = () => {
    toggleWhitelist({
      id: product.id,
      name: product.name,
      slug: product.slug,
      image: imageUrl ?? "",
      price: displayPrice,
    });
    toast.success(
      isWishlisted
        ? `${product.name} removed from whitelist`
        : `${product.name} added to whitelist`,
    );
  };

  return (
    <ProductCard
      id={product.id}
      slug={product.slug}
      name={product.name}
      mrpPrice={product.mrpPrice}
      discountedPrice={hasDiscount ? product.sellingPrice! : undefined}
      imageUrl={imageUrl}
      stockLevel={stockLevel}
      stock={product.stock}
      showStockOut={product.showStockOut}
      isWishlisted={isWishlisted}
      onAddToCart={handleAddToCart}
      onBuyNow={handleBuyNow}
      onWishlist={handleWishlist}
    />
  );
}
