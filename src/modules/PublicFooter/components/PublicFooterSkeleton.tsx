export default function PublicFooterSkeleton() {
  return (
    <footer className="w-full">
      {/* Trust Badges Strip */}
      <div className="border-t border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse" />
              <div className="space-y-2">
                <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
                <div className="h-2 w-32 bg-slate-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer Skeleton */}
      <div className="bg-[#1a2332]">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-3 w-24 bg-slate-700 rounded animate-pulse" />
                {Array.from({ length: 4 }).map((_, j) => (
                  <div
                    key={j}
                    className="h-3 w-32 bg-slate-700 rounded animate-pulse"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-slate-700">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="h-3 w-48 bg-slate-700 rounded animate-pulse" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-6 w-12 bg-slate-700 rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
