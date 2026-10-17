"use client";

import { useCart } from "@/hooks/useCart";
import { Check, CheckCircle2, Copy, Home, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderNumber = searchParams.get("orderNumber");
  const { clearCart } = useCart();
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!orderNumber) {
      router.replace("/");
      return;
    }
    clearCart();
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNumber, router]);

  if (!orderNumber) return null;

  const formattedDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // ✅ Copy to clipboard — in-app browser (Messenger/FB webview) fallback soho
  const handleCopyOrderNumber = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(orderNumber);
      } else {
        // fallback — clipboard API na thakle
        const textarea = document.createElement("textarea");
        textarea.value = orderNumber;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      toast.success("Order ID copied");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
      toast.error("Could not copy, please copy manually");
    }
  };

  return (
    <main className="min-h-[calc(100vh-200px)] bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl mx-auto">
        <div
          className={`relative bg-white rounded-3xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.04)] px-6 sm:px-10 py-12 flex flex-col items-center text-center overflow-hidden transition-all duration-500 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {/* Decorative top accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-400" />

          {/* Success icon */}
          <div
            className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mb-6 shadow-lg shadow-green-200 transition-all duration-500 ${
              visible ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20" />
            <CheckCircle2
              className="w-10 h-10 sm:w-12 sm:h-12 text-white relative"
              strokeWidth={2}
            />
          </div>

          {/* Heading */}
          <span
            className={`text-[12px] font-semibold uppercase tracking-widest text-green-600 mb-2 transition-all duration-400 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "160ms" }}
          >
            Order Confirmed
          </span>

          <h1
            className={`text-[26px] sm:text-[32px] font-bold text-gray-900 mb-2.5 tracking-tight transition-all duration-400 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "220ms" }}
          >
            Thank you for your order!
          </h1>

          <p
            className={`text-[14px] sm:text-[15.5px] text-gray-500 mb-9 max-w-md leading-relaxed transition-all duration-400 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            Your order has been placed successfully. Well notify{" "}
            <span className="text-[#0f3ea9] font-medium">you</span> as soon as
            your items are on the way.
          </p>

          {/* Order ID — highlighted card with copy */}
          <div
            className={`w-full mb-5 transition-all duration-400 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "360ms" }}
          >
            <div className="flex items-center justify-between gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4">
              <div className="flex flex-col items-start text-left min-w-0">
                <span className="text-[10.5px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">
                  Order ID
                </span>
                <p className="text-[16px] sm:text-[18px] font-bold text-gray-900 truncate">
                  #{orderNumber}
                </p>
              </div>

              <button
                onClick={handleCopyOrderNumber}
                aria-label="Copy order ID"
                className={`shrink-0 flex items-center gap-1.5 h-[38px] px-3.5 rounded-xl text-[12.5px] font-semibold transition-all duration-200 ${
                  copied
                    ? "bg-green-500 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-[#0f3ea9] hover:text-[#0f3ea9]"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Info row — Date & Shipping */}
          <div
            className={`w-full border border-gray-100 rounded-2xl mb-8 flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-gray-100 transition-all duration-400 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "420ms" }}
          >
            {/* Date */}
            <div className="flex flex-col items-start gap-1 px-6 py-5 flex-1">
              <div className="flex items-center gap-1.5 text-gray-400">
                <svg
                  width={13}
                  height={13}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                <span className="text-[10px] font-semibold uppercase tracking-wider">
                  Order Date
                </span>
              </div>
              <p className="text-[14.5px] font-semibold text-gray-800">
                {formattedDate}
              </p>
            </div>

            {/* Shipping */}
            <div className="flex flex-col items-start gap-1 px-6 py-5 flex-1">
              <div className="flex items-center gap-1.5 text-gray-400">
                <svg
                  width={13}
                  height={13}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
                  <rect x="9" y="11" width="14" height="10" rx="1" />
                  <circle cx="12" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                </svg>
                <span className="text-[10px] font-semibold uppercase tracking-wider">
                  Estimated Delivery
                </span>
              </div>
              <p className="text-[14.5px] font-semibold text-green-600">
                Standard (3–5 Days)
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div
            className={`w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-3 transition-all duration-400 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "480ms" }}
          >
            <Link
              href="/shop"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-[#081a33] hover:bg-[#1441aa] text-white text-[14px] font-semibold transition-colors shadow-sm shadow-blue-100"
            >
              <ShoppingBag className="w-4 h-4" />
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-[14px] font-semibold transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
