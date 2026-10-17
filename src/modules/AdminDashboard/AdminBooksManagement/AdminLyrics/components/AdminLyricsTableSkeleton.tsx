import { Skeleton } from "@/components/ui/skeleton";

export function AdminLyricsTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      {/* Desktop Header */}
      <div className="hidden border-b border-slate-200 bg-slate-50/80 px-6 py-4 md:block">
        <div className="grid grid-cols-5 gap-4">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="h-4 w-16 rounded-md" />
          <Skeleton className="h-4 w-12 rounded-md" />
          <Skeleton className="h-4 w-20 rounded-md" />
          <Skeleton className="h-4 w-16 rounded-md" />
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-slate-100">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="
              p-4 sm:p-5 md:px-6 md:py-5
              transition-colors
            "
          >
            {/* Mobile Layout */}
            <div className="space-y-4 md:hidden">
              {/* Title */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-40 rounded-md" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-14 rounded-md" />
                  <Skeleton className="h-4 w-16 rounded-md" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-3 w-14 rounded-md" />
                  <Skeleton className="h-4 w-20 rounded-md" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Skeleton className="h-9 w-9 rounded-xl" />
                <Skeleton className="h-9 w-9 rounded-xl" />
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:grid md:grid-cols-5 md:items-center md:gap-4">
              {/* Title */}
              <Skeleton className="h-4 w-36 rounded-md" />

              {/* Source */}
              <Skeleton className="h-6 w-20 rounded-full" />

              {/* Views */}
              <Skeleton className="h-4 w-12 rounded-md" />

              {/* Created */}
              <Skeleton className="h-4 w-24 rounded-md" />

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Skeleton className="h-9 w-9 rounded-xl" />
                <Skeleton className="h-9 w-9 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:px-6">
        <Skeleton className="h-9 w-full rounded-xl sm:w-24" />

        <Skeleton className="h-4 w-36 rounded-md" />

        <Skeleton className="h-9 w-full rounded-xl sm:w-24" />
      </div>
    </div>
  );
}
