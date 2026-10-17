"use client";

import { Star } from "lucide-react";

interface ProductMetaProps {
  brandId: string;
}

export function ProductMeta({ brandId }: ProductMetaProps) {
  return (
    <div className="flex items-center gap-4 mt-2 flex-wrap">
      <div className="flex items-center gap-1 text-gray-600">
        Brand: {brandId}
      </div>
      {/* ⚠️ এখানে শুধু brandId (raw string) দেখাচ্ছে, actual
          brand name না। যদি brand list/service থেকে name
          resolve করার সুযোগ থাকে সেটা map করে দেখানো ভালো। */}
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="font-semibold">4.5</span>
        <span className="text-gray-400 text-sm">(248 reviews)</span>
      </div>
      {/* ⚠️ Rating/review count এখনো static — actual review
          system integrate না হলে production-এ misleading */}
    </div>
  );
}
