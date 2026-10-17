"use client";

import { RefreshCw, WifiOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface Props {
  title?: string;
  message?: string;
  onRetry?: () => void | Promise<void>;
}

export default function FetchErrorState({
  title = "ডেটা লোড করা যায়নি",
  message = "সার্ভারের সাথে সংযোগ করা যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।",
  onRetry,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [attempted, setAttempted] = useState(false);

  const handleRetry = () => {
    setAttempted(true);
    startTransition(() => {
      if (onRetry) {
        onRetry();
      } else {
        // ✅ default: server component re-fetch করাতে router.refresh()
        router.refresh();
      }
    });
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-3 py-10 px-4 text-center bg-white rounded-xl border border-dashed border-orange-200">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-50">
        <WifiOff className="w-5 h-5 text-orange-500" />
      </div>

      <div className="space-y-1">
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        <p className="text-xs text-muted-foreground max-w-sm">{message}</p>
      </div>

      <button
        onClick={handleRetry}
        disabled={isPending}
        className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-white
        bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 rounded-full
        hover:opacity-90 transition disabled:opacity-60"
      >
        <RefreshCw
          className={`w-3.5 h-3.5 ${isPending ? "animate-spin" : ""}`}
        />
        {isPending
          ? "চেষ্টা করা হচ্ছে..."
          : attempted
            ? "আবার চেষ্টা করুন"
            : "আবার চেষ্টা করুন"}
      </button>
    </div>
  );
}
