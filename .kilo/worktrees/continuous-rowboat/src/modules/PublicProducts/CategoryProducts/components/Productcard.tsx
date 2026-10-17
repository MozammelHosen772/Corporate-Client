/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { ICategoryProduct } from "@/services/products/category.service";
// import { Heart, ImageOff, ShoppingCart, Zap } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useState } from "react";
// import { getDiscount, isFlashSale, isOnOffer } from "./Producthelpers";

// interface ProductCardProps {
//   product: ICategoryProduct;
// }

// export default function ProductCard({ product }: ProductCardProps) {
//   const [wishlisted, setWishlisted] = useState(false);

//   const discount = getDiscount(product);
//   const offer = isOnOffer(product);
//   const flash = isFlashSale(product);

//   const image = product.productMedia[0];
//   const price = product.sellingPrice ?? product.mrpPrice;
//   const hasDiscount = product.mrpPrice > price;
//   const outOfStock = product.stock <= 0;

//   const isValidImage =
//     image?.url &&
//     !image.url.match(/\.(pdf|mp4|mov|avi|mkv|webm)(\?.*)?$/i) &&
//     !image.url.includes("/pdfs/") &&
//     !image.url.includes("/videos/");

//   return (
//     <article className="group relative flex flex-col rounded-lg border border-border bg-card overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-orange-200">
//       {/* Image */}
//       <Link
//         href={`/products/${product.slug}`}
//         aria-label={`View ${product.name}`}
//         className="block"
//       >
//         <div className="relative h-32 md:h-42 overflow-hidden bg-muted">
//           {isValidImage ? (
//             <Image
//               src={image!.url}
//               alt={product.name}
//               fill
//               sizes="(max-width: 640px) 70vw, (max-width: 1024px) 33vw, 25vw"
//               className={`object-cover transition-transform duration-300 group-hover:scale-[1.04] ${
//                 outOfStock ? "grayscale opacity-60" : ""
//               }`}
//               loading="lazy"
//             />
//           ) : (
//             <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
//               <ImageOff className="w-7 h-7" strokeWidth={1.5} />
//               <span className="text-xs">No image</span>
//             </div>
//           )}

//           {/* Discount — diagonal ribbon, card #1 এর সাথে identical */}
//           {discount && discount > 0 && (
//             <div className="absolute -left-6 top-2 w-20 -rotate-45 bg-orange-500 py-0.5 text-center text-[8px] font-bold text-white shadow-sm md:-left-8 md:top-3 md:w-28 md:text-[10px]">
//               {discount}% OFF
//             </div>
//           )}

//           {/* Status badges — flash sale / offer / out of stock */}
//           <div className="absolute left-2 top-2 flex flex-col gap-1 md:left-3 md:top-3 md:gap-1.5">
//             {flash && (
//               <span className="flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-[8px] font-bold text-white md:px-2.5 md:py-1 md:text-[10px]">
//                 <Zap size={9} strokeWidth={2.5} className="md:hidden" />
//                 <Zap size={10} strokeWidth={2.5} className="hidden md:block" />
//                 Flash sale
//               </span>
//             )}
//             {offer && !flash && (
//               <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[8px] font-bold text-white md:px-2.5 md:py-1 md:text-[10px]">
//                 On offer
//               </span>
//             )}
//           </div>

//           <button
//             onClick={(e) => {
//               e.preventDefault();
//               setWishlisted((w) => !w);
//             }}
//             aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
//             className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100"
//           >
//             <Heart
//               className={`w-3.5 h-3.5 ${
//                 wishlisted ? "fill-red-500 text-red-500" : ""
//               }`}
//             />
//           </button>
//         </div>
//       </Link>

//       {/* Info */}
//       <div className="flex flex-col gap-2 p-2 md:p-3 flex-1">
//         {/* Name */}
//         <Link href={`/products/${product.slug}`}>
//           <h3 className="text-[13px] md:text-sm font-medium leading-snug text-foreground line-clamp-2 min-h-[36px] md:min-h-[40px] hover:text-orange-600 transition-colors">
//             {product.name}
//           </h3>
//         </Link>

//         {/* Price */}
//         <div className="flex items-baseline gap-2">
//           <span className="text-base md:text-lg font-semibold text-orange-500 font-mono">
//             ৳{price.toLocaleString("en-BD")}
//           </span>
//           {hasDiscount && (
//             <span className="text-xs text-muted-foreground line-through font-mono">
//               ৳{product.mrpPrice.toLocaleString("en-BD")}
//             </span>
//           )}
//         </div>

//         {/* Out of stock tag — stock LEVEL bar-এর বদলে শুধু status */}
//         {outOfStock && (
//           <p className="text-[9px] md:text-[10px] font-semibold tracking-wide uppercase text-gray-400">
//             Status:{" "}
//             <span className="font-bold text-gray-500">Out of stock</span>
//           </p>
//         )}

//         <Separator className="my-0.5" />

