"use client";

import { IPublicProduct } from "@/types/AdminProducts/AdminProducts.interface";
import { Zap } from "lucide-react";
import Image from "next/image";
import { RefObject, useState } from "react";

interface ProductGalleryProps {
  product: IPublicProduct;
  mainImage: string;
  mainMediaType: "image" | "video" | "pdf";
  isPurchasable: boolean;
  purchaseButtonLabel: string | null;
  isFlashSaleActive: boolean;
  isOfferActive: boolean;
  isOutOfStock: boolean;
  zoomOverlayRef: RefObject<HTMLDivElement | null>;
  zoomCursorRef: RefObject<HTMLDivElement | null>;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
  onThumbnailClick: (url: string) => void;
}

// ✅ PDF URL হোক বা fileType যাই থাকুক — robust ভাবে detect করার জন্য
function getMediaType(
  fileType: string | undefined,
  url: string,
): "image" | "video" | "pdf" {
  const ft = fileType?.toUpperCase();
  if (ft === "PDF" || url.toLowerCase().endsWith(".pdf")) return "pdf";
  if (ft === "VIDEO" || /\.(mp4|webm|mov)$/i.test(url)) return "video";
  return "image";
}

// ✅ Cloudinary PDF URL কে actual image (প্রথম পেজের render) এ কনভার্ট করে
function getPdfPreviewUrl(url: string) {
  if (url.toLowerCase().endsWith(".pdf")) {
    return url.replace(/\.pdf$/i, ".jpg");
  }
  return url;
}

export function ProductGallery({
  product,
  mainImage,
  mainMediaType,
  isPurchasable,
  purchaseButtonLabel,
  isFlashSaleActive,
  isOfferActive,
  isOutOfStock,
  zoomOverlayRef,
  zoomCursorRef,
  onMouseMove,
  onMouseLeave,
  onThumbnailClick,
}: ProductGalleryProps) {
  const [isImageLoading, setIsImageLoading] = useState(false);

  const handleThumbnailClick = (url: string) => {
    if (url !== mainImage) {
      setIsImageLoading(true);
    }
    onThumbnailClick(url);
  };

  // main media এর real type বের করে নিচ্ছি (prop-এ ভুল আসলেও ফলব্যাক থাকবে)
  const resolvedMainType = getMediaType(
    mainMediaType === "pdf"
      ? "PDF"
      : mainMediaType === "video"
        ? "VIDEO"
        : "IMAGE",
    mainImage,
  );

  const mainDisplayUrl =
    resolvedMainType === "pdf" ? getPdfPreviewUrl(mainImage) : mainImage;

  return (
    <div className="lg:col-span-6 relative">
      <div
        ref={zoomOverlayRef}
        className="hidden xl:block absolute top-0 z-50 pointer-events-none rounded-xl border border-gray-200 bg-white overflow-hidden shadow-2xl"
        style={{
          left: "calc(100% + 16px)",
          width: "100%",
          height: "500px",
          display: "none",
        }}
      >
        <div
          id="zoom-bg"
          className="w-full h-full"
          style={{
            backgroundImage: `url(${mainDisplayUrl})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "250%",
            backgroundPosition: "50% 50%",
          }}
        />
      </div>

      <div
        className={`relative overflow-hidden rounded-xl border border-gray-200 bg-white ${
          resolvedMainType === "image" || resolvedMainType === "pdf"
            ? "cursor-crosshair"
            : ""
        }`}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {/* ✅ height fixed রাখলাম কিন্তু object-contain দেওয়ায় এখন কোনো কনটেন্ট কাটবে না,
            শুধু প্রয়োজনে চারপাশে সাদা space দেখাবে */}
        <div className="relative h-[250px] md:h-[500px] bg-white">
          {(resolvedMainType === "image" || resolvedMainType === "pdf") &&
            mainImage && (
              <>
                {isImageLoading && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-50">
                    <span className="inline-block h-8 w-8 rounded-full border-[3px] border-gray-200 border-t-orange-500 animate-spin" />
                  </div>
                )}
                <Image
                  key={mainImage}
                  src={mainDisplayUrl}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  onLoad={() => setIsImageLoading(false)}
                  className={`object-contain transition-opacity duration-200 ${
                    isImageLoading ? "opacity-0" : "opacity-100"
                  } ${isOutOfStock ? "grayscale opacity-70" : ""}`}
                />
                <div
                  ref={zoomCursorRef}
                  className="hidden xl:block absolute w-28 h-28 border-2 border-white pointer-events-none -translate-x-1/2 -translate-y-1/2"
                  style={{
                    display: "none",
                    boxShadow: "0 0 0 9999px rgba(0,0,0,0.18)",
                  }}
                />

                {/* PDF হলে ছবির উপরে একটা ছোট overlay badge + open link */}
                {resolvedMainType === "pdf" && (
                  <a
                    href={mainImage}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-orange-600 text-xs font-semibold shadow-md hover:bg-orange-50 transition-all"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5z" />
                    </svg>
                    Open PDF
                  </a>
                )}
              </>
            )}

          {resolvedMainType === "video" && mainImage && (
            <video
              src={mainImage}
              controls
              preload="metadata"
              poster={
                product.productMedia?.find(
                  (m) => m.fileType !== "PDF" && m.fileType !== "VIDEO",
                )?.url
              }
              className="w-full h-full object-contain bg-black"
            />
          )}

          {!mainImage && (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}

          {!isPurchasable && (
            <div className="absolute top-3 left-3 z-10 rounded-full bg-gray-900/85 px-3 py-1.5 text-xs font-bold text-white">
              {purchaseButtonLabel}
            </div>
          )}

          {isPurchasable && isFlashSaleActive && (
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1 rounded-full bg-red-500 px-3 py-1.5 text-xs font-bold text-white">
              <Zap size={13} strokeWidth={2.5} />
              Flash Sale
            </div>
          )}
          {isPurchasable && !isFlashSaleActive && isOfferActive && (
            <div className="absolute top-3 left-3 z-10 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white">
              On Offer
            </div>
          )}
        </div>
      </div>

      {/* THUMBNAILS */}
      <div className="flex gap-2 mt-2 md:mt-4 overflow-x-auto scrollbar-hide pb-1">
        {product.productMedia?.map((media, index) => {
          const type = getMediaType(media.fileType, media.url);
          const thumbUrl =
            type === "pdf" ? getPdfPreviewUrl(media.url) : media.url;

          return (
            <button
              key={index}
              onClick={() => handleThumbnailClick(media.url)}
              className={`relative min-w-[65px] md:min-w-[80px] h-[65px] md:h-[80px] rounded-lg overflow-hidden border-1 bg-white transition-all flex-shrink-0 ${
                mainImage === media.url
                  ? "border-orange-500 shadow-md"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              {(type === "image" || type === "pdf") && (
                <Image
                  src={thumbUrl}
                  alt={`thumbnail ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-contain p-1"
                />
              )}
              {type === "video" && (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-white opacity-80"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
