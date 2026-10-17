import { Skeleton } from "@/components/ui/skeleton";

export function AboutPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Content card skeleton */}
      <div className="rounded-xl border p-5 space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-52 w-full rounded-lg" />
      </div>

      {/* SEO card skeleton */}
      <div className="rounded-xl border p-5 space-y-4">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-52" />
        <Skeleton className="h-9 w-full rounded-lg" />
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-9 w-full rounded-lg" />
      </div>

      {/* Button skeleton */}
      <div className="flex justify-end">
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>
    </div>
  );
}
