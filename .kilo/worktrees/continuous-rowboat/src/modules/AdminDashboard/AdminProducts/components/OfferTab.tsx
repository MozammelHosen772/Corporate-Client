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
  getProductOffer,
  removeProductOffer,
  upsertProductOffer,
} from "@/services/products/offerProducts.service";

export default function OfferTab({ productId }: { productId: string }) {
  const [offerStartDate, setOfferStartDate] = useState("");
  const [offerEndDate, setOfferEndDate] = useState("");
  // ✅ discountPercentage state বাদ
  const [offerSale, setOfferSale] = useState<"yes" | "no">("yes");
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);

  // ✅ শুধু date check
  const isFormValid = offerStartDate && offerEndDate;

  useEffect(() => {
    getProductOffer(productId)
      .then((data) => {
        if (!data) return;
        setOfferStartDate(
          data.offerStartDate
            ? new Date(data.offerStartDate).toISOString().slice(0, 16)
            : "",
        );
        setOfferEndDate(
          data.offerEndDate
            ? new Date(data.offerEndDate).toISOString().slice(0, 16)
            : "",
        );
        // ✅ discountPercentage set বাদ
        setOfferSale(data.offerSale ? "yes" : "no");
      })
      .catch(() => toast.error("Failed to load offer"));
  }, [productId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await upsertProductOffer(productId, {
        offerStartDate,
        offerEndDate,
        // ✅ discountPercentage বাদ
        offerSale: offerSale === "yes",
      });
      toast.success("Offer saved");
    } catch {
      toast.error("Failed to save offer");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    try {
      setRemoving(true);
      await removeProductOffer(productId);
      setOfferStartDate("");
      setOfferEndDate("");
      // ✅ discountPercentage reset বাদ
      setOfferSale("yes");
      toast.success("Offer removed");
    } catch {
      toast.error("Failed to remove offer");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <form onSubmit={handleSave}>
      <Card>
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-base font-semibold text-slate-700">
            Offer
          </CardTitle>
        </CardHeader>

        <CardContent className="py-6 space-y-6">
          {/* ✅ শুধু date fields — discount % বাদ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Offer Start Date <span className="text-red-500">*</span>
              </Label>
              <Input
                type="datetime-local"
                value={offerStartDate}
                onChange={(e) => setOfferStartDate(e.target.value)}
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Offer End Date <span className="text-red-500">*</span>
              </Label>
              <Input
                type="datetime-local"
                value={offerEndDate}
                onChange={(e) => setOfferEndDate(e.target.value)}
                className="h-10 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Do You Want to Add in the Offer Sale?{" "}
              <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={offerSale}
              onValueChange={(v) => setOfferSale(v as "yes" | "no")}
              className="flex items-center gap-6 pt-1"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  value="yes"
                  id="offer_yes"
                  className="border-slate-300 text-orange-500 data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500"
                />
                <Label
                  htmlFor="offer_yes"
                  className="text-sm text-slate-600 cursor-pointer"
                >
                  Yes
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  value="no"
                  id="offer_no"
                  className="border-slate-300 text-orange-500 data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500"
                />
                <Label
                  htmlFor="offer_no"
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
