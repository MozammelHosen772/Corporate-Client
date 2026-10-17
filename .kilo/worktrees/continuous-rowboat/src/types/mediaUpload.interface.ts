import { IUploadedMedia } from "@/services/mediaUploader/mediaUploader.service";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface IUploadedMediaWithMeta extends IUploadedMedia {
  name: string;
  fileType: "image" | "video" | "pdf";
}

export interface MediaUploaderProps {
  uploadType: "image" | "video" | "pdf" | "mixed";
  multiple?: boolean;
  label?: string;
  required?: boolean;
  max?: string;
  onChange?: (files: IUploadedMediaWithMeta[]) => void;
  onDelete?: (
    item: IUploadedMediaWithMeta,
    updatedFiles: IUploadedMediaWithMeta[],
  ) => Promise<void>;
  defaultValue?: IUploadedMediaWithMeta[];
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

export function parseMaxBytes(max: string): number {
  const lower = max.toLowerCase().trim();
  const num = parseFloat(lower);
  if (lower.endsWith("gb")) return num * 1024 * 1024 * 1024;
  if (lower.endsWith("mb")) return num * 1024 * 1024;
  if (lower.endsWith("kb")) return num * 1024;
  return num;
}

export function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

export function getFileType(file: File): "image" | "video" | "pdf" {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return "pdf";
}

export function getTypeBadge(fileType: "image" | "video" | "pdf") {
  const map = {
    image: {
      label: "Image",
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    },
    video: {
      label: "Video",
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
    },
    pdf: {
      label: "PDF",
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
    },
  };
  return map[fileType];
}

export const acceptMap: Record<MediaUploaderProps["uploadType"], string> = {
  image:
    "image/jpeg,image/jpg,image/png,image/webp,image/gif,image/bmp,image/tiff,image/avif",
  video: "video/mp4,video/webm,video/quicktime",
  pdf: "application/pdf",
  mixed:
    "image/jpeg,image/jpg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime,application/pdf",
};
