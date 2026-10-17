"use client";

import { Heart, Share2 } from "lucide-react";
import { toast } from "sonner";

interface ProductHeaderProps {
  name: string;
  isWishlisted: boolean;
  onWishlistToggle: () => void;
  isWhitelisted?: boolean;
  onWhitelistToggle?: () => void;
}

export function ProductHeader({
  name,
  isWhitelisted = false,
  onWhitelistToggle,
}: ProductHeaderProps) {
  const copyToClipboard = async (text: string): Promise<boolean> => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {}
    }

    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.top = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textarea);
      return success;
    } catch {
      return false;
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: `Check out ${name}`,
          url: shareUrl,
        });
      } catch (err) {
        // ✅ user নিজে share sheet cancel করলে (AbortError) কিছু করার দরকার নেই
        if ((err as Error).name !== "AbortError") {
          toast.error("Could not share the link");
        }
      }
      return;
    }

    // ✅ Desktop / unsupported browser fallback — link copy করে দেবে
    const copied = await copyToClipboard(shareUrl);
    if (copied) {
      toast.success("Product link copied to clipboard");
    } else {
      // ✅ শেষ পর্যন্ত copy না হলে অন্তত link-টা দেখিয়ে দেওয়া হচ্ছে,
      // যাতে user manually select করে copy করতে পারে
      toast.error(`Copy failed. Link: ${shareUrl}`);
    }
  };

  return (
    <div className="flex items-start justify-between gap-2">
      <h1 className="text-base md:text-lg font-bold leading-[18px] md:leading-[22px] text-gray-800 line-clamp-2">
        {name}
      </h1>
      <div className="flex gap-2">
        {onWhitelistToggle && (
          <button
            onClick={onWhitelistToggle}
            aria-label="Add to whitelist"
            className="w-8 md:w-10 h-8 md:h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all"
          >
            <Heart
              className={`w-5 h-5 ${isWhitelisted ? "fill-red-500 text-red-500" : ""}`}
            />
          </button>
        )}
        <button
          onClick={handleShare}
          aria-label="Share product"
          className="w-8 md:w-10 h-8 md:h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
