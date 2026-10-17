export function UserOrderCardSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-slate-100 bg-white p-4 space-y-3"
        >
          {/* top row */}
          <div className="flex items-center justify-between">
            <div className="h-3 w-32 rounded bg-slate-100" />
            <div className="h-5 w-20 rounded-full bg-slate-100" />
          </div>
          {/* items */}
          <div className="space-y-2">
            <div className="h-3 w-3/4 rounded bg-slate-100" />
            <div className="h-3 w-1/2 rounded bg-slate-100" />
          </div>
          {/* bottom row */}
          <div className="flex items-center justify-between border-t border-slate-50 pt-3">
            <div className="h-3 w-24 rounded bg-slate-100" />
            <div className="h-4 w-20 rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
