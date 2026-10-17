"use client";

import { TOrder } from "@/services/orders/orders.service";
import {
  ORDER_STATUS_OPTIONS,
  OrderStatus,
} from "../constants/order.constants";
import OrderStatusBadge from "./OrderStatusBadge";

interface Props {
  order: TOrder;
  onConfirm: (newStatus: OrderStatus) => void;
  onCancel: () => void;
}

export default function OrderStatusModal({
  order,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-1 text-base font-semibold text-slate-800">
          Update order status
        </h2>
        <p className="mb-4 font-mono text-xs text-slate-400">
          #{order.orderNumber}… — {order.customerName}
        </p>

        <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
          <span>Current:</span>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {ORDER_STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              disabled={opt.value === order.status}
              onClick={() => onConfirm(opt.value)}
              className={`rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                opt.value === order.status
                  ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
                  : "border-slate-200 text-slate-700 hover:border-[#0f3ea9] hover:bg-blue-50 hover:text-[#0f3ea9]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <button
          onClick={onCancel}
          className="mt-4 w-full rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
