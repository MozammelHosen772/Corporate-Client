"use client";

import { Eye } from "lucide-react";

interface Props {
  views: number;
}

export default function TrackLyricsView({ views }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Eye className="h-4 w-4" />
      <span>{Number(views ?? 0).toLocaleString()} views</span>
    </div>
  );
}
