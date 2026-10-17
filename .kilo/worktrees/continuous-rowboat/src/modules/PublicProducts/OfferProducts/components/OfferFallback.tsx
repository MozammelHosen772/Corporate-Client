"use client";
export function OfferFallback() {
  return (
    <section className="py-6 max-w-[1400px] mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-5 w-5 rounded-full bg-slate-100 animate-pulse" />
        <div className="h-4 w-48 rounded bg-slate-100 animate-pulse" />
      </div>
      <div className="flex gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[185px] md:w-[225px] h-[280px] rounded-lg bg-slate-100 animate-pulse"
          />
        ))}
      </div>
    </section>
  );
}
