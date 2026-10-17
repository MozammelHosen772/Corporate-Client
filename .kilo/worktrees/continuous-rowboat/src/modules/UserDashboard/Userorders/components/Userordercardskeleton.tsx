export function UserOrderCardSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-2xl border border-slate-100 bg-white"
        >
          <div className="flex items-start justify-between px-4 pt-4 pb-1">
            <div className="space-y-1.5">
              <div className="h-3 w-28 rounded bg-slate-150" />
              <div className="h-2.5 w-20 rounded bg-slate-100" />
            </div>
            <div className="h-5 w-20 rounded-full bg-slate-100" />
          </div>

          <div className="mt-4 flex items-center gap-2 px-4">
            {[0, 1, 2, 3, 4].map((s) => (
              <div key={s} className="flex flex-1 items-center gap-2">
                <div className="h-7 w-7 flex-shrink-0 rounded-full bg-slate-100" />
                {s < 4 && <div className="h-[2px] flex-1 bg-slate-100" />}
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-3 border-t border-slate-50 px-4 py-3">
            <div className="h-14 w-14 flex-shrink-0 rounded-xl bg-slate-100" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-3/4 rounded bg-slate-150" />
              <div className="h-2.5 w-1/3 rounded bg-slate-100" />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-50 bg-slate-50/60 px-4 py-3">
            <div className="h-3 w-24 rounded bg-slate-150" />
            <div className="h-4 w-16 rounded bg-slate-150" />
          </div>
        </div>
      ))}
    </div>
  );
}
