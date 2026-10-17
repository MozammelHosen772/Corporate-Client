import { Badge } from "@/components/ui/badge";
import { TOrder } from "@/services/orders/orders.service";
import { MapPin, Package } from "lucide-react";
import Image from "next/image";

import OrderStatusStepper from "./components/OrderStatusStepper";
import { ORDER_STATUS_STYLE } from "./constants/trackOrder.constants";

interface Props {
  order: TOrder;
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function OrderTrackingResult({ order }: Props) {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* ─── Header ────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between border-b border-slate-100 pb-4">
        <div>
          <p className="text-xs text-slate-400">Order ID</p>
          <p className="font-mono text-sm font-semibold text-slate-800">
            #{order.orderNumber}
          </p>
        </div>
        <Badge
          className={`border-0 font-semibold ${
            ORDER_STATUS_STYLE[order.status] || "bg-slate-100 text-slate-600"
          }`}
        >
          {order.status}
        </Badge>
      </div>

      {/* ─── Status Stepper ───────────────────────────────────────── */}
      <div className="py-2">
        <OrderStatusStepper status={order.status} />
      </div>

      {/* ─── Customer & Delivery Info ─────────────────────────────── */}
      <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
        <div className="text-xs text-slate-600">
          <p className="font-medium text-slate-800">{order.customerName}</p>
          <p className="mt-0.5">
            {order.address}, {order.upazila}, {order.district}
          </p>
          <p className="mt-0.5 text-slate-400">
            Ordered on {formatDate(order.createdAt)}
          </p>
        </div>
      </div>

      {/* ─── Items ─────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <Package className="h-3.5 w-3.5" />
          Items ({order.totalQuantity})
        </p>

        <div className="space-y-2">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-xl border border-slate-100 p-2"
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-700">
                  {item.title}
                </p>
                <p className="text-xs text-slate-400">
                  Qty: {item.quantity}
                  {item.selectedColor && ` · ${item.selectedColor}`}
                  {item.selectedSize && ` · ${item.selectedSize}`}
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold text-slate-700">
                ৳{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Payment Summary ──────────────────────────────────────── */}
      <div className="space-y-1.5 border-t border-slate-100 pt-4 text-sm">
        <div className="flex justify-between text-slate-500">
          <span>Subtotal</span>
          <span>৳{order.subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>Delivery</span>
          <span>
            {order.freeDelivery ? (
              <span className="text-emerald-600">Free</span>
            ) : (
              `৳${order.deliveryCharge.toLocaleString()}`
            )}
          </span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>Discount {order.couponCode && `(${order.couponCode})`}</span>
            <span>-৳{order.discount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-semibold">
          <span className="text-slate-800">Total</span>
          <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            ৳{order.total.toLocaleString()}
          </span>
        </div>
      </div>

      {/* ─── Payment Type ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 text-xs">
        <span className="text-slate-500">Payment Method</span>
        <span className="font-medium text-slate-700">
          {order.paymentType === "manual"
            ? order.provider || "Manual"
            : "Cash on Delivery"}
        </span>
      </div>
    </div>
  );
}
