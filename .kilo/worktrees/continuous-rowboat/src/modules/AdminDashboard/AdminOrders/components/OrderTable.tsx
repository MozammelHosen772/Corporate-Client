"use client";

import {
  getOrderInvoicePdfBase64,
  TOrder,
} from "@/services/orders/orders.service";
import { Eye, FileText, Loader2, PackageOpen, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ORDER_STATUS_STYLE } from "../constants/order.constants";

// ─── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  orders: TOrder[];
  meta: { total: number; page: number; limit: number; totalPages: number };
  isPending: boolean;
  deletingOrderId: string | null;
  onView: (order: TOrder) => void;
  onStatusChange: (order: TOrder) => void;
  onDelete: (order: TOrder) => void;
  onViewPayment: (order: TOrder) => void;
}

// ─── Page Numbers Helper ────────────────────────────────────────────────────

const getPageNumbers = (current: number, total: number) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3)
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

// ─── base64 → Blob helper (PDF binary safely convert করার জন্য) ──────────────

const base64ToBlob = (base64: string, mimeType = "application/pdf") => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

// ─── Component ─────────────────────────────────────────────────────────────────

export default function OrderTable({
  orders,
  meta,
  isPending,
  deletingOrderId,
  onView,
  onStatusChange,
  onDelete,
  onViewPayment,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [activePage, setActivePage] = useState<number | null>(null);
  const [loadingInvoiceId, setLoadingInvoiceId] = useState<string | null>(null);

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    setActivePage(page);
    startTransition(() => {
      router.push(`?${params.toString()}`);
      setActivePage(null);
    });
  };

  // ── Invoice PDF — order-এর status যাই হোক না কেন, সবসময় on-demand ─────
  // backend থেকে জেনারেট হয়ে আসে (কোনো disk save নেই)। base64 আসে server
  // action থেকে (auth token সহ), এখানে Blob বানিয়ে নতুন ট্যাবে ওপেন করা হচ্ছে।
  const handleViewInvoice = async (order: TOrder) => {
    setLoadingInvoiceId(order.id);
    try {
      const { base64 } = await getOrderInvoicePdfBase64(order.id);
      const blob = base64ToBlob(base64);
      const url = URL.createObjectURL(blob);

      window.open(url, "_blank");
      // কিছুক্ষণ পর object URL মুক্ত করে দেওয়া হচ্ছে
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load invoice",
      );
    } finally {
      setLoadingInvoiceId(null);
    }
  };

  const isTableLoading = isPending || activePage !== null;

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* ─── Loading Overlay ───────────────────────────────────────────────── */}
      {isTableLoading && (
        <div
          role="status"
          aria-live="polite"
          aria-busy="true"
          className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/60 backdrop-blur-[2px]"
        >
          <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 shadow-md ring-1 ring-slate-200">
            <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
            <span className="text-sm font-medium text-slate-600">
              Loading...
            </span>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100">
              <th className="px-4 py-3 text-left">Order ID</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Location</th>
              <th className="px-4 py-3 text-left">Items</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Payment</th>
              <th className="px-4 py-3 text-left">Order Status</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-16">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                      <PackageOpen className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700">
                      No Orders Found
                    </h3>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-400">
                      There are currently no orders available.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const isDeleting = deletingOrderId === order.id;

                return (
                  <tr
                    key={order.id}
                    className={`border-b border-slate-100 transition-colors ${
                      isDeleting
                        ? "bg-red-50/60 opacity-60"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    {/* Order ID */}
                    <td className="px-4 py-3">
                      <span
                        className="block font-mono text-xs text-slate-400"
                        title={order.orderNumber}
                      >
                        #{order.orderNumber}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-700">
                        {order.customerName}
                      </div>
                      <div className="text-xs text-slate-400">
                        {order.customerPhone}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-3 text-xs text-slate-500">
                      <div>{order.district}</div>
                      <div className="text-slate-400">{order.upazila}</div>
                    </td>

                    {/* Items */}
                    <td className="px-4 py-3 text-slate-600">
                      {order.totalQuantity}{" "}
                      <span className="text-xs text-slate-400">items</span>
                    </td>

                    {/* Total */}
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      ৳{order.total.toLocaleString()}
                    </td>

                    {/* Payment */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col gap-1">
                          <span className="w-fit rounded-md border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                            {order.paymentType === "manual"
                              ? order.provider || "Manual"
                              : "COD"}
                          </span>
                          {order.paymentType === "manual" && (
                            <span
                              className={`w-fit rounded-md px-2 py-0.5 text-[11px] font-medium ${
                                order.paymentStatus === "PAID"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : order.paymentStatus === "FAILED"
                                    ? "bg-red-100 text-red-700"
                                    : order.paymentStatus === "REFUNDED"
                                      ? "bg-slate-100 text-slate-600"
                                      : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {order.paymentStatus}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => onViewPayment(order)}
                          disabled={isDeleting}
                          aria-label="View payment details"
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <FileText className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Order Status */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onStatusChange(order)}
                        disabled={isDeleting}
                      >
                        <span
                          className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                            ORDER_STATUS_STYLE[order.status] ||
                            "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {order.status}
                        </span>
                      </button>
                    </td>

                    {/* Date */}
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-400">
                      {formatDate(order.createdAt)}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onView(order)}
                          disabled={isDeleting}
                          aria-label="View order details"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {/* Invoice — BookingTable-এর মতোই server action দিয়ে
                            base64 এনে blob বানিয়ে নতুন ট্যাবে খোলা হচ্ছে,
                            যাতে auth token ঠিকভাবে attach হয় (401 এড়াতে) */}
                        <button
                          onClick={() => handleViewInvoice(order)}
                          disabled={isDeleting || loadingInvoiceId === order.id}
                          title="View / download invoice PDF"
                          aria-label="View invoice"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-sky-600 hover:bg-sky-50 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {loadingInvoiceId === order.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <FileText className="h-4 w-4" />
                          )}
                        </button>

                        <button
                          disabled={isDeleting || isTableLoading}
                          onClick={() => onDelete(order)}
                          aria-label="Delete order"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
                        >
                          {isDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin text-red-400" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ─── Pagination (অপরিবর্তিত) ─────────────────────────────────────── */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 px-2 md:px-4 py-3">
          <span className="text-xs text-slate-400">
            Showing {(meta.page - 1) * meta.limit + 1}–
            {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
            orders
          </span>

          <div className="flex items-center gap-1">
            <button
              disabled={meta.page <= 1 || activePage !== null}
              onClick={() => goToPage(meta.page - 1)}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {getPageNumbers(meta.page, meta.totalPages).map((page, idx) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="flex h-7 w-7 items-center justify-center text-xs text-slate-400"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  disabled={activePage !== null}
                  onClick={() => goToPage(page as number)}
                  className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-medium transition-colors disabled:cursor-not-allowed ${
                    page === meta.page
                      ? "bg-orange-500 text-white shadow-sm"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {activePage === page ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    page
                  )}
                </button>
              ),
            )}

            <button
              disabled={meta.page >= meta.totalPages || activePage !== null}
              onClick={() => goToPage(meta.page + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
