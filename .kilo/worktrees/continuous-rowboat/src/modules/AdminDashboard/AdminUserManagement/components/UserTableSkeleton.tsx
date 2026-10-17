import { Skeleton } from "@/components/ui/skeleton";

export function UserTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      {/* Desktop Header */}
      <div className="hidden border-b border-slate-200 bg-slate-50/80 px-6 py-4 md:block">
        <div className="grid grid-cols-5 gap-4">
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-4 w-20 rounded-md" />
          <Skeleton className="h-4 w-16 rounded-md" />
          <Skeleton className="h-4 w-16 rounded-md" />
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
              {/* User */}
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full shrink-0" />

                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32 rounded-md" />
                  <Skeleton className="h-3 w-44 rounded-md" />
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-14 rounded-md" />
                  <Skeleton className="h-8 w-24 rounded-full" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-3 w-14 rounded-md" />
                  <Skeleton className="h-8 w-24 rounded-full" />
                </div>
              </div>

              {/* Action */}
              <div className="flex justify-end">
                <Skeleton className="h-10 w-10 rounded-xl" />
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:grid md:grid-cols-5 md:items-center md:gap-4">
              {/* User */}
              <div className="flex items-center gap-3">
                <Skeleton className="h-11 w-11 rounded-full shrink-0" />

                <div className="space-y-2">
                  <Skeleton className="h-4 w-28 rounded-md" />
                  <Skeleton className="h-3 w-40 rounded-md" />
                </div>
              </div>

              {/* Phone */}
              <Skeleton className="h-4 w-28 rounded-md" />

              {/* Role */}
              <Skeleton className="h-8 w-24 rounded-full" />

              {/* Status */}
              <Skeleton className="h-8 w-24 rounded-full" />

              {/* Action */}
              <div className="flex justify-start">
                <Skeleton className="h-10 w-10 rounded-xl" />
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
