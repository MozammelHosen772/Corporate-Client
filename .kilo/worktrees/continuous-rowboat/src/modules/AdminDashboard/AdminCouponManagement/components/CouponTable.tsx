"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TCoupon, TCouponMeta } from "@/services/coupon/coupon.service";
import { Loader2, Pencil, Trash2, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import CouponPagination from "./CouponPagination";

interface Props {
  coupons: TCoupon[];
  meta: TCouponMeta;
  isPending: boolean;
  deletingCouponId: string | null;
  togglingCouponId: string | null;
  onToggleStatus: (coupon: TCoupon) => void;
  onDelete: (coupon: TCoupon) => void;
}

const typeLabel: Record<TCoupon["type"], string> = {
  PERCENTAGE: "%",
  FIXED: "৳",
  FREE_DELIVERY: "🚚",
};

export default function CouponTable({
  coupons,
  meta,
  isPending,
  deletingCouponId,
  togglingCouponId,
  onToggleStatus,
  onDelete,
}: Props) {
  const router = useRouter();

  if (!coupons.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <p className="text-base font-medium">No coupons found</p>
        <p className="text-sm mt-1">Create your first coupon to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className={`rounded-xl border border-slate-200 overflow-hidden ${
          isPending ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Min Purchase</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell className="font-mono font-semibold text-slate-800">
                  {coupon.code}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="gap-1">
                    {coupon.type === "FREE_DELIVERY" ? (
                      <Truck className="w-3 h-3" />
                    ) : (
                      typeLabel[coupon.type]
                    )}{" "}
                    {coupon.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  {coupon.type === "FREE_DELIVERY" ? (
                    <span className="text-slate-500">— free delivery —</span>
                  ) : coupon.type === "PERCENTAGE" ? (
                    `${coupon.value}%`
                  ) : (
                    `৳${coupon.value.toLocaleString()}`
                  )}
                  {coupon.maxDiscount
                    ? ` (max ৳${coupon.maxDiscount.toLocaleString()})`
                    : ""}
                </TableCell>
                <TableCell>
                  {coupon.minOrderAmount > 0
                    ? `৳${coupon.minOrderAmount.toLocaleString()}`
                    : "No minimum"}
                </TableCell>
                <TableCell>
                  {coupon.usageCount}
                  {coupon.usageLimit ? ` / ${coupon.usageLimit}` : " / ∞"}
                </TableCell>
                <TableCell>
                  {coupon.expiresAt
                    ? new Date(coupon.expiresAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "No expiry"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {togglingCouponId === coupon.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                    ) : (
                      <Switch
                        checked={coupon.isActive}
                        onCheckedChange={() => onToggleStatus(coupon)}
                        disabled={isPending}
                      />
                    )}
                    <Badge
                      className={
                        coupon.isActive
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }
                    >
                      {coupon.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        router.push(
                          `/admin/dashboard/coupons-management/${coupon.id}/edit`,
                        )
                      }
                      disabled={isPending}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => onDelete(coupon)}
                      disabled={isPending || deletingCouponId === coupon.id}
                    >
                      {deletingCouponId === coupon.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CouponPagination meta={meta} />
    </div>
  );
}
