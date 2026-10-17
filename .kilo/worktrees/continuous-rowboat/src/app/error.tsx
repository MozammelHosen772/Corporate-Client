"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Home, RefreshCw, Wrench } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-16">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-orange-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center text-center">
        {/* Error icon */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-orange-500/10 bg-orange-500/10">
          <AlertTriangle
            className="h-9 w-9 text-orange-500"
            strokeWidth={1.7}
          />
        </div>

        {/* Badge */}
        <Badge
          variant="outline"
          className="mb-5 rounded-full border-orange-500/20 bg-orange-500/5 px-4 py-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400"
        >
          Error 500
        </Badge>

        {/* Heading */}
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Something went wrong
        </h1>

        <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
          An unexpected error occurred while loading this page. Please try again
          or return to the IMechanic homepage.
        </p>

        {/* Error detail */}
        {error?.message && (
          <Alert variant="destructive" className="mt-7 w-full text-left">
            <AlertTriangle className="h-4 w-4" />

            <AlertTitle className="text-sm font-semibold">
              Error details
            </AlertTitle>

            <AlertDescription className="mt-1 break-all text-xs">
              {error.message}

              {error.digest && (
                <span className="mt-1 block opacity-70">
                  Reference: {error.digest}
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        <Separator className="my-8 w-16" />

        {/* Support hint */}
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10">
            <Wrench className="h-4 w-4 text-orange-500" />
          </div>

          <div className="text-left">
            <p className="text-sm font-medium text-foreground">
              IMechanic Service Center
            </p>
            <p className="text-xs text-muted-foreground">
              Your device repair, handled professionally.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            onClick={reset}
            className="h-11 rounded-lg bg-orange-500 px-6 shadow-sm shadow-orange-500/20 hover:bg-orange-600"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>

          <Button asChild variant="outline" className="h-11 rounded-lg px-6">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
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
