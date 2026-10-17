/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  TCoupon,
  TCouponType,
  createCoupon,
  updateCoupon,
} from "@/services/coupon/coupon.service";
import { Loader2, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface Props {
  coupon?: TCoupon; // edit mode এ pass করো
}

export default function CouponForm({ coupon }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    code: coupon?.code ?? "",
    type: (coupon?.type ?? "PERCENTAGE") as TCouponType,
    value: coupon?.value?.toString() ?? "",
    minOrderAmount: coupon?.minOrderAmount?.toString() ?? "0",
    maxDiscount: coupon?.maxDiscount?.toString() ?? "",
    usageLimit: coupon?.usageLimit?.toString() ?? "",
    expiresAt: coupon?.expiresAt
      ? new Date(coupon.expiresAt).toISOString().split("T")[0]
      : "",
    isActive: coupon?.isActive ?? true,
  });

  const isFreeDelivery = form.type === "FREE_DELIVERY";

  const handleSubmit = () => {
    if (!form.code.trim()) return toast.error("Coupon code is required");
    if (!isFreeDelivery && !form.value)
      return toast.error("Discount value is required");

    startTransition(async () => {
      try {
        const payload = {
          code: form.code.trim().toUpperCase(),
          type: form.type,
          value: isFreeDelivery ? 0 : Number(form.value),
          minOrderAmount: Number(form.minOrderAmount) || 0,
          maxDiscount:
            !isFreeDelivery && form.maxDiscount
              ? Number(form.maxDiscount)
              : undefined,
          usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
          expiresAt: form.expiresAt || undefined,
          isActive: form.isActive,
        };

        if (coupon) {
          await updateCoupon(coupon.id, payload);
          toast.success("Coupon updated successfully");
        } else {
          await createCoupon(payload);
          toast.success("Coupon created successfully");
        }

        router.push("/admin/dashboard/coupons-management");
        router.refresh();
      } catch (err: any) {
        toast.error(err.message || "Something went wrong");
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <Tag className="w-4 h-4" />
          {coupon ? "Edit Coupon" : "Create Coupon"}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Code */}
          <div className="space-y-1.5">
            <Label>
              Coupon Code <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="e.g. EID50"
              value={form.code}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  code: e.target.value.toUpperCase(),
                }))
              }
            />
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <Label>
              Discount Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={form.type}
              onValueChange={(val) =>
                setForm((f) => ({ ...f, type: val as TCouponType }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                <SelectItem value="FIXED">Fixed Amount (৳)</SelectItem>
                <SelectItem value="FREE_DELIVERY">Free Delivery</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Value — hidden for FREE_DELIVERY */}
          {!isFreeDelivery && (
            <div className="space-y-1.5">
              <Label>
                {form.type === "PERCENTAGE" ? "Discount (%)" : "Discount (৳)"}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                placeholder={
                  form.type === "PERCENTAGE" ? "e.g. 10" : "e.g. 100"
                }
                value={form.value}
                onChange={(e) =>
                  setForm((f) => ({ ...f, value: e.target.value }))
                }
              />
            </div>
          )}

          {/* Min Purchase Amount — always visible, applies to all types */}
          <div className="space-y-1.5">
            <Label>Minimum Purchase Amount (৳)</Label>
            <Input
              type="number"
              placeholder="e.g. 500"
              value={form.minOrderAmount}
              onChange={(e) =>
                setForm((f) => ({ ...f, minOrderAmount: e.target.value }))
              }
            />
            <p className="text-xs text-slate-400">
              Order total must be at least this amount for the coupon to work.
              Leave 0 for no minimum.
            </p>
          </div>

          {/* Max Discount — শুধু percentage এর জন্য */}
          {form.type === "PERCENTAGE" && (
            <div className="space-y-1.5">
              <Label>Max Discount (৳) — optional</Label>
              <Input
                type="number"
                placeholder="e.g. 200"
                value={form.maxDiscount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, maxDiscount: e.target.value }))
                }
              />
            </div>
          )}

          {/* Usage Limit */}
          <div className="space-y-1.5">
            <Label>Usage Limit — optional (blank = unlimited)</Label>
            <Input
              type="number"
              placeholder="e.g. 100"
              value={form.usageLimit}
              onChange={(e) =>
                setForm((f) => ({ ...f, usageLimit: e.target.value }))
              }
            />
          </div>

          {/* Expires At */}
          <div className="space-y-1.5">
            <Label>Expiry Date — optional</Label>
            <Input
              type="date"
              value={form.expiresAt}
              onChange={(e) =>
                setForm((f) => ({ ...f, expiresAt: e.target.value }))
              }
            />
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3 pt-6">
            <Switch
              checked={form.isActive}
              onCheckedChange={(val) =>
                setForm((f) => ({ ...f, isActive: val }))
              }
            />
            <Label>{form.isActive ? "Active" : "Inactive"}</Label>
          </div>
        </div>

        {isFreeDelivery && (
          <p className="text-sm text-blue-600 bg-blue-50 border border-blue-100 rounded-md px-3 py-2">
            This coupon won&apos;t discount the order total — it will make
            delivery free when applied.
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-[#0f3ea9] hover:bg-[#0c2d7a]"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : coupon ? (
              "Update Coupon"
            ) : (
              "Create Coupon"
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/admin/coupons")}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
