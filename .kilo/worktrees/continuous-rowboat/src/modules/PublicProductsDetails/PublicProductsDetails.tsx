/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useWhitelist } from "@/contexts/WhitelistContext";
import { useCart } from "@/hooks/useCart";
import { IPublicProduct } from "@/types/AdminProducts/AdminProducts.interface";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { ActionButtons } from "./components/Actionbuttons";
import { DeliveryInfoGrid } from "./components/Deliveryinfogrid";
import { ProductGallery } from "./components/Productgallery";
import { ProductHeader } from "./components/Productheader";
import { ProductMeta } from "./components/Productmeta";
import { ProductPriceBlock } from "./components/Productpriceblock";
import { ProductTabs } from "./components/Producttabs";
import { QuantitySelector } from "./components/Quantityselector";
import RelatedProductsMobile from "./components/RelatedProductsMobile";
import RelatedProductsSidebar from "./components/RelatedProductsSidebar";
import { StockStatus } from "./components/Stockstatus";
import { VariantSelectors } from "./components/Variantselectors";

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  mrpPrice: number;
  sellingPrice: number | null;
  productMedia: { url: string; fileType: string }[];
}

export default function PublicProductDetails({
  product,
  relatedProducts = [],
  isFlashSaleActive,
  isOfferActive,
}: {
  product: IPublicProduct;
  relatedProducts?: RelatedProduct[];
  isFlashSaleActive: boolean;
  isOfferActive: boolean;
}) {
  const resolveDisplayImage = useCallback(() => {
    return (
      product.productMedia?.find(
        (m) => m.isMain && m.fileType !== "PDF" && m.fileType !== "VIDEO",
      )?.url ??
      product.productMedia?.find(
        (m) => m.fileType !== "PDF" && m.fileType !== "VIDEO",
      )?.url ??
      product.productMedia?.[0]?.url ??
      ""
    );
  }, [product.productMedia]);

  const mainImageUrl = useMemo(
    () => resolveDisplayImage(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [mainImage, setMainImage] = useState(mainImageUrl);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(
    product.variations?.[0]?.color ?? "",
  );
  const [selectedSize, setSelectedSize] = useState(
    product.variations?.[0]?.size ?? "",
  );
  const [activeTab, setActiveTab] = useState("description");
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { isInWhitelist, toggleWhitelist } = useWhitelist();
  const isWhitelisted = isInWhitelist(product.id);

  const zoomOverlayRef = useRef<HTMLDivElement>(null);
  const zoomCursorRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { addToCart, cartItems } = useCart();

  const shipping = Array.isArray(product.productShipping)
    ? product.productShipping[0]
    : (product.productShipping as any);

  const video = Array.isArray(product.productVideo)
    ? product.productVideo[0]
    : (product.productVideo as any);

  const stock = product.stock ?? 0;
  const lowStockThreshold = product.lowStockQuantityWarning ?? 5;
  const maxPurchaseQty = product.maximumPurchaseQuantity ?? stock;

  const isOutOfStock = stock <= 0 || product.showStockOut === true;
  const isAdminBlocked = product.canPurchasable === false;
  const isPurchasable = !isOutOfStock && !isAdminBlocked;

  const purchaseButtonLabel = isAdminBlocked
    ? "Not Available"
    : isOutOfStock
      ? "Out of Stock"
      : null;

  const selectedVariation = useMemo(() => {
    if (!product.variations?.length) return undefined;

    const exactMatch = product.variations.find((v) => {
      const colorMatch = selectedColor ? v.color === selectedColor : true;
      const sizeMatch = selectedSize ? v.size === selectedSize : !v.size;
      return colorMatch && sizeMatch;
    });
    if (exactMatch) return exactMatch;

    const colorOnlyMatch = product.variations.find((v) =>
      selectedColor ? v.color === selectedColor : true,
    );
    if (colorOnlyMatch) return colorOnlyMatch;

    return product.variations[0];
  }, [product.variations, selectedColor, selectedSize]);

  function resolvePrice(...prices: (number | null | undefined)[]) {
    for (const p of prices) {
      if (p != null && p > 0) return p;
    }
    return 0;
  }

  const currentPrice = resolvePrice(
    selectedVariation?.price,
    product.sellingPrice,
    product.mrpPrice,
  );

  const hasDiscount = currentPrice > 0 && currentPrice < product.mrpPrice;

  const discountPercentage = hasDiscount
    ? Math.round(((product.mrpPrice - currentPrice) / product.mrpPrice) * 100)
    : 0;

  const colors = useMemo(
    () => [...new Set(product.variations?.map((v) => v.color) ?? [])],
    [product.variations],
  );

  const availableSizesForSelectedColor = useMemo(() => {
    const relevant = selectedColor
      ? (product.variations?.filter((v) => v.color === selectedColor) ?? [])
      : (product.variations ?? []);

    return [...new Set(relevant.map((v) => v.size).filter(Boolean))];
  }, [product.variations, selectedColor]);

  const isAlreadyInCart = useMemo(
    () =>
      cartItems?.some(
        (item) =>
          item.id === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize,
      ),
    [cartItems, product.id, selectedColor, selectedSize],
  );

  const mainMediaType = useMemo(() => {
    const current = product.productMedia?.find((m) => m.url === mainImage);
    if (!current) return "image";
    if (current.fileType === "VIDEO") return "video";
    if (current.fileType === "PDF") return "pdf";
    return "image";
  }, [mainImage, product.productMedia]);

  // ✅ NEW: validation-i alada kore ekta function e — "already in cart"
  // check eikhane nei. Eita "Add to Cart" ar "Buy Now" duijaigatei
  // (variation/qty/purchasable check korte) reuse hobe.
  const validateSelection = useCallback((): boolean => {
    if (!isPurchasable) {
      toast.error(
        isAdminBlocked
          ? `${product.name} is currently not available for purchase`
          : `${product.name} is out of stock`,
      );
      return false;
    }

    if (colors.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return false;
    }

    if (availableSizesForSelectedColor.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return false;
    }

    if (quantity > maxPurchaseQty) {
      toast.error(`You can only purchase up to ${maxPurchaseQty} units`);
      return false;
    }

    return true;
  }, [
    isPurchasable,
    isAdminBlocked,
    product.name,
    colors.length,
    selectedColor,
    availableSizesForSelectedColor.length,
    selectedSize,
    quantity,
    maxPurchaseQty,
  ]);

  // ✅ NEW: actual addToCart() call — শুধু cart-e item pathay, kono
  // validation/toast nei nijer moddhe (caller age validate kore nibe)
  const addCurrentItemToCart = useCallback(() => {
    addToCart({
      id: product.id,
      slug: product.slug,
      title: product.name,
      shortTitle: product.shortName ?? product.name,
      image: mainImage,
      price: currentPrice,
      oldPrice: hasDiscount ? product.mrpPrice : undefined,
      discount: hasDiscount ? String(discountPercentage) : "0",
      quantity,
      maxPurchaseQty,
      selectedColor,
      selectedSize,
      sku: selectedVariation?.sku ?? product.sku ?? product.id,
      stock,
      shippingType: shipping?.shippingType ?? "flat_rate",
      shippingCost: shipping?.shippingCost ?? 0,
      isQuantityMultiply: shipping?.isQuantityMultiply ?? false,
    });
  }, [
    product,
    mainImage,
    currentPrice,
    hasDiscount,
    discountPercentage,
    quantity,
    maxPurchaseQty,
    selectedColor,
    selectedSize,
    selectedVariation,
    stock,
    shipping,
    addToCart,
  ]);

  // ✅ "Add to Cart" button — age er moto-i, already-in-cart hole error
  // dekhabe (duibar add hobe na)
  const handleAddToCart = useCallback((): boolean => {
    if (!validateSelection()) return false;

    if (isAlreadyInCart) {
      toast.error(`${product.name} already added`);
      return false;
    }

    addCurrentItemToCart();
    toast.success(`${product.name} added to cart`);
    return true;
  }, [validateSelection, isAlreadyInCart, addCurrentItemToCart, product.name]);

  // ✅ FIX: "Buy Now" — already-in-cart hole notun kore add na kore
  // sorasori checkout e pathay. Na thakle age validate + add kore
  // tarpor checkout e jay. Kono obosthatei product-details page e
  // fere pathabe na.
  const handleBuyNow = useCallback(() => {
    if (!validateSelection()) return;

    if (!isAlreadyInCart) {
      addCurrentItemToCart();
      toast.success(`${product.name} added to cart`);
    }

    router.push("/checkout");
  }, [
    validateSelection,
    isAlreadyInCart,
    addCurrentItemToCart,
    product.name,
    router,
  ]);

  const handleThumbnailClick = useCallback((url: string) => {
    setMainImage(url);
    if (zoomOverlayRef.current) {
      const bg = zoomOverlayRef.current.querySelector(
        "#zoom-bg",
      ) as HTMLElement;
      if (bg) bg.style.backgroundImage = `url(${url})`;
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (mainMediaType !== "image") return;
      const { left, top, width, height } =
        e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;

      if (zoomOverlayRef.current) {
        zoomOverlayRef.current.style.display = "block";
        const bg = zoomOverlayRef.current.querySelector(
          "#zoom-bg",
        ) as HTMLElement;
        if (bg) bg.style.backgroundPosition = `${x}% ${y}%`;
      }
      if (zoomCursorRef.current) {
        zoomCursorRef.current.style.display = "block";
        zoomCursorRef.current.style.left = `${x}%`;
        zoomCursorRef.current.style.top = `${y}%`;
      }
    },
    [mainMediaType],
  );

  const handleMouseLeave = useCallback(() => {
    if (zoomOverlayRef.current) zoomOverlayRef.current.style.display = "none";
    if (zoomCursorRef.current) zoomCursorRef.current.style.display = "none";
  }, []);

  const handleWishlistToggle = useCallback(() => {
    setIsWishlisted((prev) => !prev);
  }, []);

  const handleWhitelistToggle = useCallback(() => {
    toggleWhitelist({
      id: product.id,
      name: product.name,
      slug: product.slug,
      image: resolveDisplayImage(),
      price: currentPrice,
    });

    toast.success(
      isWhitelisted
        ? `${product.name} removed from whitelist`
        : `${product.name} added to whitelist`,
    );
  }, [
    product,
    currentPrice,
    isWhitelisted,
    toggleWhitelist,
    resolveDisplayImage,
  ]);

  return (
    <section className="min-h-screen bg-gray-50">
      {/* BREADCRUMB */}
      <div className="bg-white">
        <div className="max-w-[1400px] mx-auto flex items-center justify-start gap-2 text-[13px] text-gray-500 overflow-x-auto whitespace-nowrap px-1.5 py-3">
          <Link href="/" className="hover:text-[#0f3ea9] transition-all">
            Home
          </Link>
          <span>›</span>
          <p className="text-[#111827] font-medium line-clamp-1">
            {product.name}
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto">
        <div className="p-1.5 md:p-3">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4 items-start">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <ProductGallery
                  product={product}
                  mainImage={mainImage}
                  mainMediaType={mainMediaType}
                  isPurchasable={isPurchasable}
                  purchaseButtonLabel={purchaseButtonLabel}
                  isFlashSaleActive={isFlashSaleActive}
                  isOfferActive={isOfferActive}
                  isOutOfStock={isOutOfStock}
                  zoomOverlayRef={zoomOverlayRef}
                  zoomCursorRef={zoomCursorRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  onThumbnailClick={handleThumbnailClick}
                />

                <div className="lg:col-span-6">
                  <div className="bg-white rounded-xl p-3 md:p-6 shadow-sm">
                    <ProductHeader
                      name={product.name}
                      isWishlisted={isWishlisted}
                      onWishlistToggle={handleWishlistToggle}
                      isWhitelisted={isWhitelisted}
                      onWhitelistToggle={handleWhitelistToggle}
                    />

                    <ProductMeta brandId={product.brandId} />

                    <ProductPriceBlock
                      currentPrice={currentPrice}
                      mrpPrice={product.mrpPrice}
                      sellingPrice={product.sellingPrice}
                      hasDiscount={hasDiscount}
                      discountPercentage={discountPercentage}
                    />

                    <StockStatus
                      isAdminBlocked={isAdminBlocked}
                      isOutOfStock={isOutOfStock}
                      stock={stock}
                      lowStockThreshold={lowStockThreshold}
                    />

                    <VariantSelectors
                      variations={product.variations ?? []}
                      colors={colors}
                      selectedColor={selectedColor}
                      onSelectColor={setSelectedColor}
                      selectedSize={selectedSize}
                      onSelectSize={setSelectedSize}
                    />

                    <QuantitySelector
                      quantity={quantity}
                      setQuantity={setQuantity}
                      maxPurchaseQty={maxPurchaseQty}
                      isPurchasable={isPurchasable}
                      maximumPurchaseQuantity={product.maximumPurchaseQuantity}
                    />

                    <ActionButtons
                      onAddToCart={handleAddToCart}
                      onBuyNow={handleBuyNow}
                      isPurchasable={isPurchasable}
                      purchaseButtonLabel={purchaseButtonLabel}
                    />

                    <DeliveryInfoGrid
                      shippingType={shipping?.shippingType}
                      shippingCost={shipping?.shippingCost}
                      refundable={product.refundable}
                      warranty={product.warranty}
                      tags={product.tags}
                    />
                  </div>
                </div>
              </div>

              <ProductTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                description={product.description}
                video={video}
                shipping={shipping}
              />
            </div>

            <div className="hidden xl:block sticky top-4 self-start">
              <div className="max-h-[calc(100vh-2rem)] overflow-y-auto">
                <RelatedProductsSidebar relatedProducts={relatedProducts} />
              </div>
            </div>
          </div>

          <div className="xl:hidden mt-4">
            <RelatedProductsMobile relatedProducts={relatedProducts} />
          </div>
        </div>
      </div>
    </section>
  );
}
