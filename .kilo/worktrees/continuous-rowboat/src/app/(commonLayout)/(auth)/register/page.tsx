"use client";

import { RegisterForm } from "@/components/register-form";
import { useSearchParams } from "next/navigation";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || undefined;

  return (
    <div className="flex min-h-[calc(100vh-96px)] items-center justify-center p-2 md:p-4">
      <div className="w-full max-w-md space-y-4 rounded-lg border p-6 md:p-8 shadow-lg bg-white">
        <div className="space-y-2 text-center">
          <h1 className="text-xl md:text-3xl font-bold">Create Account</h1>
          <p className="text-gray-500 text-justify">
            Enter your details to create a new account
          </p>
        </div>
        <RegisterForm redirect={redirect} />
      </div>
    </div>
  );
}
