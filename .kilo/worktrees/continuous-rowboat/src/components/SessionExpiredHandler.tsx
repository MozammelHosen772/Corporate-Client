"use client";

import { useEffect, useState } from "react";

export const dispatchSessionExpired = (message?: string) => {
  window.dispatchEvent(
    new CustomEvent("sessionExpired", {
      detail: { message },
    }),
  );
};

const getBanglaMessage = (msg?: string): string => {
  if (!msg) return "আপনার session expired হয়েছে। আবার login করুন।";

  const map: Record<string, string> = {
    "Account has been deleted": "আপনার account delete করা হয়েছে।",
    "Account is suspended": "আপনার account suspended করা হয়েছে।",
    "You are not authorized!": "আপনি authorized নন।",
    "User is INACTIVE": "আপনার account INACTIVE করা হয়েছে।",
    "Session expired. Please login again.":
      "আপনার session expired হয়েছে। আবার login করুন।",
    "Access token expired": "আপনার session expired হয়েছে। আবার login করুন।",
    "Invalid token": "Invalid token। আবার login করুন।",
    "User not found": "User পাওয়া যায়নি।",
  };

  return map[msg] ?? msg;
};

interface Props {
  autoShow?: boolean;
  defaultMessage?: string;
}

export default function SessionExpiredModal({
  autoShow = false,
  defaultMessage = "আপনার session expired হয়েছে। আবার login করুন।",
}: Props) {
  const [show, setShow] = useState(autoShow);
  const [eventMessage, setEventMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleSessionExpired = (e: Event) => {
      const custom = e as CustomEvent<{ message?: string }>;
      const msg = custom.detail?.message;
      setEventMessage(getBanglaMessage(msg));
      setShow(true);
    };

    window.addEventListener("sessionExpired", handleSessionExpired);
    return () =>
      window.removeEventListener("sessionExpired", handleSessionExpired);
  }, []);

  if (!show) return null;

  const displayMessage = eventMessage ?? defaultMessage;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z"
              />
            </svg>
          </div>
        </div>

        <h2 className="mb-2 text-center text-xl font-semibold text-slate-800">
          Session Expired
        </h2>

        <p className="mb-6 text-center text-sm text-slate-500">
          {displayMessage}
        </p>

        <button
          onClick={() => (window.location.href = "/")}
          className="w-full rounded-xl bg-red-500 py-3 text-sm font-medium text-white transition hover:bg-red-600"
        >
          Login করুন
        </button>
      </div>
    </div>
  );
}
