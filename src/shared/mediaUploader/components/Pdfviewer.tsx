"use client";

import { FileText } from "lucide-react";

// ─────────────────────────────────────────────
// PDF Viewer
// iframe embed সব browser-এ কাজ করে না
// তাই direct link দিয়ে new tab-এ open করা সবচেয়ে reliable
// ─────────────────────────────────────────────

interface PdfViewerProps {
  url: string;
  className?: string;
}

export default function PdfViewer({ url, className }: PdfViewerProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 bg-red-50 ${className}`}
    >
      <div className="flex flex-col items-center gap-2">
        <FileText className="h-12 w-12 text-red-400" />
        <p className="text-sm font-medium text-gray-600">PDF Document</p>
      </div>

      <div className="flex items-center gap-2">
        {/* ✅ Google Docs Viewer — browser plugin ছাড়াও দেখা যাবে */}
        <a
          href={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=false`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
        >
          Preview PDF
        </a>

        {/* ✅ Direct download */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
        >
          Download PDF
        </a>
      </div>
    </div>
  );
}
