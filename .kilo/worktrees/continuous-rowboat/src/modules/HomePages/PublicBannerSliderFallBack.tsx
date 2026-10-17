export function PublicBannerSliderFallBack() {
  return (
    <section className="w-full bg-[#F1F5F9] py-6 px-2">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 animate-pulse">
          {/* Main Hero Banner */}
          <div className="lg:col-span-9 relative overflow-hidden rounded-2xl bg-slate-200">
            {/* main image area */}
            <div className="h-[150px] md:h-[300px]" />

            {/* soft shimmer overlay */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_1.5s_infinite]" />
          </div>

          {/* Side banners */}
          <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-1 gap-3">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="relative overflow-hidden rounded-2xl bg-slate-200"
              >
                {/* image skeleton */}
                <div className="h-[115px] md:h-[200px]" />

                {/* shimmer */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent animate-[shimmer_1.5s_infinite]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
