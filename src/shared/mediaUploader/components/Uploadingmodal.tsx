"use client";

// ─────────────────────────────────────────────
// Uploading Modal
// ─────────────────────────────────────────────

interface UploadingModalProps {
  current: number;
  total: number;
  fileName: string;
}

export default function UploadingModal({
  current,
  total,
  fileName,
}: UploadingModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[320px] rounded-2xl bg-white px-8 py-8 text-center shadow-xl">
        <h3 className="mb-1 text-2xl font-semibold text-gray-900">
          Uploading...
        </h3>
        <p className="mb-1 text-sm text-gray-500">
          {current}/{total} files uploading
        </p>
        <p className="mb-6 max-w-[240px] truncate text-xs text-gray-400 mx-auto">
          {fileName}
        </p>
        <div className="flex items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
        </div>
      </div>
    </div>
  );
}
