"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TOrder, trackOrder } from "@/services/orders/orders.service";
import { Loader2, Package, Phone, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import OrderTrackingResult from "../OrderTrackingResult";

export default function TrackOrderForm() {
  const searchParams = useSearchParams();

  // ✅ Email-er "Track Your Order" link theke ?orderNumber=...&phone=... asle
  // seta diyeই default value set kora — user ke abar type korte hobe na
  const [orderNumber, setOrderNumber] = useState(
    searchParams.get("orderNumber") || "",
  );
  const [phone, setPhone] = useState(searchParams.get("phone") || "");
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<TOrder | null>(null);

  const handleTrack = async (orderNum: string, phoneNum: string) => {
    if (!orderNum.trim() || !phoneNum.trim()) {
      toast.error("Please enter both Order ID and phone number");
      return;
    }

    setIsLoading(true);
    setOrder(null);
    const toastId = toast.loading("Searching for your order...");

    try {
      const result = await trackOrder({
        orderNumber: orderNum.trim(),
        phone: phoneNum.trim(),
      });
      setOrder(result);
      toast.success("Order found", { id: toastId });
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "No order found with this Order ID and phone number",
        { id: toastId },
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ URL-e orderNumber thakle (email link theke asha) — automatically track kore dao
  // Note: phone URL-e na thakle (privacy-er jonno na pathanoi better) user ke sudhu
  // phone number ta type korte hobe, orderNumber already bhora thakবে
  useEffect(() => {
    const orderNumberParam = searchParams.get("orderNumber");
    const phoneParam = searchParams.get("phone");

    if (orderNumberParam && phoneParam) {
      // setTimeout diye macrotask-e push kora — effect body-te synchronous setState
      // call korle Turbopack cascading render warning dey, tai defer kora
      const timer = setTimeout(() => {
        handleTrack(orderNumberParam, phoneParam);
      }, 0);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleTrack(orderNumber, phone);
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col items-center px-6 pb-6 pt-8 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 shadow-sm shadow-orange-200">
            <Package className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-lg font-semibold text-slate-800">
            Track your order
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Enter your details to see live status
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-3 border-t border-slate-100 px-6 py-6"
        >
          <div className="relative">
            <Package className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Order ID  (e.g. Taqwa Tech-0001)"
              className="rounded-xl bg-slate-50 py-5 pl-10 "
            />
          </div>

          <div className="relative">
            <Phone className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              className="rounded-xl bg-slate-50 py-5 pl-10 "
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 py-5 text-sm font-semibold text-white hover:from-orange-600 hover:to-red-600 disabled:from-slate-300 disabled:to-slate-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Track Order
              </>
            )}
          </Button>
        </form>
      </div>

      <div className="mt-4 flex flex-col items-center gap-2">
        <p className="text-center text-xs text-slate-400">
          Need help? Contact our support team.
        </p>
        <a
          href="https://wa.me/8801XXXXXXXXX"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5 fill-current"
            aria-hidden="true"
          >
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.13a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.37c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.21-8.25 8.21Zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.84-.86 2.04 0 1.2.88 2.37 1 2.53.12.17 1.73 2.64 4.19 3.7.59.25 1.04.4 1.4.51.59.19 1.12.16 1.54.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.23-.17-.48-.29Z" />
          </svg>
          Chat on WhatsApp
        </a>
      </div>

      {order && (
        <div className="mt-6">
          <OrderTrackingResult order={order} />
        </div>
      )}
    </div>
  );
}
