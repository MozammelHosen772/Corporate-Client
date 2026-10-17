"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useTransition } from "react";

export default function TopLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {});
  }, [pathname, searchParams]);

  if (!isPending) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-slate-200 border-t-orange-500" />
        <span className="text-sm font-medium text-slate-500">Loading...</span>
      </div>
    </div>
  );
}
