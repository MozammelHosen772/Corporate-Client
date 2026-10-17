/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import {
  getProductSeo,
  upsertProductSeo,
} from "@/services/products/Productsseo.service";
import SeoMetaDataPage, { SeoValues } from "@/shared/seoMetaData/SeoMetaData";

export default function SeoTab({ productId }: { productId: string }) {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [seo, setSeo] = useState<SeoValues>({
    metaTitle: "",
    metaDescription: "",
    metaKeywords: [],
  });

  // ─── Fetch existing SEO on mount ──────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    getProductSeo(productId)
      .then((data) => {
        if (cancelled) return;
        if (data) {
          setSeo({
            metaTitle: data.metaTitle ?? "",
            metaDescription: data.metaDescription ?? "",
            // comma-separated string → string[]
            metaKeywords: data.metaKeywords
              ? data.metaKeywords
                  .split(",")
                  .map((k) => k.trim())
                  .filter(Boolean)
              : [],
          });
        }
      })
      .catch(() => toast.error("Failed to load SEO data"))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  const isSeoInvalid =
    seo.metaTitle.length > 60 || seo.metaDescription.length > 160;

  // ─── Save (upsert) ────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await upsertProductSeo(productId, {
        metaTitle: seo.metaTitle || undefined,
        metaDescription: seo.metaDescription || undefined,
        // string[] → comma-separated string
        metaKeywords: seo.metaKeywords.length
          ? seo.metaKeywords.join(", ")
          : undefined,
      });
      toast.success("SEO saved");
    } catch (error: any) {
      toast.error(error.message || "Failed to save SEO");
    } finally {
      setSaving(false);
    }
  };

  // ─── Loading skeleton ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <Card className="space-y-4 p-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-full" />
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Card>
        <SeoMetaDataPage value={seo} onChange={setSeo} />

        <div className="flex justify-end p-4">
          <Button
            type="submit"
            disabled={saving || isSeoInvalid}
            className="min-w-28"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </Card>
    </form>
  );
}
