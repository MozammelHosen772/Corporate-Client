"use client";

import { TOrder } from "@/services/orders/orders.service";
import Image from "next/image";
import { useState } from "react";

const STATUS_CONFIG: Record<
  string,
  { label: string; className: string; step: number }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
    step: 1,
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "bg-blue-50 text-blue-700 border border-blue-200",
    step: 2,
  },
  PROCESSING: {
    label: "Processing",
    className: "bg-purple-50 text-purple-700 border border-purple-200",
    step: 3,
  },
  SHIPPED: {
    label: "Shipped",
    className: "bg-indigo-50 text-indigo-700 border border-indigo-200",
    step: 4,
  },
  DELIVERED: {
    label: "Delivered",
    className: "bg-green-50 text-green-700 border border-green-200",
    step: 5,
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-50 text-red-700 border border-red-200",
    step: 0,
  },
};

const PROGRESS_STEPS = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
];

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

function OrderProgress({ status }: { status: string }) {
  if (status === "CANCELLED") return null;
  const currentStep = STATUS_CONFIG[status]?.step ?? 1;

  return (
    <div className="mt-3 px-1">
      <div className="flex items-center gap-0">
        {PROGRESS_STEPS.map((step, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;

          return (
            <div key={step} className="flex flex-1 items-center">
              {/* dot */}
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div
                  className={`h-2.5 w-2.5 rounded-full border-2 transition-colors ${
                    isCompleted
                      ? "border-[#0f3ea9] bg-[#0f3ea9]"
                      : isActive
                        ? "border-[#0f3ea9] bg-white"
                        : "border-slate-200 bg-white"
                  }`}
                />
                <span
                  className={`text-[9px] whitespace-nowrap ${
                    isActive
                      ? "font-semibold text-[#0f3ea9]"
                      : isCompleted
                        ? "text-slate-400"
                        : "text-slate-300"
                  }`}
                >
                  {step}
                </span>
              </div>
              {/* connector */}
              {idx < PROGRESS_STEPS.length - 1 && (
                <div
                  className={`mb-3.5 h-[2px] flex-1 transition-colors ${
                    isCompleted ? "bg-[#0f3ea9]" : "bg-slate-100"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface Props {
  order: TOrder;
}

export default function UserOrderCard({ order }: Props) {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const firstItem = order.items[0];
  const extraCount = order.items.length - 1;

  return (
    <div className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md">
      {/* ── Header ── */}
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3">
        <div>
          <p className="font-mono text-[11px] text-slate-400">
            {order.orderNumber} {/* ← id slice বাদ, orderNumber সরাসরি */}
          </p>
          <p className="mt-0.5 text-[12px] text-slate-400">
            {formatDate(order.createdAt)}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* ── Progress bar ── */}
      <div className="px-4">
        <OrderProgress status={order.status} />
      </div>

      {/* ── Items preview ── */}
      <div className="mt-3 border-t border-slate-50 px-4 py-3">
        <div className="flex items-center gap-3">
          {/* product thumbnail */}
          {firstItem?.image ? (
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
              <Image
                src={firstItem.image}
                alt={firstItem.title}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
          ) : (
            <div className="h-14 w-14 flex-shrink-0 rounded-lg border border-slate-100 bg-slate-50" />
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-800">
              {firstItem?.title ?? "—"}
            </p>
            {firstItem?.selectedColor || firstItem?.selectedSize ? (
              <p className="mt-0.5 text-xs text-slate-400">
                {[firstItem.selectedColor, firstItem.selectedSize]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            ) : null}
            <p className="mt-0.5 text-xs text-slate-400">
              Qty: {firstItem?.quantity ?? 1}
            </p>
          </div>

          {extraCount > 0 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex-shrink-0 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors"
            >
              {expanded ? "Less" : `+${extraCount} more`}
            </button>
          )}
        </div>

        {/* expanded items */}
        {expanded && extraCount > 0 && (
          <div className="mt-3 space-y-3 border-t border-slate-50 pt-3">
            {order.items.slice(1).map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                {item.image ? (
                  <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                ) : (
                  <div className="h-10 w-10 flex-shrink-0 rounded-lg border border-slate-100 bg-slate-50" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-slate-700">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-400">
                    {[item.selectedColor, item.selectedSize]
                      .filter(Boolean)
                      .join(" · ") || `Qty: ${item.quantity}`}
                  </p>
                </div>
                <p className="flex-shrink-0 text-sm font-medium text-slate-700">
                  ৳{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      {/* ── Footer ── */}
      <div className="flex items-center justify-between border-t border-slate-50 bg-slate-50/50 px-4 py-3">
        <div className="text-xs text-slate-400 space-y-0.5">
          <p>
            {order.totalQuantity} item{order.totalQuantity > 1 ? "s" : ""} ·{" "}
            {order.paymentType === "manual"
              ? (order.provider ?? "Manual Payment")
              : "Cash on Delivery"}
          </p>
          {order.deliveryCharge === 0 ? (
            <p className="text-green-600">Free delivery</p>
          ) : (
            <p>Delivery: ৳{order.deliveryCharge.toLocaleString()}</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-[11px] text-slate-400">Total</p>
          <p className="text-base font-bold text-[#0f3ea9]">
            ৳{order.total.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
