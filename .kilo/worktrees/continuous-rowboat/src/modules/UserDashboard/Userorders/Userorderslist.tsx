"use client";

import { TOrder, TOrderStatus } from "@/services/orders/orders.service";
import { PackageSearch, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import UserOrderCard from "./components/Userordercard";

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
  const [query, setQuery] = useState("");

  const countFor = (val: TOrderStatus | "ALL") =>
    val === "ALL"
      ? orders.length
      : orders.filter((o) => o.status === val).length;

  const filtered = useMemo(() => {
    let list =
      activeTab === "ALL"
        ? orders
        : orders.filter((o) => o.status === activeTab);

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.items.some((item) => item.title.toLowerCase().includes(q)),
      );
    }

    return list;
  }, [orders, activeTab, query]);

  // ── No orders at all — first-time empty state ──────────────────────────
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
          <PackageSearch className="h-7 w-7 text-slate-400" strokeWidth={1.5} />
        </div>
        <p className="text-base font-medium text-slate-700">No orders yet</p>
        <p className="mt-1 text-sm text-slate-400">
          Your orders will appear here once you place one.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* ── Search ── */}
      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-350" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by order number or product"
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-9 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-colors focus:border-[#0f3ea9] focus:ring-2 focus:ring-[#0f3ea9]/10"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-350 hover:text-slate-500"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ── Status tabs ── */}
      <div className="scrollbar-none mb-4 flex gap-1.5 overflow-x-auto pb-1">
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
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-14 text-center">
          <PackageSearch
            className="mb-3 h-8 w-8 text-slate-300"
            strokeWidth={1.5}
          />
          <p className="text-sm font-medium text-slate-600">
            {query
              ? "No orders match your search"
              : `No ${activeTab.toLowerCase()} orders`}
          </p>
          {query && (
            <button
              onClick={() => setQuery("")}
              className="mt-2 text-xs font-medium text-[#0f3ea9] hover:underline"
            >
              Clear search
            </button>
          )}
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
