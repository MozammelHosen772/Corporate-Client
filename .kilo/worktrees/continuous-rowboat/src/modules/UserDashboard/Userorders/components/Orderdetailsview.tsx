"use client";

import { TOrder } from "@/services/orders/orders.service";
import {
  Check,
  Copy,
  ImageOff,
  MapPin,
  PackageCheck,
  Phone,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  ORDER_STATUS_CONFIG,
  ORDER_STATUS_FLOW,
  OrderStatus,
} from "../constants/Userorder.contant";

// ─── Copy button — je kono field-er pashe boshanor jonno reusable ──────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // in-app browser fallback (clipboard API blocked hole)
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand("copy");
      } catch {
        // silently ignore — non-critical action
      }
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy"
      className="inline-flex flex-shrink-0 items-center justify-center rounded-md p-1 text-slate-350 transition-colors hover:bg-slate-100 hover:text-slate-600"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

function OrderStepper({ status }: { status: string }) {
  const isCancelled = status === "CANCELLED";
  const currentIndex = ORDER_STATUS_FLOW.indexOf(status as OrderStatus);
  const CancelledIcon = ORDER_STATUS_CONFIG.CANCELLED.icon;

  return (
    <div className="mt-6 px-1">
      <div className="flex items-start">
        {ORDER_STATUS_FLOW.map((step, idx) => {
          const meta = ORDER_STATUS_CONFIG[step];
          const Icon = meta.icon;

          // cancelled hole kono step-i "reached" dekhabo na, sob dhushor thakbe
          const isDone = !isCancelled && idx < currentIndex;
          const isActive = !isCancelled && idx === currentIndex;
          // left connector: ager step porjonto pouchhese kina (active porjonto o blue)
          const isReached = !isCancelled && idx <= currentIndex;

          return (
            <div
              key={step}
              className="flex flex-1 flex-col items-center last:flex-none"
            >
              <div className="flex w-full items-center">
                <div
                  className={`h-[2px] flex-1 transition-colors duration-500 ${
                    idx === 0
                      ? "invisible"
                      : isReached
                        ? "bg-[#0f3ea9]"
                        : "bg-slate-150"
                  }`}
                />

                <div className="relative flex-shrink-0">
                  {isActive && (
                    <span className="absolute inset-0 -m-1 animate-ping rounded-full bg-gradient-to-br from-amber-400/40 to-red-500/40 motion-reduce:hidden" />
                  )}
                  <div
                    className={`relative flex h-5 md:h-9 w-5 md:w-9 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                      isActive
                        ? "border-orange-500 bg-gradient-to-br from-amber-400 to-red-500 text-white shadow-sm shadow-red-200"
                        : isDone
                          ? "border-[#0f3ea9] bg-[#0f3ea9] text-white"
                          : "border-slate-200 bg-white text-slate-300"
                    }`}
                  >
                    {isDone ? (
                      <Check className="h-4 w-4" strokeWidth={3} />
                    ) : (
                      <Icon className="h-4 w-4" strokeWidth={2.25} />
                    )}
                  </div>
                </div>

                <div
                  className={`h-[2px] flex-1 transition-colors duration-500 ${
                    idx === ORDER_STATUS_FLOW.length - 1
                      ? "invisible"
                      : isDone
                        ? "bg-[#0f3ea9]"
                        : "bg-slate-150"
                  }`}
                />
              </div>

              <span
                className={`mt-2 text-center text-[7.5px] md:text-[10.5px] font-medium uppercase tracking-wide ${
                  isActive
                    ? "text-red-500"
                    : isDone
                      ? "text-slate-400"
                      : "text-slate-300"
                }`}
              >
                {meta.label}
              </span>
            </div>
          );
        })}

        {/* Cancelled — normal flow-er baire, alada branch hisebe dekhano */}
        <div className="flex flex-1 flex-col items-center last:flex-none">
          <div className="flex w-full items-center">
            <div
              className={`h-[2px] flex-1 transition-colors duration-500 ${
                isCancelled ? "bg-red-500" : "bg-slate-150"
              }`}
            />
            <div className="relative flex-shrink-0">
              {isCancelled && (
                <span className="absolute inset-0 -m-1 animate-ping rounded-full bg-red-500/25 motion-reduce:hidden" />
              )}
              <div
                className={`relative flex h-5 md:h-9 w-5 md:w-9 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                  isCancelled
                    ? "border-red-500 bg-red-500 text-white"
                    : "border-slate-200 bg-white text-slate-300"
                }`}
              >
                <CancelledIcon className="h-4 w-4" strokeWidth={2.25} />
              </div>
            </div>
            <div className="invisible h-[2px] flex-1" />
          </div>
          <span
            className={`mt-2 text-center text-[7.5px] md:text-[10.5px] font-medium uppercase tracking-wide ${
              isCancelled ? "text-red-600" : "text-slate-300"
            }`}
          >
            {ORDER_STATUS_CONFIG.CANCELLED.label}
          </span>
        </div>
      </div>
    </div>
  );
}

