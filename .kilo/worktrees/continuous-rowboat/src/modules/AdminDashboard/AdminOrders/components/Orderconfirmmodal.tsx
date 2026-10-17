"use client";

import { ReactNode } from "react";

interface Props {
  message: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  confirmVariant?: "destructive" | "success" | "default";
}

const VARIANT_STYLES: Record<
  NonNullable<Props["confirmVariant"]>,
  { icon: string; iconWrap: string; button: string }
> = {
  destructive: {
    icon: "text-red-500",
    iconWrap: "bg-red-50",
    button: "bg-red-500 hover:bg-red-600",
  },
  success: {
    icon: "text-emerald-600",
    iconWrap: "bg-emerald-50",
    button: "bg-emerald-600 hover:bg-emerald-700",
  },
  default: {
    icon: "text-slate-600",
    iconWrap: "bg-slate-100",
    button: "bg-slate-800 hover:bg-slate-900",
  },
};

export default function OrderConfirmModal({
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Delete",
  confirmVariant = "destructive",
}: Props) {
  const styles = VARIANT_STYLES[confirmVariant];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`mb-4 flex h-10 w-10 items-center justify-center rounded-full ${styles.iconWrap}`}
        >
          <svg
            className={`h-5 w-5 ${styles.icon}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
        </div>

        <h2 className="mb-2 text-base font-semibold text-slate-800">
          Are you sure?
        </h2>
        <p className="mb-6 text-sm text-slate-500">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 rounded-xl py-2.5 text-sm font-medium text-white transition-colors ${styles.button}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
