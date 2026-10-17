"use client";

import { clientActionErrorModal } from "@/lib/clientActionErrorModal";
import { deleteProduct } from "@/services/products/products.service";
import { IProduct } from "@/types/AdminProducts/AdminProducts.interface";
import { useCallback, useState, useTransition } from "react";
import { toast } from "sonner";
import ProductConfirmModal from "./components/Productconfirmmodal";
import ProductFilters from "./components/Productfilters";
import ProductTable from "./components/Producttable";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface IProductMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Props {
  products: IProduct[];
  meta: IProductMeta;
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function AdminProductsList({ products, meta }: Props) {
  const [isPending, startTransition] = useTransition();
  const [filterPending, setFilterPending] = useState(false);
  const isTableLoading = isPending || filterPending;

  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null,
  );
  const [confirmDelete, setConfirmDelete] = useState<IProduct | null>(null);

  const handleFilterPending = useCallback((pending: boolean) => {
    setFilterPending(pending);
  }, []);

  // ─── Delete ───────────────────────────────────────────────────────────────────

  const confirmDeleteAction = () => {
    if (!confirmDelete) return;
    const product = confirmDelete;
    setConfirmDelete(null);
    setDeletingProductId(product.id);

    startTransition(async () => {
      try {
        await deleteProduct(product.id);
        toast.success("Product deleted successfully");
      } catch (error) {
        if (clientActionErrorModal(error)) return;
        toast.error(
          error instanceof Error ? error.message : "Failed to delete product",
        );
      } finally {
        setDeletingProductId(null);
      }
    });
  };

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <>
      {confirmDelete && (
        <ProductConfirmModal
          message={
            <>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-orange-500">
                {confirmDelete.name || "this product"}
              </span>
              ? This action cannot be undone.
            </>
          }
          onConfirm={confirmDeleteAction}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      <ProductFilters onPendingChange={handleFilterPending} />

      <ProductTable
        products={products}
        meta={meta}
        isPending={isTableLoading}
        deletingProductId={deletingProductId}
        onDelete={setConfirmDelete}
      />
    </>
  );
}
