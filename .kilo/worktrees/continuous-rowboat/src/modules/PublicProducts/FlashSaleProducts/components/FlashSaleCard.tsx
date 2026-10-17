"use client";

import { useWhitelist } from "@/contexts/WhitelistContext";
import { useCart } from "@/hooks/useCart";
import { IPublicFlashSaleProduct } from "@/services/products/flashSaleProducts.service";
import { ProductCard, StockLevel } from "@/shared/productsCard/ProductCard";
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
  media: { url: string; fileType?: string; isMain?: boolean }[] | undefined,
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

export function FlashSaleCard({ item }: { item: IPublicFlashSaleProduct }) {
  const router = useRouter();
  const { addToCart, cartItems } = useCart();
  const { isInWhitelist, toggleWhitelist } = useWhitelist();

  const product = item.product;
  const stockLevel = getStockLevel(product.stock);

  const hasDiscount =
    product.sellingPrice != null && product.sellingPrice < product.mrpPrice;

  const displayPrice = hasDiscount ? product.sellingPrice! : product.mrpPrice;
  const imageUrl = resolveCardImage(product.productMedia);
  const isWishlisted = isInWhitelist(product.id);

  // ✅ NEW: product-e kono variation (color/size) ache kina check —
  // ekhan theke e thik hobe grid theke direct checkout jabe naki
  // details page e pathabe
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
    // ✅ variation thakle grid theke add-to-cart-o allow kora thik na,
    // karon color/size na select kore vul variant cart e cholte jete pare —
    // tai eikhaneo details page e pathiye dicchi
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

  // ✅ FIX: variation thakle -> details page (okhane select kore
  // "Buy Now" korle checkout e jabe). Variation na thakle -> directly
  // cart e add (age theke na thakle) kore checkout e.
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
    <div className="flex-shrink-0 w-[185px] md:w-[225px]">
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
    </div>
  );
}