interface Props {
  order: TOrder;
}

export default function OrderDetailsView({ order }: Props) {
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Dhaka",
    });

  const statusMeta =
    ORDER_STATUS_CONFIG[order.status as OrderStatus] ??
    ORDER_STATUS_CONFIG.PENDING;

  const paymentMethodLabel =
    order.paymentType === "cod"
      ? "Cash on Delivery"
      : order.provider || "Manual Payment";

  const fullAddress = `${order.address}, ${order.upazila}, ${order.district}`;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-3 md:p-5 shadow-sm ">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-bold text-slate-800">
            ORDER #{order.orderNumber}
          </p>
          <p className="mt-0.5 text-[12.5px] text-slate-400">
            Placed on: {formatDate(order.createdAt)}
          </p>
        </div>
        <span
          className={`flex-shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusMeta.className}`}
        >
          {statusMeta.label}
        </span>
      </div>

      {/* ── Stepper ── */}
      <OrderStepper status={order.status} />

      {/* ── Delivery Address ── */}
      <div className="mt-8 border-t border-slate-50 pt-5">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
          <MapPin className="h-4 w-4 text-[#0f3ea9]" />
          Delivery Address
        </div>
        <div className="mt-2.5 pl-6">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-medium text-slate-800">
              {order.customerName}
            </p>
            <CopyButton text={order.customerName} />
          </div>

          <div className="mt-0.5 flex items-center gap-1.5">
            <p className="text-sm text-slate-500">{fullAddress}</p>
            <CopyButton text={fullAddress} />
          </div>

          <div className="mt-1.5 flex items-center gap-1.5">
            <p className="flex items-center gap-1.5 text-sm text-[#0f3ea9]">
              <Phone className="h-3.5 w-3.5" />
              {order.customerPhone}
            </p>
            <CopyButton text={order.customerPhone} />
          </div>
        </div>
      </div>

      {/* ── Package Items ── */}
      <div className="mt-6 border-t border-slate-50 pt-5">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
          <PackageCheck className="h-4 w-4 text-[#0f3ea9]" />
          Package Items
        </div>

        <div className="mt-3 space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              {item.image ? (
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
              ) : (
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 text-slate-300">
                  <ImageOff className="h-4 w-4" strokeWidth={1.5} />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800">
                  {item.title}
                </p>
                <p className="text-xs text-slate-400">
                  {[item.selectedColor, item.selectedSize]
                    .filter(Boolean)
                    .join(" · ") || "No variants"}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  ৳{item.price.toLocaleString()} x {item.quantity}
                </p>
              </div>

              <p className="flex-shrink-0 text-sm font-semibold text-slate-700">
                ৳{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Price Breakdown ── */}
      <div className="mt-6 space-y-2 border-t border-slate-50 pt-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Subtotal</span>
          <span className="font-medium text-slate-700">
            ৳{order.subtotal.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Shipping Fee</span>
          <span className="font-medium text-slate-700">
            ৳{order.deliveryCharge.toLocaleString()}
          </span>
        </div>
        {order.discount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">
              Discount {order.couponCode ? `(${order.couponCode})` : ""}
            </span>
            <span className="font-medium text-emerald-600">
              -৳{order.discount.toLocaleString()}
            </span>
          </div>
        )}

        <div className="!mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-sm font-semibold text-slate-700">
            Total Amount
          </span>
          <span className="text-lg font-bold text-[#0f3ea9]">
            ৳{order.total.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1 text-sm">
          <span className="text-slate-400">Payment Method</span>
          <span className="font-medium text-slate-600">
            {paymentMethodLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
