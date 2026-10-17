"use client";
import { Badge } from "@/components/ui/badge";
import { TSliderItem } from "@/services/settings/bannerSlider.service";

import { Loader2, ToggleLeft, ToggleRight } from "lucide-react";
import Image from "next/image";

interface Props {
  slider: TSliderItem;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

export default function ToggleConfirmModal({
  slider,
  onConfirm,
  onCancel,
  loading,
}: Props) {
  const willDeactivate = slider.isActive;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Top accent */}
        <div
          className={`h-1.5 w-full ${
            willDeactivate
              ? "bg-gradient-to-r from-orange-400 to-red-500"
              : "bg-gradient-to-r from-emerald-400 to-teal-500"
          }`}
        />

        <div className="p-6">
          {/* Icon */}
          <div
            className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${
              willDeactivate ? "bg-orange-50" : "bg-emerald-50"
            }`}
          >
            {willDeactivate ? (
              <ToggleLeft className="h-6 w-6 text-orange-500" />
            ) : (
              <ToggleRight className="h-6 w-6 text-emerald-500" />
            )}
          </div>

          <h3 className="text-lg font-semibold text-slate-800">
            {willDeactivate ? "Deactivate Slider?" : "Activate Slider?"}
          </h3>
          <p className="mt-1.5 text-sm text-slate-500">
            The slider{" "}
            <span className="font-semibold text-slate-700">
              &quot;{slider.title}&quot;
            </span>{" "}
            will be{" "}
            <span
              className={`font-semibold ${
                willDeactivate ? "text-orange-600" : "text-emerald-600"
              }`}
            >
              {willDeactivate ? "hidden from homepage" : "shown on homepage"}
            </span>
            .
          </p>

          {/* Preview */}
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
            <div className="relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg border">
              <Image
                src={slider.imageUrl}
                alt={slider.title}
                fill
                sizes="(max-width: 640px) 100vw,
         (max-width: 1024px) 100vw,
         100vw"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-700">
                {slider.title}
              </p>
              <div className="mt-1 flex items-center gap-1.5">
                <Badge
                  className={`text-xs ${
                    slider.isActive
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                      : "bg-red-100 text-red-700 hover:bg-red-100"
                  }`}
                >
                  {slider.isActive ? "Active" : "Inactive"}
                </Badge>
                <span className="text-slate-300">→</span>
                <Badge
                  className={`text-xs ${
                    willDeactivate
                      ? "bg-red-100 text-red-700 hover:bg-red-100"
                      : "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                  }`}
                >
                  {willDeactivate ? "Inactive" : "Active"}
                </Badge>
              </div>
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
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition disabled:opacity-70 ${
                willDeactivate
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-emerald-500 hover:bg-emerald-600"
              }`}
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {willDeactivate ? "Yes, Deactivate" : "Yes, Activate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
