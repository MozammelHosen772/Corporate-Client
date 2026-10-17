const Loading = () => {
  return (
    <section className="w-full bg-[#F1F5F9] py-6 px-2">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-9 h-[240px] md:h-[520px] rounded-2xl bg-slate-200 animate-pulse" />

          <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-1 gap-3">
            <div className="h-[115px] md:h-[252px] rounded-2xl bg-slate-200 animate-pulse" />
            <div className="h-[115px] md:h-[252px] rounded-2xl bg-slate-200 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Loading;
