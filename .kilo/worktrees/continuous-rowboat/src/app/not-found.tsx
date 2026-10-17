import { ArrowRight, Home, SearchX, Wrench } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-16">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-orange-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-orange-500/10 bg-orange-500/10">
          <SearchX className="h-9 w-9 text-orange-500" strokeWidth={1.7} />
        </div>

        {/* Badge */}
        <Badge
          variant="outline"
          className="mb-5 rounded-full border-orange-500/20 bg-orange-500/5 px-4 py-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400"
        >
          Error 404
        </Badge>

        {/* Heading */}
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Page not found
        </h1>

        <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
          The page you are looking for may have been moved, removed, or
          temporarily unavailable.
        </p>

        {/* Quick info */}
        <div className="mt-8 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10">
            <Wrench className="h-4 w-4 text-orange-500" />
          </div>

          <div className="text-left">
            <p className="text-sm font-medium text-foreground">
              Need a repair?
            </p>
            <p className="text-xs text-muted-foreground">
              Book your device repair with IMechanic.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            className="h-11 rounded-lg bg-orange-500 px-6 shadow-sm shadow-orange-500/20 hover:bg-orange-600"
          >
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-11 rounded-lg px-6">
            <Link href="/repair-booking" className="flex items-center gap-2">
              Book a Repair
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Footer */}
        <p className="mt-10 text-xs font-medium tracking-wide text-muted-foreground/50">
          IMechanic<span className="text-orange-500">.</span>
        </p>
      </div>
    </main>
  );
}
