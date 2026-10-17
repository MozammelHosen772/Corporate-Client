"use client";

import {
  getTypeBadge,
  IUploadedMediaWithMeta,
} from "@/types/mediaUpload.interface";
import { Download, X } from "lucide-react";
import Image from "next/image";
import PdfViewer from "./Pdfviewer";

// ─────────────────────────────────────────────
// View Modal
// ─────────────────────────────────────────────

interface ViewModalProps {
  files: IUploadedMediaWithMeta[];
  onClose: () => void;
  onDelete: (item: IUploadedMediaWithMeta) => Promise<void>;
}

export default function ViewModal({
  files,
  onClose,
  onDelete,
}: ViewModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative max-h-[90vh] w-[580px] overflow-y-auto rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Documents ({files.length} files)
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="space-y-6 p-6">
          {files.map((item, index) => {
            const badge = getTypeBadge(item.fileType);
            return (
              <div key={item.publicId} className="space-y-2">
                {/* Title row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      {badge.label} {index + 1}/{files.length}
                    </span>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs font-medium ${badge.bg} ${badge.text} ${badge.border}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onDelete(item)}
                      className="flex items-center gap-1.5 rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
                    >
                      <X size={12} />
                      Delete
                    </button>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="flex items-center gap-1.5 rounded-lg border border-teal-300 bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700 hover:bg-teal-100"
                    >
                      <Download size={12} />
                      Download
                    </a>
                  </div>
                </div>

                {/* Preview */}
                <div className="overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                  {item.fileType === "image" && (
                    <Image
                      src={item.url}
                      alt={item.name}
                      width={1200}
                      height={700}
                      className="max-h-72 w-full object-contain"
                    />
                  )}

                  {item.fileType === "video" && (
                    <video controls className="max-h-72 w-full">
                      <source src={item.url} type="video/mp4" />
                    </video>
                  )}

                  {/* ✅ PDF — Preview + Download button */}
                  {item.fileType === "pdf" && (
                    <PdfViewer url={item.url} className="h-56 w-full" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
