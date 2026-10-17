export default function AdminSocialMediaSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
        <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-200" />
        <div className="space-y-2">
          <div className="h-5 w-32 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-4 w-48 animate-pulse rounded-lg bg-slate-200" />
        </div>
      </div>

      {/* Body */}
      <div className="space-y-6 p-6">
        {/* Grid */}
        <div className="grid gap-5 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
              <div className="h-10 w-full animate-pulse rounded-lg bg-slate-200" />
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="h-11 w-24 animate-pulse rounded-xl bg-slate-200" />
      </div>
    </div>
  );
}
