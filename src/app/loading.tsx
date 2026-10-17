import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background overflow-hidden">
      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-48 -left-48 h-[500px] w-[500px] rounded-full bg-red-500/5 blur-3xl" />
        <div className="absolute -bottom-48 -right-48 h-[500px] w-[500px] rounded-full bg-rose-500/5 blur-3xl" />
      </div>

      <div className="relative flex flex-col items-center gap-10">
        {/* Triple-ring spinner */}
        <div className="relative flex h-24 w-24 items-center justify-center">
          {/* Outer */}
          <span className="absolute inset-0 rounded-full border border-border" />
          <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-red-200 [animation-duration:2.8s] [animation-direction:reverse]" />
          {/* Mid */}
          <span className="absolute inset-3 rounded-full border border-border" />
          <span className="absolute inset-3 animate-spin rounded-full border-2 border-transparent border-t-red-400 [animation-duration:1.6s]" />
          {/* Inner */}
          <span className="absolute inset-6 rounded-full border border-border" />
          <span className="absolute inset-6 animate-spin rounded-full border-2 border-transparent border-t-red-600 [animation-duration:0.9s] [animation-direction:reverse]" />
          {/* Center dot */}
          <span className="absolute h-3 w-3 rounded-full bg-red-500/25 animate-ping [animation-duration:1.4s]" />
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
        </div>

        {/* Brand */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            IMechnanic<span className="text-red-500">.</span>
          </h1>
          <p className="text-[11px] font-semibold tracking-[0.3em] text-muted-foreground uppercase">
            Loading your experience
          </p>
        </div>

        <Separator className="w-16 bg-red-100" />

        {/* Skeleton rows */}
        <div className="w-64 flex flex-col gap-4">
          {[
            { w1: "w-full", w2: "w-3/4" },
            { w1: "w-4/5", w2: "w-1/2" },
            { w1: "w-full", w2: "w-2/3" },
          ].map((row, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl flex-shrink-0" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className={`h-2.5 rounded-full ${row.w1}`} />
                <Skeleton className={`h-2.5 rounded-full ${row.w2}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Sliding progress bar */}
        <div className="w-52 h-[3px] rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-red-400 via-red-500 to-rose-400"
            style={{ animation: "loading-slide 1.8s ease-in-out infinite" }}
          />
        </div>
      </div>

      <style>{`
        @keyframes loading-slide {
          0%   { width: 0%;  margin-left: 0%; }
          50%  { width: 55%; margin-left: 22%; }
          100% { width: 0%;  margin-left: 100%; }
        }
      `}</style>
    </div>
  );
}
