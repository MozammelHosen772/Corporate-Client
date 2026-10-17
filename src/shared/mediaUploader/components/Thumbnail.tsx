"use client";

import { IUploadedMediaWithMeta } from "@/types/mediaUpload.interface";
import Image from "next/image";

// ─────────────────────────────────────────────
// Thumbnail
// ─────────────────────────────────────────────

interface ThumbnailProps {
  file?: IUploadedMediaWithMeta;
}

export default function Thumbnail({ file }: ThumbnailProps) {
  if (!file) {
    return <span className="text-[10px] font-semibold text-gray-400">NO</span>;
  }

  if (file.fileType === "image") {
    return (
      <Image
        src={file.url}
        alt={file.name}
        width={40}
        height={40}
        className="h-full w-full object-cover"
      />
    );
  }

  if (file.fileType === "video") {
    return (
      <div className="flex h-full w-full items-center justify-center bg-purple-50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-purple-500"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    );
  }

  // PDF
  return (
    <div className="flex h-full w-full items-center justify-center bg-red-50">
      <span className="text-xs font-semibold text-red-500">PDF</span>
    </div>
  );
}
