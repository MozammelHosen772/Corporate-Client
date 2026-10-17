"use client";

import { Button } from "@/components/ui/button";

interface ProductConfirmModalProps {
  message: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ProductConfirmModal({
  message,
  onConfirm,
  onCancel,
}: ProductConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-product-title"
      aria-describedby="delete-product-description"
    >
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl mx-4">
        <h2
          id="delete-product-title"
          className="mb-3 text-lg font-semibold text-slate-900"
        >
          Confirm Deletion
        </h2>

        <div
          id="delete-product-description"
          className="text-sm leading-relaxed text-slate-700"
        >
          {message}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            aria-label="Cancel deletion"
          >
            Cancel
          </Button>

          <Button
            size="sm"
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={onConfirm}
            aria-label="Delete product permanently"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
