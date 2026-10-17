"use client";

import { TSliderItem } from "@/services/settings/bannerSlider.service";
import { Loader2, Trash2 } from "lucide-react";
import Image from "next/image";

interface Props {
  slider: TSliderItem;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

export default function DeleteConfirmModal({
  slider,
  onConfirm,
  onCancel,
  loading,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-red-500 to-rose-600" />

        <div className="p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
            <Trash2 className="h-6 w-6 text-red-500" />
          </div>

          <h3 className="text-lg font-semibold text-slate-800">
            Delete Slider?
          </h3>
          <p className="mt-1.5 text-sm text-slate-500">
            This will permanently delete{" "}
            <span className="font-semibold text-slate-700">
              &quot;{slider.title}&quot;
            </span>{" "}
            and remove the image from storage. This action{" "}
            <span className="font-semibold text-red-600">cannot be undone</span>
            .
          </p>

          <div className="mt-4 flex items-center gap-3 rounded-xl border border-red-100 bg-red-50/50 p-3">
            <div className="relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg border">
              <Image
                src={slider.imageUrl}
                alt={slider.title}
                fill
                sizes="(max-width: 640px) 100vw,
         (max-width: 1024px) 100vw,
         100vw"
                className="object-cover opacity-75"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-700">
                {slider.title}
              </p>
              <p className="text-xs text-slate-400">
                {new Date(slider.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-2.5">
            <button
              onClick={onCancel}
              disabled={loading}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-70"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
