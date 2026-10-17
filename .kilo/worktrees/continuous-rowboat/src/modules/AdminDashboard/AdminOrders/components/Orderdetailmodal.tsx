"use client";

import { TOrder } from "@/services/orders/orders.service";
import Image from "next/image";
import OrderStatusBadge from "./OrderStatusBadge";

interface Props {
  order: TOrder;
  onClose: () => void;
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-slate-50 last:border-0">
      <span className="text-xs text-slate-400 shrink-0 w-28">{label}</span>
      <span className="text-xs font-medium text-slate-700 text-right break-all">
        {value}
      </span>
    </div>
  );
}

export default function OrderDetailModal({ order, onClose }: Props) {
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // ✅ TOrder type e field name "discount" (couponDiscount na) — discount thakle-i row dekhabe
  const discountAmount = order.discount ?? 0;
  const hasDiscount = discountAmount > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              Order Details
            </h2>
            <p className="mt-0.5 font-mono text-[11px] text-black font-bold">
              {order.orderNumber.toUpperCase()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <OrderStatusBadge status={order.status} />
            <button
              onClick={onClose}
              aria-label="Close"
              className="ml-1 flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 1l12 12M13 1L1 13"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-5 py-4 space-y-5">
          {/* ── Customer Info ── */}
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Customer Information
            </p>
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-1">
              <InfoRow label="Full Name" value={order.customerName} />
              <InfoRow label="Phone" value={order.customerPhone} />
              <InfoRow label="District" value={order.district} />
              <InfoRow label="Upazila" value={order.upazila} />
              <InfoRow label="Address" value={order.address} />
              {order.notes && <InfoRow label="Notes" value={order.notes} />}
            </div>
          </div>

          {/* ── Order Info ── */}
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Order Information
            </p>
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-1">
              <InfoRow
                label="Payment"
                value={
                  order.paymentMethodId === "bkash"
                    ? "bKash"
                    : "Cash on Delivery"
                }
              />
              <InfoRow label="Placed At" value={formatDate(order.createdAt)} />
              <InfoRow
                label="Last Updated"
                value={formatDate(order.updatedAt)}
              />
            </div>
          </div>

          {/* ── Ordered Items ── */}
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Ordered Items ({order.totalQuantity} items)
            </p>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
                >
                  {/* thumbnail */}
                  {item.image ? (
                    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                  ) : (
                    <div className="h-14 w-14 flex-shrink-0 rounded-lg border border-slate-200 bg-slate-100" />
                  )}

                  {/* info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {item.title}
                    </p>
                    <div className="mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5 text-[11px] text-slate-400">
                      {item.selectedColor && (
                        <span>Color: {item.selectedColor}</span>
                      )}
                      {item.selectedSize && (
                        <span>Size: {item.selectedSize}</span>
                      )}
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>

                  {/* price */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-slate-800">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      ৳{item.price.toLocaleString()} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {order.paymentType === "manual" && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-1.5">
              <p className="text-xs font-semibold text-slate-500 uppercase">
                Manual Payment Info
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-slate-400 text-xs">Provider</span>
                  <p className="font-medium text-slate-700">
                    {order.provider || "-"}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 text-xs">Received On</span>
                  <p className="font-mono text-slate-700">
                    {order.receivingAccountNumber || "-"}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 text-xs">Sender Number</span>
                  <p className="font-mono text-slate-700">
                    {order.senderNumber || "-"}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 text-xs">Transaction ID</span>
                  <p className="font-mono text-slate-700">
                    {order.transactionId || "-"}
                  </p>
                </div>
              </div>
            </div>
          )}
          {/* ── Price Summary ── */}
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Price Summary
            </p>
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 space-y-2">
              {/* Product Price */}
              <div className="flex justify-between text-xs text-slate-500">
                <span>Product Price</span>
                <span className="font-medium text-slate-700">
                  ৳{order.subtotal.toLocaleString()}
                </span>
              </div>

              {/* Delivery Charge */}
              <div className="flex justify-between text-xs text-slate-500">
                <span>Delivery Charge</span>
                {order.deliveryCharge === 0 ? (
                  <span className="font-medium text-green-600">
                    {order.freeDelivery ? "Free (Coupon)" : "Free"}
                  </span>
                ) : (
                  <span className="font-medium text-slate-700">
                    ৳{order.deliveryCharge.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Discount — coupon thakle-i dekhabe */}
              {hasDiscount && (
                <div className="flex justify-between text-xs text-slate-500">
                  <span>
                    Discount
                    {order.couponCode ? ` (${order.couponCode})` : ""}
                  </span>
                  <span className="font-medium text-emerald-600">
                    -৳{discountAmount.toLocaleString()}
                  </span>
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold">
                <span className="text-slate-800">Total Price</span>
                <span className="text-[#0f3ea9]">
                  ৳{order.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
