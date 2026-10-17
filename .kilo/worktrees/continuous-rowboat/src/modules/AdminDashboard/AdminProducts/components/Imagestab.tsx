/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

import {
  getProductMedia,
  IProductMedia,
  saveProductMedia,
} from "@/services/products/productsMedia.service";
import MediaUploader from "@/shared/mediaUploader/MediaUploader";
import { IUploadedMediaWithMeta } from "@/types/mediaUpload.interface";
import { Check, ImageOff } from "lucide-react";
import Image from "next/image";

export default function ImagesTab({ productId }: { productId: string }) {
  const [images, setImages] = useState<IUploadedMediaWithMeta[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ─── Fetch existing media ───────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    getProductMedia(productId)
      .then((data: IProductMedia[]) => {
        if (cancelled) return;

        // IProductMedia → IUploadedMediaWithMeta convert
        const mapped: IUploadedMediaWithMeta[] = data.map((m) => ({
          url: m.url,
          publicId: m.publicId,
          name: m.name,
          fileType: m.fileType.toLowerCase() as "image" | "video" | "pdf",
          resourceType:
            m.fileType.toLowerCase() === "image"
              ? "image"
              : m.fileType.toLowerCase() === "video"
                ? "video"
                : "image", // pdf এর জন্য cloudinary "raw" use করে
        }));

        setImages(mapped);

        // isMain true যেটা সেটা selected করুন
        const mainIdx = data.findIndex((m) => m.isMain);
        setSelectedIdx(mainIdx >= 0 ? mainIdx : 0);
      })
      .catch(() => toast.error("Failed to load media"))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  // ─── Handle Upload ──────────────────────────────────────────────────────────
  const handleUpload = (uploaded: IUploadedMediaWithMeta[]) => {
    setImages(uploaded);

    if (uploaded.length > 0) {
      setSelectedIdx((prev) =>
        prev >= uploaded.length ? uploaded.length - 1 : prev,
      );
    } else {
      setSelectedIdx(0);
    }
  };

  // ─── Save ───────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    try {
      setSaving(true);

      await saveProductMedia(productId, {
        media: images.map((img, i) => ({
          url: img.url,
          publicId: img.publicId,
          name: img.name,
          fileType: img.fileType,
          resourceType: img.resourceType,
          isMain: i === selectedIdx,
        })),
      });

      toast.success("Media saved successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to save media");
    } finally {
      setSaving(false);
    }
  };

  const selected = images?.[selectedIdx] || null;

  return (
    <Card className="border-slate-200 shadow-none">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-slate-700">
            Product Media
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-4 md:p-6 space-y-4">
        {/* Upload */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
          <div className="mb-3">
            <p className="text-sm font-semibold text-slate-700">Upload Media</p>
            <p className="text-xs text-slate-500 mt-0.5">
              PNG, JPG, WEBP, MP4, PDF — max 10MB each
            </p>
          </div>

          <MediaUploader
            key={images.length}
            uploadType="mixed"
            multiple={true}
            label="Upload Product Media"
            required={false}
            max="10mb"
            defaultValue={images}
            onChange={handleUpload}
          />
        </div>

        {/* Main Preview */}
        {loading ? (
          <Skeleton className="w-full h-[220px] md:h-[280px] rounded-xl" />
        ) : (
          <div className="relative w-full h-[220px] md:h-[280px] rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
            {selected ? (
              <>
                {selected.fileType === "image" ? (
                  <Image
                    src={selected.url}
                    alt={selected.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="object-contain"
                  />
                ) : selected.fileType === "video" ? (
                  <video controls className="max-w-full max-h-full rounded-lg">
                    <source src={selected.url} />
                  </video>
                ) : (
                  <iframe src={selected.url} className="w-full h-full" />
                )}

                {/* Main Badge */}
                <div className="absolute top-3 left-3 z-10 bg-orange-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Check className="w-3 h-3" />
                  Main Media
                </div>

                {images.length > 1 && (
                  <div className="absolute bottom-3 right-3 z-10 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">
                    {selectedIdx + 1} / {images.length}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <ImageOff className="h-10 w-10" />
                <p className="text-sm">No media selected</p>
              </div>
            )}
          </div>
        )}

        {/* Thumbnails */}
        {!loading && images.length > 0 && (
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2">
              {images.map((img, i) => (
                <button
                  type="button"
                  key={img.publicId || i}
                  onClick={() => setSelectedIdx(i)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    i === selectedIdx
                      ? "border-orange-500 ring-2 ring-orange-100"
                      : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {img.fileType === "image" ? (
                    <Image
                      src={img.url}
                      alt={img.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 800px"
                      className="object-contain"
                    />
                  ) : img.fileType === "video" ? (
                    <video className="w-full h-full object-cover" muted>
                      <source src={img.url} />
                    </video>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-red-50">
                      <span className="text-[10px] font-bold text-red-500">
                        PDF
                      </span>
                    </div>
                  )}

                  {i === selectedIdx && (
                    <div className="absolute top-1 right-1 bg-orange-500 text-white rounded-full p-0.5">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving || images.length === 0}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {saving ? "Saving..." : "Save Now"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
