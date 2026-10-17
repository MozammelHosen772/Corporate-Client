"use client";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { getInputFieldError } from "@/lib/getInputFieldError";
import { cn } from "@/lib/utils";
import { loginUser } from "@/services/auth/loginUser";
import { verifyLoginOtp } from "@/services/auth/verifyLoginOtp.service";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useRouter } from "next/navigation";
import {
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { toast } from "sonner";
import { LOGIN_DRAFT_KEY } from "./login-form";

type LoginDraft = {
  phone: string;
  password: string;
  redirect: string;
};

const RESEND_COOLDOWN_SECONDS = 60;
const COOLDOWN_STORAGE_KEY = `otp_resend_cooldown:${LOGIN_DRAFT_KEY}`;

function readDraft(): LoginDraft | null {
  if (typeof window === "undefined") return null;

  const raw = sessionStorage.getItem(LOGIN_DRAFT_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as LoginDraft;
  } catch {
    return null;
  }
}

function getRemainingCooldown(): number {
  if (typeof window === "undefined") return 0;

  const storedUntil = sessionStorage.getItem(COOLDOWN_STORAGE_KEY);
  if (!storedUntil) return 0;

  const remainingMs = Number(storedUntil) - Date.now();
  return remainingMs > 0 ? Math.ceil(remainingMs / 1000) : 0;
}

function setCooldown(seconds: number) {
  const until = Date.now() + seconds * 1000;
  sessionStorage.setItem(COOLDOWN_STORAGE_KEY, String(until));
}

function parseLockoutSeconds(message?: string): number | null {
  if (!message) return null;
  const match = message.match(/after (\d+) seconds?/i);
  if (!match) return null;
  return Number(match[1]);
}

export function VerifyLoginOtpForm({
  phone: phoneFromUrl,
}: {
  phone?: string;
}) {
  const router = useRouter();

  const [draft] = useState<LoginDraft | null>(readDraft);

  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] =
    useState<number>(getRemainingCooldown);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [state, formAction, isPending] = useActionState(verifyLoginOtp, null);
  const [isSendingOtp, startTransition] = useTransition();

  const otpFieldError = getInputFieldError("otp", state);

  const [dismissedErrorState, setDismissedErrorState] =
    useState<typeof state>(null);
  const showOtpError = !!otpFieldError && state !== dismissedErrorState;

  useEffect(() => {
    if (draft) return;

    toast.error("Session expired. Please login again.");
    startTransition(() => {
      router.replace("/login");
    });
  }, [draft, router, startTransition]);

  useEffect(() => {
    if (!state) return;

    if (!state.success && state.message) {
      toast.error(state.message);

      const lockoutSeconds = parseLockoutSeconds(state.message);
      if (lockoutSeconds) {
        setCooldown(lockoutSeconds);
      }
      return;
    }

    if (state.success) {
      toast.success(state.message || "Logged in successfully!");
      sessionStorage.removeItem(LOGIN_DRAFT_KEY);
      sessionStorage.removeItem(COOLDOWN_STORAGE_KEY);
      window.dispatchEvent(new Event("userChanged"));
      window.location.href = state.redirectTo || "/";
    }
  }, [state]);

  useEffect(() => {
    cooldownRef.current = setInterval(() => {
      const remaining = getRemainingCooldown();
      setResendCooldown((prev) => (prev === remaining ? prev : remaining));
    }, 1000);

    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  const handleOtpChange = useCallback(
    (value: string) => {
      setOtp(value);
      setDismissedErrorState(state);
    },
    [state],
  );

  const handleResendOtp = useCallback(() => {
    if (!draft) return;

    const formData = new FormData();
    formData.set("phone", draft.phone);
    formData.set("password", draft.password);
    formData.set("redirect", draft.redirect);

    startTransition(async () => {
      const result = await loginUser(null, formData);

      if (!result.success) {
        toast.error(result.message);

        const lockoutSeconds = parseLockoutSeconds(result.message);
        if (lockoutSeconds) {
          setCooldown(lockoutSeconds);
        }
        return;
      }

      toast.success("OTP resent!");
      setOtp("");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    });
  }, [draft, startTransition]);

  if (!draft) return null;

  const displayPhone = phoneFromUrl || draft.phone;

  const formattedCooldown =
    resendCooldown >= 60
      ? `${Math.floor(resendCooldown / 60)}m ${resendCooldown % 60}s`
      : `${resendCooldown}s`;

  return (
    <div className="flex flex-col gap-6">
      <form action={formAction}>
        <input type="hidden" name="phone" value={draft.phone} />
        <input type="hidden" name="redirect" value={draft.redirect} />

        <Field>
          <p className="text-xs text-gray-500">
            একটি ৬-ডিজিট কোড পাঠানো হয়েছে{" "}
            <span className="font-medium text-gray-700">{displayPhone}</span>{" "}
            নাম্বারে
          </p>

          <InputOTP
            maxLength={6}
            value={otp}
            onChange={handleOtpChange}
            pattern={REGEXP_ONLY_DIGITS}
            containerClassName="w-full"
          >
            <InputOTPGroup className="w-full">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className={cn(
                    "h-10 w-full flex-1",
                    showOtpError && "border-red-500",
                  )}
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
          <input type="hidden" name="otp" value={otp} />

          {showOtpError && (
            <p className="text-xs text-red-500">{otpFieldError}</p>
          )}

          <div className="flex items-center gap-1 text-xs text-gray-500">
            {resendCooldown > 0 ? (
              <span>
                Resend code in{" "}
                <span className="font-medium text-gray-700">
                  {formattedCooldown}
                </span>
              </span>
            ) : (
              <>
                <span>Didn&apos;t get the code?</span>
                <Button
                  type="button"
                  onClick={handleResendOtp}
                  variant="link"
                  className="h-auto p-0 text-xs"
                  disabled={isSendingOtp}
                >
                  {isSendingOtp ? "Sending..." : "Resend OTP"}
                </Button>
              </>
            )}
          </div>
        </Field>

        <Field className="mt-4">
          <Button
            type="submit"
            formAction={formAction}
            disabled={isPending || otp.length !== 6}
            className="w-full"
          >
            {isPending ? "Verifying..." : "Verify & Login"}
          </Button>
        </Field>
      </form>
    </div>
  );
}
