"use client";

import { CardHeader } from "@/components/ui/card";
import {
  getProductById,
  updateProduct,
} from "@/services/products/products.service";
import {
  ICreateProductPayload,
  IProduct,
} from "@/types/AdminProducts/AdminProducts.interface";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  MOCK_BARCODE,
  MOCK_BRANDS,
  MOCK_CATEGORIES,
  MOCK_TAXES,
  MOCK_UNITS,
} from "./components/DropDown";
import ProductForm from "./components/Productform";

export default function AdminProductEdit({ id }: { id: string }) {
  const router = useRouter();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ── Fetch product ─────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const p = await getProductById(id);
        if (!cancelled) setProduct(p);
      } catch (error) {
        if (!cancelled)
          toast.error(
            error instanceof Error ? error.message : "Failed to load product",
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (payload: ICreateProductPayload) => {
    try {
      setSaving(true);
      await updateProduct(id, payload);
      toast.success("Product updated successfully");
      router.push(`/admin/dashboard/products/list`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update product",
      );
    } finally {
      setSaving(false);
    }
  };

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-4">
        <CardHeader className="flex flex-row items-center gap-3 px-2 py-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
            <Pencil className="h-5 w-5" />
          </div>
          <div className="space-y-1.5">
            <div className="h-5 w-32 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-48 bg-slate-100 rounded animate-pulse" />
          </div>
        </CardHeader>

        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-xl p-6 space-y-4 bg-white">
              <div className="h-5 w-32 bg-slate-200 rounded animate-pulse" />
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="space-y-2">
                    <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
                    <div className="h-10 bg-slate-100 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* ── Header ── */}
      <CardHeader className="flex flex-row items-center gap-3 px-2 py-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
          <Pencil className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Edit Product</h2>
          <p className="text-sm text-slate-500">
            Update your product information
          </p>
        </div>
      </CardHeader>

      {/* ── Form ── */}
      <ProductForm
        key={id}
        initialData={product}
        onSubmit={handleSubmit}
        saving={saving}
        categories={MOCK_CATEGORIES}
        units={MOCK_UNITS}
        taxes={MOCK_TAXES}
        brands={MOCK_BRANDS}
        barcodes={MOCK_BARCODE}
      />
    </div>
  );
}
