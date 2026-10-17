/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getProductShipping,
  IUpsertShippingPayload,
  upsertProductShipping,
} from "@/services/products/productsShipping.service";
import TiptapEditor from "@/shared/tiptapEditor/tip-tap-editor";
import { Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ShippingTab({ productId }: { productId: string }) {
  const [shippingType, setShippingType] = useState<"free" | "flat_rate">(
    "flat_rate",
  );
  const [shippingCost, setShippingCost] = useState("80.00");
  const [isQuantityMultiply, setIsQuantityMultiply] = useState<"yes" | "no">(
    "no",
  );
  const [returnPolicy, setReturnPolicy] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ─── Fetch existing shipping on mount ─────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    getProductShipping(productId)
      .then((data) => {
        if (cancelled) return;
        if (data) {
          setShippingType(data.shippingType);
          setShippingCost(data.shippingCost.toFixed(2));
          setIsQuantityMultiply(data.isQuantityMultiply ? "yes" : "no");
          setReturnPolicy(data.returnPolicy ?? "");
        }
      })
      .catch(() => toast.error("Failed to load shipping info"))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  // ─── Save (create or update via upsert) ───────────────────────────────────
  const handleSave = async () => {
    try {
      setSaving(true);

      const payload: IUpsertShippingPayload = {
        shippingType,
        shippingCost: shippingType === "free" ? 0 : Number(shippingCost),
        isQuantityMultiply: isQuantityMultiply === "yes",
        returnPolicy: returnPolicy || undefined,
      };

      await upsertProductShipping(productId, payload);
      toast.success("Shipping & Return saved");
    } catch (error: any) {
      toast.error(error.message || "Failed to save shipping");
    } finally {
      setSaving(false);
    }
  };

  // ─── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <Shield className="h-4 w-4 text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-700">
            Shipping & Return
          </h2>
        </div>
        <div className="px-6 py-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-10 w-48" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
        <Shield className="h-4 w-4 text-slate-500" />
        <h2 className="text-sm font-semibold text-slate-700">
          Shipping & Return
        </h2>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Row 1: Shipping Type + Shipping Cost */}
        <div className="grid grid-cols-2 gap-6">
          {/* Shipping Type */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Shipping Type <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={shippingType}
              onValueChange={(v) => setShippingType(v as "free" | "flat_rate")}
              className="flex items-center gap-6 pt-1"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  value="free"
                  id="free"
                  className="text-orange-500 border-slate-300 data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500"
                />
                <Label
                  htmlFor="free"
                  className="text-sm text-slate-600 cursor-pointer"
                >
                  Free
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  value="flat_rate"
                  id="flat_rate"
                  className="text-orange-500 border-slate-300 data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500"
                />
                <Label
                  htmlFor="flat_rate"
                  className="text-sm text-slate-600 cursor-pointer"
                >
                  Flat Rate
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Shipping Cost */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Shipping Cost <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              value={shippingType === "free" ? "0.00" : shippingCost}
              onChange={(e) => setShippingCost(e.target.value)}
              disabled={shippingType === "free"}
              className="h-10 text-sm disabled:bg-slate-50 disabled:text-slate-400"
              placeholder="0.00"
              min={0}
            />
          </div>
        </div>

        {/* Row 2: Is Product Quantity Multiply */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Is Product Quantity Multiply <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={isQuantityMultiply}
            onValueChange={(v) => setIsQuantityMultiply(v as "yes" | "no")}
            className="flex items-center gap-6 pt-1"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem
                value="yes"
                id="qty_yes"
                className="text-orange-500 border-slate-300 data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500"
              />
              <Label
                htmlFor="qty_yes"
                className="text-sm text-slate-600 cursor-pointer"
              >
                Yes
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem
                value="no"
                id="qty_no"
                className="text-orange-500 border-slate-300 data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500"
              />
              <Label
                htmlFor="qty_no"
                className="text-sm text-slate-600 cursor-pointer"
              >
                No
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Row 3: Shipping & Return Policy (Tiptap) */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Shipping & Return Policy
          </Label>
          <TiptapEditor
            value={returnPolicy}
            onChange={setReturnPolicy}
            minHeight="220px"
            maxHeight="520px"
            showWordCount
            showCharacterCount
          />
        </div>

        {/* Save Button */}
        <div className="pt-2 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-orange-500 hover:bg-orange-600 text-white gap-2 h-9 px-5"
          >
            <Shield className="h-4 w-4" />
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
