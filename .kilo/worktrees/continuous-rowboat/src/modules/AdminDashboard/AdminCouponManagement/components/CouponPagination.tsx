"use client";

import { Button } from "@/components/ui/button";
import { TCouponMeta } from "@/services/coupon/coupon.service";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CouponPagination({ meta }: { meta: TCouponMeta }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (meta.totalPages <= 1) return null;

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/admin/dashboard/coupons-management?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between text-sm text-slate-500">
      <p>
        Page {meta.page} of {meta.totalPages} — {meta.total} coupons
      </p>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={meta.page <= 1}
          onClick={() => goToPage(meta.page - 1)}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={meta.page >= meta.totalPages}
          onClick={() => goToPage(meta.page + 1)}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
