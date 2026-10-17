import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductTableSkeleton() {
  return (
    <Card>
      <CardContent className="p-0">
        {/* Add Button */}
        <div className="flex justify-end px-4 py-3 border-b border-slate-100">
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-6 gap-4 px-4 py-3 bg-slate-50 border-b border-slate-100">
          {[
            "Product",
            "SKU",
            "Buying Price",
            "Selling Price",
            "Status",
            "Action",
          ].map((_, i) => (
            <Skeleton key={i} className="h-4 w-full rounded-md" />
          ))}
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-slate-100">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-6 gap-4 items-center px-4 py-4"
            >
              {/* Product */}
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-48 rounded-md" />
                <Skeleton className="h-3 w-24 rounded-md" />
              </div>
              {/* SKU */}
              <Skeleton className="h-4 w-20 rounded-md" />
              {/* Buying Price */}
              <Skeleton className="h-4 w-16 rounded-md" />
              {/* Selling Price */}
              <Skeleton className="h-4 w-16 rounded-md" />
              {/* Status */}
              <Skeleton className="h-6 w-20 rounded-full" />
              {/* Action */}
              <div className="flex items-center justify-end gap-1">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
          <Skeleton className="h-4 w-48 rounded-md" />
          <div className="flex items-center gap-1">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
