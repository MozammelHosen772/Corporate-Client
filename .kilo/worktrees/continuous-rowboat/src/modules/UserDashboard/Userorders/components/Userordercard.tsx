"use client";

import { TOrder } from "@/services/orders/orders.service";
import { ImageOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ORDER_STATUS_CONFIG } from "../constants/Userorder.contant";

interface Props {
  order: TOrder;
}

export default function UserOrderCard({ order }: Props) {
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
    ORDER_STATUS_CONFIG[order.status as keyof typeof ORDER_STATUS_CONFIG] ??
    ORDER_STATUS_CONFIG.PENDING;

  const firstItem = order.items[0];
  const extraCount = order.items.length - 1;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800">
            Order ID: #{order.orderNumber}
          </p>
          <p className="mt-0.5 text-[12px] text-slate-400">
            Placed on: {formatDate(order.createdAt)}
          </p>
        </div>
        <Link
          href={`/dashboard/my-order/${order.orderNumber}`}
          className="flex-shrink-0 text-[13px] font-medium text-[#0f3ea9] hover:underline"
        >
          View Details
        </Link>
      </div>

      {/* ── Item preview ── */}
      <div className="flex items-center gap-3 border-t border-slate-50 px-4 py-3">
        {firstItem?.image ? (
          <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
            <Image
              src={firstItem.image}
              alt={firstItem.title}
              fill
              className="object-cover"
              sizes="56px"
            />
          </div>
        ) : (
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-300">
            <ImageOff className="h-5 w-5" strokeWidth={1.5} />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-800">
            {firstItem?.title ?? "—"}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            ৳{firstItem?.price.toLocaleString()} x {firstItem?.quantity ?? 1}
            {extraCount > 0 && (
              <span className="ml-1 text-slate-350">+{extraCount} more</span>
            )}
          </p>
        </div>

        <span
          className={`flex-shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusMeta.className}`}
        >
          {statusMeta.label}
        </span>
      </div>

      {/* ── Total ── */}
      <div className="flex items-center justify-between border-t border-slate-50 bg-slate-50/60 px-4 py-3">
        <p className="text-[12px] font-medium text-slate-500">TOTAL AMOUNT</p>
        <p className="text-base font-bold text-[#0f3ea9]">
          ৳{order.total.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
