"use client";

import { TOrder, TOrderStatus } from "@/services/orders/orders.service";
import { PackageOpen, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import UserOrderCard from "./components/UserOrderCard";

const TABS: { label: string; value: TOrderStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];

interface Props {
  orders: TOrder[];
}

export default function UserOrdersList({ orders }: Props) {
  const [activeTab, setActiveTab] = useState<TOrderStatus | "ALL">("ALL");

  const filtered =
    activeTab === "ALL" ? orders : orders.filter((o) => o.status === activeTab);

  // count per tab
  const countFor = (val: TOrderStatus | "ALL") =>
    val === "ALL"
      ? orders.length
      : orders.filter((o) => o.status === val).length;

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 ring-1 ring-orange-100">
          <PackageOpen className="h-7 w-7 text-orange-400" strokeWidth={1.5} />
        </div>
        <p className="text-base font-semibold text-slate-700">No orders yet</p>
        <p className="mt-1 max-w-[240px] text-sm text-slate-400">
          Your orders will appear here once you place one
        </p>
        <Link
          href="/shop"
          className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 px-5 py-2.5 text-xs font-bold text-white transition-all hover:from-orange-600 hover:to-red-600"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* ── Status tabs ── */}
      <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {TABS.map((tab) => {
          const count = countFor(tab.value);
          if (count === 0 && tab.value !== "ALL") return null;
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex flex-shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                isActive
                  ? "border-[#0f3ea9] bg-[#0f3ea9] text-white"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Order cards ── */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center text-sm text-slate-400">
          No {activeTab.toLowerCase()} orders.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <UserOrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
