export default function AdminPaymentMethodSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-48 rounded bg-slate-200" />
          <div className="h-4 w-64 rounded bg-slate-100" />
        </div>
      </div>

      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mx-auto mb-6 h-6 w-40 rounded bg-slate-200" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="mb-5 space-y-1.5">
            <div className="h-4 w-32 rounded bg-slate-100" />
            <div className="h-10 w-full rounded-lg bg-slate-100" />
          </div>
        ))}
        <div className="h-10 w-full rounded-lg bg-slate-200" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex justify-center gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 w-20 rounded-full bg-slate-100" />
          ))}
        </div>
        <div className="h-5 w-48 rounded bg-slate-200 mb-4" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="mb-3 h-10 w-full rounded bg-slate-100" />
        ))}
      </div>
    </div>
  );
}
