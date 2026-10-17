import {
  Ban,
  CheckCircle2,
  Clock,
  Package,
  PackageCheck,
  Truck,
} from "lucide-react";

// ─── Order Status ───────────────────────────────────────────────────────────

export const ORDER_STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
    dotClassName: "bg-amber-500",
    icon: Clock,
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "bg-blue-50 text-blue-700 border border-blue-200",
    dotClassName: "bg-blue-500",
    icon: CheckCircle2,
  },
  PROCESSING: {
    label: "Processing",
    className: "bg-purple-50 text-purple-700 border border-purple-200",
    dotClassName: "bg-purple-500",
    icon: Package,
  },
  SHIPPED: {
    label: "Shipped",
    className: "bg-indigo-50 text-indigo-700 border border-indigo-200",
    dotClassName: "bg-indigo-500",
    icon: Truck,
  },
  DELIVERED: {
    label: "Delivered",
    className: "bg-green-50 text-green-700 border border-green-200",
    dotClassName: "bg-green-500",
    icon: PackageCheck,
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-50 text-red-700 border border-red-200",
    dotClassName: "bg-red-500",
    icon: Ban,
  },
} as const;

export type OrderStatus = keyof typeof ORDER_STATUS_CONFIG;

export const ORDER_STATUS_OPTIONS = Object.entries(ORDER_STATUS_CONFIG).map(
  ([value, { label }]) => ({ value: value as OrderStatus, label }),
);

// ── order ja normal flow-e follow kore (UI-te sequential step dekhate hole) ──
export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

// ── kon status theke kon status-e jawa jabe (invalid transition UI-te disable korar jonno) ──
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

export function getAllowedNextStatuses(current: OrderStatus): OrderStatus[] {
  return ORDER_STATUS_TRANSITIONS[current];
}

// ─── Payment Type ───────────────────────────────────────────────────────────

export const PAYMENT_TYPE_CONFIG = {
  cod: {
    label: "Cash on Delivery",
    shortLabel: "COD",
    className: "bg-slate-100 text-slate-600 border border-slate-200",
  },
  manual: {
    label: "Manual Payment",
    shortLabel: "Manual",
    className: "bg-pink-50 text-pink-700 border border-pink-200",
  },
} as const;

export type PaymentType = keyof typeof PAYMENT_TYPE_CONFIG;

export const PAYMENT_TYPE_OPTIONS = Object.entries(PAYMENT_TYPE_CONFIG).map(
  ([value, { label }]) => ({ value: value as PaymentType, label }),
);

// ─── Payment Status ─────────────────────────────────────────────────────────

export const PAYMENT_STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
    dotClassName: "bg-amber-500",
  },
  PAID: {
    label: "Paid",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dotClassName: "bg-emerald-500",
  },
  FAILED: {
    label: "Failed",
    className: "bg-red-50 text-red-700 border border-red-200",
    dotClassName: "bg-red-500",
  },
  REFUNDED: {
    label: "Refunded",
    className: "bg-slate-100 text-slate-600 border border-slate-200",
    dotClassName: "bg-slate-400",
  },
} as const;

export type PaymentStatus = keyof typeof PAYMENT_STATUS_CONFIG;

export const PAYMENT_STATUS_OPTIONS = Object.entries(PAYMENT_STATUS_CONFIG).map(
  ([value, { label }]) => ({ value: value as PaymentStatus, label }),
);
export const ORDER_STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
};
