export function FlashSaleFallback() {
  return (
    <section className="w-full bg-white border-b border-gray-100 py-5 px-2 md:px-4">
      <div className="max-w-[1400px] mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
          <div className="h-14 bg-gray-100 border-b border-gray-100" />

          <div className="p-4 flex gap-3 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[185px] h-[280px] bg-gray-100 rounded-xl"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
