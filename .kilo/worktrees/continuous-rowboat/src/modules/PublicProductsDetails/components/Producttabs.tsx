"use client";

import TiptapRenderer from "@/shared/tiptapEditor/TiptapRenderer";
import { Package, Star, Truck } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

const TABS = ["description", "video", "shipping & return", "reviews"] as const;

// ─── VideoPlayerTap ─────────────────────────────────────────────────────────

function getYoutubeEmbedUrl(url: string): string {
  let videoId = "";

  if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split(/[?&]/)[0] ?? "";
  } else if (url.includes("watch?v=")) {
    videoId = url.split("watch?v=")[1]?.split("&")[0] ?? "";
  } else if (url.includes("/embed/")) {
    videoId = url.split("/embed/")[1]?.split(/[?&]/)[0] ?? "";
  }

  const base = videoId
    ? `https://www.youtube.com/embed/${videoId}`
    : url.split("?")[0]; // অচেনা format হলে অন্তত base URL রাখা হচ্ছে

  return `${base}?rel=0&modestbranding=1&autohide=1&showinfo=0&autoplay=0`;
}

function VideoPlayerTap({ url }: { url: string }) {
  const [loaded, setLoaded] = useState(false);
  const embedUrl = getYoutubeEmbedUrl(url);

  return (
    <div
      className="w-full  h-full md:max-h-96 md:mx-auto rounded-xl overflow-hidden relative bg-slate-100"
      style={{ aspectRatio: "16/9" }}
    >
      {/* SKELETON */}
      {!loaded && (
        <div className="absolute inset-0 z-10 bg-white rounded-xl border border-slate-200">
          {/* Top bar */}
          <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-slate-100">
            <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-200" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3 w-40 animate-pulse rounded bg-slate-200" />
              <div className="h-2.5 w-24 animate-pulse rounded bg-slate-200" />
            </div>
            <div className="h-7 w-16 animate-pulse rounded-lg bg-slate-200" />
          </div>
          {/* Main area */}
          <div className="flex items-center justify-center h-[calc(100%-80px)]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-14 h-14 animate-pulse rounded-full bg-slate-200 flex items-center justify-center">
                <div className="w-0 h-0 border-t-[9px] border-t-transparent border-b-[9px] border-b-transparent border-l-[16px] border-l-slate-300 ml-1" />
              </div>
              <div className="h-2.5 w-36 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
          {/* Bottom controls */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 px-4 py-3 border-t border-slate-100">
            <div className="h-2.5 w-8 animate-pulse rounded bg-slate-200" />
            <div className="flex-1 h-1.5 animate-pulse rounded-full bg-slate-200" />
            <div className="h-2.5 w-8 animate-pulse rounded bg-slate-200" />
            <div className="w-6 h-6 animate-pulse rounded bg-slate-200" />
            <div className="w-6 h-6 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      )}
      {/* IFRAME */}
      <iframe
        src={embedUrl}
        title="Product Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full border-0 absolute inset-0"
        onLoad={() => {
          setTimeout(() => setLoaded(true), 50);
        }}
      />
    </div>
  );
}

// ✅ YouTube iframe-এর জন্য DNS/TLS connection আগে থেকেই warm-up করে রাখা
// হচ্ছে — video ট্যাবে hover/focus করলেই (ক্লিক করার আগেই) connection শুরু
// হয়ে যাবে, ফলে ট্যাব ক্লিক করার পর actual video load হতে কম সময় লাগবে।
// একবার করা হয়ে গেলে দ্বিতীয়বার duplicate link tag বসবে না।
const YOUTUBE_PRECONNECT_DOMAINS = [
  "https://www.youtube.com",
  "https://www.youtube-nocookie.com",
  "https://i.ytimg.com",
  "https://www.google.com",
];

function warmUpYoutubeConnections() {
  YOUTUBE_PRECONNECT_DOMAINS.forEach((href) => {
    const existing = document.querySelector(
      `link[rel="preconnect"][href="${href}"]`,
    );
    if (existing) return;

    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = href;
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  });
}

// ─── ProductTabs ────────────────────────────────────────────────────────────

interface ProductTabsProps {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  description?: string | null;
  video?: { videoUrl?: string } | null;
  shipping?: {
    shippingType?: string;
    shippingCost?: number;
    isQuantityMultiply?: boolean;
    returnPolicy?: string;
  } | null;
}

export function ProductTabs({
  activeTab,
  setActiveTab,
  description,
  video,
  shipping,
}: ProductTabsProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            onMouseEnter={() => {
              if (tab === "video") warmUpYoutubeConnections();
            }}
            onTouchStart={() => {
              if (tab === "video") warmUpYoutubeConnections();
            }}
            onFocus={() => {
              if (tab === "video") warmUpYoutubeConnections();
            }}
            className={`px-6 py-4 font-semibold text-sm transition-all whitespace-nowrap capitalize ${
              activeTab === tab
                ? "border-b-2 border-[#0f3ea9] text-[#0f3ea9]"
                : "text-gray-500 hover:text-[#0f3ea9]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-3 md:p-6">
        {activeTab === "description" &&
          (description ? (
            <TiptapRenderer html={description} />
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Package className="w-16 h-16 mb-3 opacity-20" />
              <p className="text-sm">No description available</p>
            </div>
          ))}

        {activeTab === "video" && (
          <div>
            {video?.videoUrl ? (
              <VideoPlayerTap url={video.videoUrl} />
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <svg
                  className="w-16 h-16 mb-3 opacity-30"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                  />
                </svg>
                <p className="text-sm">No video available for this product</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "shipping & return" && (
          <div className="space-y-4">
            {shipping ? (
              <>
                <p className="text-[14px] font-semibold">
                  {shipping.shippingType === "free"
                    ? "Free Delivery"
                    : `৳ ${(shipping.shippingCost ?? 0).toLocaleString()}`}
                </p>
                {shipping.shippingType === "flat_rate" &&
                  shipping.isQuantityMultiply && (
                    <p className="text-[13px] text-gray-500">
                      * Shipping cost multiplies with quantity
                    </p>
                  )}
                <TiptapRenderer
                  html={shipping.returnPolicy || "<p>7 Days Easy Return</p>"}
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <Truck className="w-16 h-16 mb-3 opacity-20" />
                <p className="text-sm">No shipping information available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#0f3ea9]">4.5</div>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < 4
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Based on 248 reviews
                </p>
              </div>
            </div>
            {/* ⚠️ Static — actual review API integrate করার আগে
                production-এ এটা misleading data */}
          </div>
        )}
      </div>
    </div>
  );
}
