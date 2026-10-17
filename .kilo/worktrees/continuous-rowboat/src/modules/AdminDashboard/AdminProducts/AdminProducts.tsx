"use client";
import { CardHeader } from "@/components/ui/card";
import { clientActionErrorModal } from "@/lib/clientActionErrorModal";
import { createProduct } from "@/services/products/products.service";
import { ICreateProductPayload } from "@/types/AdminProducts/AdminProducts.interface";
import { Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  MOCK_BARCODE,
  MOCK_BRANDS,
  MOCK_CATEGORIES,
  MOCK_TAXES,
  MOCK_UNITS,
} from "./components/DropDown";
import ProductForm from "./components/Productform";

export default function AdminProducts() {
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  // ── Submit handler ──────────────────────────────────────────────────────────
  const handleSubmit = async (payload: ICreateProductPayload) => {
    try {
      setSaving(true);
      await createProduct(payload);
      toast.success("Product created successfully");
      router.push(`/admin/dashboard/products/list`);
    } catch (err) {
      if (clientActionErrorModal(err)) return;
      toast.error(
        err instanceof Error ? err.message : "Failed to save product",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* ── Header ── */}
      <CardHeader className="flex flex-row items-center gap-3 px-2 py-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
          <Share2 className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Add Product</h2>
          <p className="text-sm text-slate-500">
            Create a new product for your store
          </p>
        </div>
      </CardHeader>

      {/* ── Content ── */}
      <ProductForm
        key="create"
        initialData={null}
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
