"use client";

import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  getProductFlashSale,
  removeProductFlashSale,
  upsertProductFlashSale,
} from "@/services/products/flashSaleProducts.service";

export default function FlashSaleTab({ productId }: { productId: string }) {
  const [flashSaleStartDate, setFlashSaleStartDate] = useState("");
  const [flashSaleEndDate, setFlashSaleEndDate] = useState("");
  const [flashSale, setFlashSale] = useState<"yes" | "no">("yes");
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);

  // ✅ শুধু date আছে কিনা check করো
  const isFormValid = flashSaleStartDate && flashSaleEndDate;

  useEffect(() => {
    getProductFlashSale(productId)
      .then((data) => {
        if (!data) return;
        setFlashSaleStartDate(
          data.flashSaleStartDate
            ? new Date(data.flashSaleStartDate).toISOString().slice(0, 16)
            : "",
        );
        setFlashSaleEndDate(
          data.flashSaleEndDate
            ? new Date(data.flashSaleEndDate).toISOString().slice(0, 16)
            : "",
        );
        setFlashSale(data.flashSale ? "yes" : "no");
      })
      .catch(() => toast.error("Failed to load flash sale"));
  }, [productId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await upsertProductFlashSale(productId, {
        flashSaleStartDate,
        flashSaleEndDate,
        flashSale: flashSale === "yes",
        // ✅ discountPercentage বাদ
      });
      toast.success("Flash sale saved");
    } catch {
      toast.error("Failed to save flash sale");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    try {
      setRemoving(true);
      await removeProductFlashSale(productId);
      setFlashSaleStartDate("");
      setFlashSaleEndDate("");
      setFlashSale("yes");
      toast.success("Flash sale removed");
    } catch {
      toast.error("Failed to remove flash sale");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <form onSubmit={handleSave}>
      <Card>
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-base font-semibold text-slate-700">
            Flash Sale
          </CardTitle>
        </CardHeader>

        <CardContent className="py-6 space-y-6">
          {/* ✅ শুধু date fields — discount % field বাদ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Flash Sale Start Date <span className="text-red-500">*</span>
              </Label>
              <Input
                type="datetime-local"
                value={flashSaleStartDate}
                onChange={(e) => setFlashSaleStartDate(e.target.value)}
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Flash Sale End Date <span className="text-red-500">*</span>
              </Label>
              <Input
                type="datetime-local"
                value={flashSaleEndDate}
                onChange={(e) => setFlashSaleEndDate(e.target.value)}
                className="h-10 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Do You Want to Add in the Flash Sale?{" "}
              <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={flashSale}
              onValueChange={(v) => setFlashSale(v as "yes" | "no")}
              className="flex items-center gap-6 pt-1"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  value="yes"
                  id="flash_yes"
                  className="border-slate-300 text-orange-500 data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500"
                />
                <Label
                  htmlFor="flash_yes"
                  className="text-sm text-slate-600 cursor-pointer"
                >
                  Yes
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  value="no"
                  id="flash_no"
                  className="border-slate-300 text-orange-500 data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500"
                />
                <Label
                  htmlFor="flash_no"
                  className="text-sm text-slate-600 cursor-pointer"
                >
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={saving || !isFormValid}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Save
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={removing}
              onClick={handleRemove}
              className="gap-2 h-9 px-5"
            >
              {removing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Removing...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  Remove
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
