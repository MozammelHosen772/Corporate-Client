"use client";

import { VerifyOtpForm } from "@/components/verify-otp-form";
import { useSearchParams } from "next/navigation";

export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || undefined;

  return (
    <div className="flex min-h-[calc(100vh-96px)] items-center justify-center p-2 md:p-4">
      <div className="w-full max-w-md space-y-4 rounded-lg border p-6 md:p-8 shadow-lg bg-white">
        <div className="space-y-2 text-center">
          <h1 className="text-xl md:text-3xl font-bold">Verify Your Phone</h1>
          <p className="text-gray-500 text-justify">
            Enter the 6-digit code sent to your phone
          </p>
        </div>
        <VerifyOtpForm phone={phone} />
      </div>
    </div>
  );
}
