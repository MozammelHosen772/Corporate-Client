/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  deleteMedia,
  uploadMedia,
} from "@/services/mediaUploader/mediaUploader.service";
import {
  formatBytes,
  getFileType,
  IUploadedMediaWithMeta,
  MediaUploaderProps,
  parseMaxBytes,
} from "@/types/mediaUpload.interface";
import { Download, Eye, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import Thumbnail from "./components/Thumbnail";
import UploadingModal from "./components/Uploadingmodal";
import ViewModal from "./components/Viewmodal";

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
const acceptMap = {
  image: "image/*",
  video: "video/*",
  pdf: ".pdf,application/pdf",
  mixed: "image/*,video/*,.pdf,application/pdf",
} as const;
export default function MediaUploader({
  uploadType,
  multiple = false,
  label,
  required = false,
  max,
  onChange,
  onDelete: onDeleteProp,
  defaultValue = [],
}: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{
    current: number;
    total: number;
    fileName: string;
  } | null>(null);
  // const [files, setFiles] = useState<IUploadedMediaWithMeta[]>(defaultValue);
  const [files, setFiles] = useState<IUploadedMediaWithMeta[]>(defaultValue);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const maxBytes = max ? parseMaxBytes(max) : null;

  // ─────────────────────────────────────────────
  // Upload Handler
  // ─────────────────────────────────────────────

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles?.length) return;

    const fileArray = Array.from(selectedFiles);
    setUploadError(null);

    // File type validation
    if (uploadType !== "mixed") {
      const invalidFiles = fileArray.filter((f) => {
        if (uploadType === "image") return !f.type.startsWith("image/");
        if (uploadType === "video") return !f.type.startsWith("video/");
        if (uploadType === "pdf") return f.type !== "application/pdf";
        return false;
      });

      if (invalidFiles.length > 0) {
        const typeLabel =
          uploadType === "image"
            ? "Image (ছবি)"
            : uploadType === "video"
              ? "Video"
              : "PDF";
        const msg = `শুধুমাত্র ${typeLabel} file আপলোড করা যাবে।`;
        setUploadError(msg);
        invalidFiles.forEach((f) =>
          toast.error("ভুল File Type", {
            description: `"${f.name}" — ${msg}`,
            duration: 5000,
          }),
        );
        if (inputRef.current) inputRef.current.value = "";
        return;
      }
    }

    // Size validation
    if (maxBytes !== null) {
      const oversized = fileArray.filter((f) => f.size > maxBytes);
      if (oversized.length > 0) {
        oversized.forEach((f) => {
          const msg = `"${f.name}" এর size ${formatBytes(f.size)}। সর্বোচ্চ ${formatBytes(maxBytes!)} পর্যন্ত আপলোড করা যাবে।`;
          setUploadError(msg);
          toast.error("File অনেক বড়", { description: msg, duration: 5000 });
        });
        if (inputRef.current) inputRef.current.value = "";
        return;
      }
    }

    try {
      setLoading(true);
      let uploadedFilesState: IUploadedMediaWithMeta[] = [];

      if (multiple) {
        // multiple mode — আগের গুলো রাখো
        uploadedFilesState = [...files];
      } else {
        // single mode — আগের file Cloudinary থেকে delete করো
        if (files[0]) {
          try {
            await deleteMedia(files[0].publicId, files[0].resourceType);
          } catch (err) {
            console.error("পুরনো file delete ব্যর্থ:", err);
          }
        }
        uploadedFilesState = [];
      }

      // একটা একটা করে upload করো (progress দেখানোর জন্য)
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];

        setUploadProgress({
          current: i + 1,
          total: fileArray.length,
          fileName: file.name,
        });

        const formData = new FormData();
        formData.append("files", file);

        const uploaded = await uploadMedia(formData, uploadType);

        const withMeta: IUploadedMediaWithMeta[] = uploaded.map((u) => ({
          ...u,
          name: file.name,
          fileType: getFileType(file),
        }));

        uploadedFilesState = [...uploadedFilesState, ...withMeta];
        setFiles(uploadedFilesState);
        onChange?.(uploadedFilesState);
      }

      toast.success("Upload সফল হয়েছে", {
        description:
          fileArray.length === 1
            ? `"${fileArray[0].name}" সফলভাবে আপলোড হয়েছে।`
            : `${fileArray.length}টি file সফলভাবে আপলোড হয়েছে।`,
      });
    } catch (error: any) {
      console.error(error);
      const raw: string = error?.message ?? "কিছু একটা সমস্যা হয়েছে।";

      const friendlyMessage = raw.toLowerCase().includes("image files only")
        ? "শুধুমাত্র Image (ছবি) file আপলোড করা যাবে।"
        : raw.toLowerCase().includes("video files only")
          ? "শুধুমাত্র Video file আপলোড করা যাবে।"
          : raw.toLowerCase().includes("pdf files only")
            ? "শুধুমাত্র PDF file আপলোড করা যাবে।"
            : raw.toLowerCase().includes("file too large") ||
                raw.toLowerCase().includes("size")
              ? `File এর size অনেক বড়। সর্বোচ্চ ${max ?? ""} পর্যন্ত আপলোড করুন।`
              : `Upload ব্যর্থ হয়েছে: ${raw}`;

      setUploadError(friendlyMessage);
      toast.error("Upload ব্যর্থ হয়েছে", {
        description: friendlyMessage,
        duration: 6000,
      });
    } finally {
      setLoading(false);
      setUploadProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  // ─────────────────────────────────────────────
  // Delete Handler
  // ─────────────────────────────────────────────

  const handleDelete = async (item: IUploadedMediaWithMeta) => {
    const toastId = toast.loading("File মুছে ফেলা হচ্ছে...", {
      description: `"${item.name}" সরানো হচ্ছে`,
    });

    try {
      await deleteMedia(item.publicId, item.resourceType);

      const updatedFiles = files.filter((f) => f.publicId !== item.publicId);
      setFiles(updatedFiles);
      onChange?.(updatedFiles);

      if (onDeleteProp) {
        await onDeleteProp(item, updatedFiles);
      }

      toast.success("File মুছে ফেলা হয়েছে", {
        id: toastId,
        description: `"${item.name}" সফলভাবে সরানো হয়েছে।`,
      });
    } catch (error: any) {
      console.error(error);
      toast.error("Delete ব্যর্থ হয়েছে", {
        id: toastId,
        description:
          error?.message || "File মুছে ফেলা যায়নি। আবার চেষ্টা করুন।",
      });
    }
  };

  const firstFile = files[0];

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────

  return (
    <>
      {/* Upload progress modal */}
      {uploadProgress && (
        <UploadingModal
          current={uploadProgress.current}
          total={uploadProgress.total}
          fileName={uploadProgress.fileName}
        />
      )}

      {/* View modal */}
      {viewModalOpen && files.length > 0 && (
        <ViewModal
          files={files}
          onClose={() => setViewModalOpen(false)}
          onDelete={async (item) => {
            await handleDelete(item);
            if (files.length <= 1) setViewModalOpen(false);
          }}
        />
      )}

      <div className="space-y-1 md:space-y-2">
        {/* Main bar */}
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-2 py-2 md:px-4 md:py-3">
          {/* Thumbnail */}
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
            <Thumbnail file={firstFile} />
          </div>

          {/* Label */}
          <div className="min-w-0 flex-1">
            {label && (
              <span className="text-sm text-gray-700">
                {label}
                {required && <span className="ml-0.5 text-red-500">*</span>}
              </span>
            )}
            {max && (
              <p className="text-[11px] text-gray-400">
                Max {max.toUpperCase()}
              </p>
            )}
          </div>

          {/* Actions — file থাকলে দেখাবে */}
          {files.length > 0 && (
            <div className="flex items-center gap-0.5 md:gap-1.5">
              <button
                type="button"
                onClick={() => setViewModalOpen(true)}
                className="flex items-center justify-center rounded-md border border-amber-300 bg-amber-50 p-1 text-amber-600 hover:bg-amber-100 md:rounded-lg md:p-2"
              >
                <Eye size={15} />
              </button>

              <a
                href={firstFile?.url}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="flex items-center justify-center rounded-md border border-teal-300 bg-teal-50 p-1 text-teal-600 hover:bg-teal-100 md:rounded-lg md:p-2"
              >
                <Download size={15} />
              </a>

              <span className="flex h-6 w-6 items-center justify-center rounded-md border border-orange-300 bg-orange-50 text-xs font-semibold text-orange-600 md:h-7 md:w-7 md:rounded-lg">
                {files.length}
              </span>
            </div>
          )}

          {/* Upload button */}
          <button
            type="button"
            onClick={() => {
              setUploadError(null);
              inputRef.current?.click();
            }}
            disabled={loading}
            className="flex items-center gap-0.5 rounded-lg border border-teal-500 px-1 py-0.5 text-sm font-medium text-teal-600 hover:bg-teal-50 disabled:opacity-50 md:gap-1.5 md:px-4 md:py-2"
          >
            <Upload size={15} />
            {loading ? "Uploading..." : "Upload"}
          </button>

          <input
            ref={inputRef}
            type="file"
            hidden
            multiple={multiple}
            accept={acceptMap[uploadType]}
            onChange={handleFileChange}
          />
        </div>

        {/* Error message */}
        {uploadError && (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
            <X size={14} className="mt-0.5 flex-shrink-0 text-red-500" />
            <p className="text-xs leading-relaxed text-red-600">
              {uploadError}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
