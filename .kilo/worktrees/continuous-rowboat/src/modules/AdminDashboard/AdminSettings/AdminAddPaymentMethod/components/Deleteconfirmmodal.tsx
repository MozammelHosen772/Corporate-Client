"use client";

import { TPaymentMethod } from "@/services/paymentMethod/paymentmethods.service";

type Props = {
  method: TPaymentMethod;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
};

export default function DeleteConfirmModal({
  method,
  onConfirm,
  onCancel,
  loading,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-800">
          Delete Payment Method
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Are you sure you want to delete{" "}
          <span className="font-medium text-slate-700">
            {method.provider} ({method.accountNumber})
          </span>
          ? This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