//         {/* Pre-order Button */}
//         <Button
//           size="sm"
//           disabled={outOfStock}
//           className={`w-full h-9 text-xs font-bold rounded-lg gap-1.5 transition-all duration-200 ${
//             outOfStock
//               ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//               : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 active:scale-[0.98] text-white shadow-sm hover:shadow-orange-200 hover:shadow-md"
//           }`}
//         >
//           <ShoppingCart className="w-3.5 h-3.5" />
//           {outOfStock ? "Unavailable" : "Buy Now"}
//         </Button>
//       </div>
//     </article>
//   );
// }
"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useWhitelist } from "@/contexts/WhitelistContext";
import { useCart } from "@/hooks/useCart";
import { ICategoryProduct } from "@/services/products/category.service";
import { Heart, ImageOff, ShoppingCart, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import { getDiscount, isFlashSale, isOnOffer } from "./Producthelpers";

interface ProductCardProps {
  product: ICategoryProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addToCart, cartItems } = useCart();
  const { isInWhitelist, toggleWhitelist } = useWhitelist();

  const discount = getDiscount(product);
  const offer = isOnOffer(product);
  const flash = isFlashSale(product);

  const image = product.productMedia[0];
  const price = product.sellingPrice ?? product.mrpPrice;
  const hasDiscount = product.mrpPrice > price;
  const outOfStock = product.stock <= 0;

  const isValidImage =
    image?.url &&
    !image.url.match(/\.(pdf|mp4|mov|avi|mkv|webm)(\?.*)?$/i) &&
    !image.url.includes("/pdfs/") &&
    !image.url.includes("/videos/");

  // ✅ NEW: age local useState chilo (page reload e reset hoto, navbar
  // whitelist count er sathe sync thakto na) — ekhon global whitelist
  // context theke asol status neya hocche
  const wishlisted = isInWhitelist(product.id);

  // ✅ NEW: variation thakle grid theke direct cart e add na kore
  // details page e pathano hobe (color/size select korার jonno).
  // (ICategoryProduct e variations field thakle e eita kaj korbe;
  // na thakle typecheck e error dile amake janio, field name/shape
  // milie dibo)
  const hasVariations = ((product as any).variations?.length ?? 0) > 0;

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
      image: image?.url ?? "",
      price,
      oldPrice: hasDiscount ? product.mrpPrice : undefined,
      discount: hasDiscount ? String(discount ?? 0) : "0",
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

  // ✅ FIX: buy-now button ekhon shotti kaj kore. Variation thakle
  // details page e pathay, na thakle age-theke-cart-e-thakle sorasori
  // checkout, na thakle add kore checkout e — flash-sale/offer card er
  // sathe consistent logic
  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();

    if (outOfStock) return;

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

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWhitelist({
      id: product.id,
      name: product.name,
      slug: product.slug,
      image: image?.url ?? "",
      price,
    });
    toast.success(
      wishlisted
        ? `${product.name} removed from whitelist`
        : `${product.name} added to whitelist`,
    );
  };

  return (
    <article className="group relative flex flex-col rounded-lg border border-border bg-card overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-orange-200">
      {/* Image */}
      <Link
        href={`/products/${product.slug}`}
        aria-label={`View ${product.name}`}
        className="block"
      >
        <div className="relative h-32 md:h-42 overflow-hidden bg-muted">
          {isValidImage ? (
            <Image
              src={image!.url}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 70vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover transition-transform duration-300 group-hover:scale-[1.04] ${
                outOfStock ? "grayscale opacity-60" : ""
              }`}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <ImageOff className="w-7 h-7" strokeWidth={1.5} />
              <span className="text-xs">No image</span>
            </div>
          )}

          {/* Discount ribbon */}
          {discount && discount > 0 && (
            <div className="absolute -left-6 top-2 w-20 -rotate-45 bg-orange-500 py-0.5 text-center text-[8px] font-bold text-white shadow-sm md:-left-8 md:top-3 md:w-28 md:text-[10px]">
              {discount}% OFF
            </div>
          )}

          {/* Status badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-1 md:left-3 md:top-3 md:gap-1.5">
            {flash && (
              <span className="flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-[8px] font-bold text-white md:px-2.5 md:py-1 md:text-[10px]">
                <Zap size={9} strokeWidth={2.5} className="md:hidden" />
                <Zap size={10} strokeWidth={2.5} className="hidden md:block" />
                Flash sale
              </span>
            )}
            {offer && !flash && (
              <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[8px] font-bold text-white md:px-2.5 md:py-1 md:text-[10px]">
                On offer
              </span>
            )}
          </div>

          {/* ✅ FIX: whitelist context diye toggle, wishlisted hole
              hover chara-o (opacity-100) visible thakbe */}
          <button
            onClick={handleWishlistToggle}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wishlisted}
            className={`absolute top-2 right-2 w-7 h-7 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-200 ${
              wishlisted
                ? "bg-white text-red-500 opacity-100"
                : "bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white opacity-0 group-hover:opacity-100"
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                wishlisted ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-col gap-2 p-2 md:p-3 flex-1">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-[13px] md:text-sm font-medium leading-snug text-foreground line-clamp-2 min-h-[36px] md:min-h-[40px] hover:text-orange-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2">
          <span className="text-base md:text-lg font-semibold text-orange-500 font-mono">
            ৳{price.toLocaleString("en-BD")}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through font-mono">
              ৳{product.mrpPrice.toLocaleString("en-BD")}
            </span>
          )}
        </div>

        {outOfStock && (
          <p className="text-[9px] md:text-[10px] font-semibold tracking-wide uppercase text-gray-400">
            Status:{" "}
            <span className="font-bold text-gray-500">Out of stock</span>
          </p>
        )}

        <Separator className="my-0.5" />

        {/* ✅ FIX: onClick wire kora holo */}
        <Button
          size="sm"
          disabled={outOfStock}
          onClick={handleBuyNow}
          className={`w-full h-9 text-xs font-bold rounded-lg gap-1.5 transition-all duration-200 ${
            outOfStock
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 active:scale-[0.98] text-white shadow-sm hover:shadow-orange-200 hover:shadow-md"
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {outOfStock ? "Unavailable" : "Buy Now"}
        </Button>
      </div>
    </article>
  );
}
