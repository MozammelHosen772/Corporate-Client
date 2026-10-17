export default function AdminThemeSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
        <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-200" />
        <div className="space-y-2">
          <div className="h-5 w-36 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-4 w-52 animate-pulse rounded-lg bg-slate-200" />
        </div>
      </div>

      {/* Body */}
      <div className="space-y-8 p-2 md:p-6">
        {/* Top Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Logo Card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-2 md:p-5">
            <div className="mb-4 space-y-2">
              <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-44 animate-pulse rounded bg-slate-200" />
            </div>
            {/* Uploader row */}
            <div className="h-12 w-full animate-pulse rounded-xl bg-slate-200" />
            {/* Preview box */}
            <div className="mt-5 h-[120px] w-full animate-pulse rounded-xl bg-slate-200" />
          </div>

          {/* Favicon Card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-2 md:p-5">
            <div className="mb-4 space-y-2">
              <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-44 animate-pulse rounded bg-slate-200" />
            </div>
            <div className="h-12 w-full animate-pulse rounded-xl bg-slate-200" />
            <div className="mt-5 h-[120px] w-full animate-pulse rounded-xl bg-slate-200" />
          </div>
        </div>

        {/* Footer Logo Card */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-2 md:p-5">
          <div className="mb-4 space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-44 animate-pulse rounded bg-slate-200" />
          </div>
          <div className="h-12 w-full animate-pulse rounded-xl bg-slate-200" />
          <div className="mt-5 h-[140px] w-full animate-pulse rounded-xl bg-slate-200" />
        </div>

        {/* Save Button */}
        <div className="h-11 w-36 animate-pulse rounded-xl bg-slate-200" />
      </div>
    </div>
  );
}
