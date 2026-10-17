import { Skeleton } from "@/components/ui/skeleton";

export default function AdminSliderSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-52" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-8 w-32 rounded-full" />
      </div>

      {/* SliderForm Skeleton */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-6 space-y-5">
        <Skeleton className="h-5 w-36" />

        {/* Title + Link inputs */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>

        {/* Banner Image uploader */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>

        {/* Status + Content Position */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-28 rounded-lg" />
              <Skeleton className="h-10 w-28 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Reset + Save buttons */}
        <div className="flex justify-end gap-3">
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>

      {/* SliderTable Skeleton */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        {/* Table header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-14" />
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-[40px_120px_1fr_100px_180px_110px_120px_60px] items-center gap-3 px-4 py-3 border-b border-slate-100">
          {[
            "#",
            "Image",
            "Title",
            "Position",
            "Link",
            "Status",
            "Created",
            "",
          ].map((_, i) => (
            <Skeleton key={i} className="h-3.5 w-full max-w-[80px]" />
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[40px_120px_1fr_100px_180px_110px_120px_60px] items-center gap-3 px-4 py-3.5 border-b border-slate-50 last:border-0"
          >
            {/* # */}
            <Skeleton className="h-4 w-4" />
            {/* Image thumbnail */}
            <Skeleton className="h-12 w-20 rounded-lg" />
            {/* Title */}
            <Skeleton className="h-4 w-24" />
            {/* Position badge */}
            <Skeleton className="h-6 w-20 rounded-full" />
            {/* Link */}
            <Skeleton className="h-4 w-36" />
            {/* Status badge */}
            <Skeleton className="h-7 w-24 rounded-full" />
            {/* Created date */}
            <Skeleton className="h-4 w-20" />
            {/* Delete icon */}
            <Skeleton className="h-7 w-7 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
