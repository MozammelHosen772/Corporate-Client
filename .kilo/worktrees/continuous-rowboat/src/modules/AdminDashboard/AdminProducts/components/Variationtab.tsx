/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

import {
  createProductVariation,
  deleteProductVariation,
  getProductVariations,
  ICreateVariationPayload,
  IVariation,
} from "@/services/products/productsVariation.service";
import {
  ChevronRight,
  LayoutGrid,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";

// ── Random SKU ─────────────────────────────────────────────────────────────────
function generateSKU() {
  return Math.floor(1000000 + Math.random() * 9000000).toString();
}

// ── Form Errors ────────────────────────────────────────────────────────────────
interface IFormErrors {
  color?: string;
  size?: string;
  price?: string;
  sku?: string;
}

// ── Delete Confirm Modal ───────────────────────────────────────────────────────
function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  deleting,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  deleting: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[380px] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-slate-100">
          <DialogTitle className="text-base font-semibold text-slate-700">
            Delete Variation
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 mt-1">
            এই variation টা delete করতে চাও? এটা আর ফেরত পাওয়া যাবে না।
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 py-4 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={deleting}
            className="h-9 px-4 text-sm"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={deleting}
            className="h-9 px-4 text-sm bg-red-500 hover:bg-red-600 text-white"
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Variation Modal ────────────────────────────────────────────────────────────
function VariationModal({
  open,
  onClose,
  onSave,
  saving,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (payload: ICreateVariationPayload) => Promise<void>;
  saving: boolean;
}) {
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [sku, setSku] = useState(() => generateSKU());
  const [errors, setErrors] = useState<IFormErrors>({});

  const resetForm = () => {
    setColor("");
    setSize("");
    setPrice("");
    setSku(generateSKU());
    setErrors({});
  };

  const validate = () => {
    const e: IFormErrors = {};
    if (!sku.trim()) e.sku = "SKU is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    await onSave({
      color: color.trim(),
      size: size.trim(),
      price: Number(price),
      sku: sku.trim(),
    });
    resetForm();
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-slate-100">
          <DialogTitle className="text-base font-semibold text-slate-700">
            Add Variation
          </DialogTitle>
          <DialogDescription className="sr-only">
            Fill in the details to add a new product variation.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-5 grid grid-cols-2 gap-x-5 gap-y-4">
          {/* Color */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Variation
            </Label>
            <Input
              placeholder="e.g. Red"
              value={color}
              onChange={(e) => {
                setColor(e.target.value);
                setErrors((p) => ({ ...p, color: undefined }));
              }}
              className={`h-10 text-sm ${errors.color ? "border-red-400" : ""}`}
            />
            {errors.color && (
              <p className="text-xs text-red-500">{errors.color}</p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Price <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              placeholder="0.00"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                setErrors((p) => ({ ...p, price: undefined }));
              }}
              className={`h-10 text-sm ${errors.price ? "border-red-400" : ""}`}
            />
            {errors.price && (
              <p className="text-xs text-red-500">{errors.price}</p>
            )}
          </div>

          {/* Size */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Size
            </Label>
            <Input
              placeholder="e.g. XL"
              value={size}
              onChange={(e) => {
                setSize(e.target.value);
                setErrors((p) => ({ ...p, size: undefined }));
              }}
              className={`h-10 text-sm ${errors.size ? "border-red-400" : ""}`}
            />
            {errors.size && (
              <p className="text-xs text-red-500">{errors.size}</p>
            )}
          </div>

          {/* SKU */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              SKU <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                type="text"
                value={sku}
                onChange={(e) => {
                  setSku(e.target.value);
                  setErrors((p) => ({ ...p, sku: undefined }));
                }}
                className={`h-10 text-sm pr-10 ${errors.sku ? "border-red-400" : ""}`}
              />
              <button
                type="button"
                onClick={() => setSku(generateSKU())}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500 transition-colors"
                title="Generate random SKU"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
            {errors.sku && <p className="text-xs text-red-500">{errors.sku}</p>}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => handleClose(false)}
            disabled={saving}
            className="h-9 px-4 text-sm"
          >
            Close
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="h-9 px-4 text-sm bg-orange-500 hover:bg-orange-600"
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Tab ───────────────────────────────────────────────────────────────────
export default function VariationTab({ productId }: { productId: string }) {
  const [variations, setVariations] = useState<IVariation[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // ─── Fetch ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    getProductVariations(productId)
      .then((data) => {
        if (!cancelled) setVariations(data);
      })
      .catch(() => toast.error("Failed to load variations"))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  // ─── Create ──────────────────────────────────────────────────────────────────
  const handleSave = async (payload: ICreateVariationPayload) => {
    try {
      setSaving(true);
      const created = await createProductVariation(productId, payload);
      setVariations((prev) => [...prev, created]);
      setModalOpen(false);
      toast.success("Variation added");
    } catch (error: any) {
      toast.error(error.message || "Failed to add variation");
    } finally {
      setSaving(false);
    }
  };

  // ─── Delete ──────────────────────────────────────────────────────────────────
  const handleDelete = async (variationId: string) => {
    try {
      setDeletingId(variationId);
      await deleteProductVariation(productId, variationId);
      setVariations((prev) => prev.filter((v) => v.id !== variationId));
      toast.success("Variation removed");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete variation");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    await handleDelete(deleteTargetId);
    setDeleteModalOpen(false);
    setDeleteTargetId(null);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Variation</h2>
          <Button
            size="sm"
            onClick={() => setModalOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white gap-1.5 h-8"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Variation
          </Button>
        </div>

        {/* List */}
        {loading ? (
          <div className="divide-y divide-slate-100">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-3">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-24 ml-auto" />
              </div>
            ))}
          </div>
        ) : variations.length === 0 ? (
          <div className="px-6 py-12 flex flex-col items-center gap-2 text-slate-400">
            <LayoutGrid className="h-8 w-8" />
            <p className="text-sm">No variations found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {variations.map((v) => (
              <div
                key={v.id}
                className="px-6 py-3.5 flex items-center gap-3 hover:bg-slate-50 transition-colors"
              >
                {/* Info */}
                <div className="flex items-center gap-2 flex-1 flex-wrap text-sm">
                  <span className="text-slate-500">
                    Color{" "}
                    <span className="font-medium text-slate-800">
                      :: {v.color}
                    </span>
                  </span>

                  <ChevronRight className="h-3.5 w-3.5 text-slate-300" />

                  <span className="text-slate-500">
                    Size{" "}
                    <span className="font-medium text-slate-800">
                      :: {v.size}
                    </span>
                  </span>

                  <ChevronRight className="h-3.5 w-3.5 text-slate-300" />

                  <span className="text-slate-500">
                    Price{" "}
                    <span className="font-medium text-slate-800">
                      :: {v.price.toFixed(2)}
                    </span>
                  </span>

                  <ChevronRight className="h-3.5 w-3.5 text-slate-300" />

                  <span className="text-slate-500">
                    SKU{" "}
                    <span className="font-medium text-slate-800">
                      :: {v.sku}
                    </span>
                  </span>
                </div>

                {/* Actions */}
                <button
                  onClick={() => {
                    setDeleteTargetId(v.id);
                    setDeleteModalOpen(true);
                  }}
                  className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      <VariationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        saving={saving}
      />

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteTargetId(null);
        }}
        onConfirm={handleDeleteConfirm}
        deleting={deletingId === deleteTargetId}
      />
    </>
  );
}
