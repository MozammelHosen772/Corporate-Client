export function BlogTableSkeleton() {
  return (
    <div>
      <div className="mb-4 flex gap-3 rounded-xl border border-slate-200 bg-white p-2 md:p-4">
        <div className="h-9 flex-1 animate-pulse rounded-lg bg-slate-100" />
        <div className="h-9 w-[150px] animate-pulse rounded-lg bg-slate-100" />
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
          <div className="h-3 w-48 animate-pulse rounded bg-slate-200" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-slate-50 px-4 py-3 last:border-0"
          >
            <div className="h-10 w-14 animate-pulse rounded-lg bg-slate-100" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-40 animate-pulse rounded bg-slate-100" />
              <div className="h-2.5 w-24 animate-pulse rounded bg-slate-100" />
            </div>
            <div className="h-3 w-16 animate-pulse rounded bg-slate-100" />
            <div className="h-5 w-20 animate-pulse rounded-full bg-slate-100" />
            <div className="flex gap-1">
              {Array.from({ length: 2 }).map((_, j) => (
                <div
                  key={j}
                  className="h-7 w-7 animate-pulse rounded-lg bg-slate-100"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
