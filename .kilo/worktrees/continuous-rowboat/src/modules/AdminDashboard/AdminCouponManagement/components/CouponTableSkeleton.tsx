export function CouponTableSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="h-11 bg-slate-100" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-14 border-t border-slate-100 bg-white" />
      ))}
    </div>
  );
}
