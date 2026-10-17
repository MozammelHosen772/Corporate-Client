export function OrderTableSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden animate-pulse">
      <div className="grid grid-cols-8 gap-4 bg-slate-50 px-4 py-3 border-b border-slate-100">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-3 rounded bg-slate-200" />
        ))}
      </div>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-8 gap-4 px-4 py-4 border-b border-slate-50 last:border-0"
        >
          <div className="h-3 rounded bg-slate-100" />
          <div className="space-y-1.5">
            <div className="h-3 rounded bg-slate-100 w-3/4" />
            <div className="h-2.5 rounded bg-slate-100 w-1/2" />
          </div>
          <div className="h-3 rounded bg-slate-100 w-8" />
          <div className="h-3 rounded bg-slate-100 w-16" />
          <div className="h-5 rounded-full bg-slate-100 w-12" />
          <div className="h-5 rounded-full bg-slate-100 w-20" />
          <div className="h-3 rounded bg-slate-100 w-20" />
          <div className="h-6 rounded-lg bg-slate-100 w-14 ml-auto" />
        </div>
      ))}
    </div>
  );
}
