"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { GoogleAuthButton } from "@/services/auth/GoogleAuthButton";
import { googleLogin } from "@/services/auth/loginUser";
import { sendOtpAction } from "@/services/auth/sendOtp";
import { registerUserValidationZodSchema } from "@/zod/auth.validation";
import {
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

export const REGISTER_DRAFT_KEY = "register_draft";

// ✅ verify-otp form er shathe EXACT same key hote hobe, tai OTP send
// howar shomoy ei jaigay set kora cooldown, verify page e read hoy
const COOLDOWN_STORAGE_KEY = `otp_resend_cooldown:${REGISTER_DRAFT_KEY}`;
const RESEND_COOLDOWN_SECONDS = 60;

function setCooldown(seconds: number) {
  const until = Date.now() + seconds * 1000;
  sessionStorage.setItem(COOLDOWN_STORAGE_KEY, String(until));
}

const normalizeBdPhone = (rawInput: string): string => {
  const digitsOnly = rawInput.replace(/\D/g, "");
  const withoutLeadingZero = digitsOnly.startsWith("0")
    ? digitsOnly.slice(1)
    : digitsOnly;
  return `+880${withoutLeadingZero}`;
};

type RegisterFormData = {
  name: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

type RegisterFormErrors = Partial<Record<keyof RegisterFormData, string>>;

const REQUIRED_FIELDS: (keyof RegisterFormData)[] = [
  "name",
  "phone",
  "password",
  "confirmPassword",
];

const getZodErrors = (data: RegisterFormData): RegisterFormErrors => {
  const result = registerUserValidationZodSchema.safeParse(data);

  if (result.success) return {};

  const fieldErrors: RegisterFormErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof RegisterFormData;
    if (field && !fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }
  return fieldErrors;
};

export function RegisterForm({
  redirect,
  className,
  ...props
}: {
  redirect?: string;
} & React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [sendState, sendOtpFormAction, isSendingOtp] = useActionState(
    sendOtpAction,
    null,
  );

  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const router = useRouter();
  const fullPhone = normalizeBdPhone(formData.phone);
  const [isGooglePending, startGoogleTransition] = useTransition();

  const handleGoogleCredential = (idToken: string) => {
    startGoogleTransition(async () => {
      const result = await googleLogin(idToken, redirect);

      if (!result.success) {
        toast.error(result.message || "Google sign-up failed");
        return;
      }

      toast.success(result.message || "Account created successfully!");
      window.dispatchEvent(new Event("userChanged"));
      window.location.href = result.redirectTo || "/";
    });
  };
  useEffect(() => {
    if (!sendState) return;

    if (!sendState.success) {
      if (!sendState.errors) toast.error(sendState.message);
      return;
    }

    toast.success(sendState.message || "OTP sent!");

    // ✅ OTP just send hoise — verify page e giye sathe sathe jeno
    // "Resend OTP" button na dekhe, tai ekhane i cooldown shuru
    setCooldown(RESEND_COOLDOWN_SECONDS);

    sessionStorage.setItem(
      REGISTER_DRAFT_KEY,
      JSON.stringify({
        name: formData.name,
        phone: fullPhone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        redirect: redirect || "/",
      }),
    );

    router.push(`/register/verify-otp?phone=${encodeURIComponent(fullPhone)}`);
  }, [sendState]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (field: keyof RegisterFormData, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    if (Object.values(touched).some(Boolean)) {
      const dataForValidation: RegisterFormData = {
        ...updated,
        phone: normalizeBdPhone(updated.phone),
      };

      const zodErrors = getZodErrors(dataForValidation);
      const newErrors: RegisterFormErrors = {};

      for (const key of REQUIRED_FIELDS) {
        if (touched[key]) newErrors[key] = zodErrors[key];
      }

      setErrors(newErrors);
    }
  };

  const handleBlur = (field: keyof RegisterFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    const dataForValidation: RegisterFormData = {
      ...formData,
      phone: normalizeBdPhone(formData.phone),
    };

    const zodErrors = getZodErrors(dataForValidation);
    setErrors((prev) => ({ ...prev, [field]: zodErrors[field] }));
  };

  const showError = (field: keyof RegisterFormData) =>
    touched[field] ? errors[field] : undefined;

  const validateAll = (): boolean => {
    const dataForValidation: RegisterFormData = {
      ...formData,
      phone: normalizeBdPhone(formData.phone),
    };

    const zodErrors = getZodErrors(dataForValidation);
    const newTouched: Record<string, boolean> = {};

    for (const field of REQUIRED_FIELDS) {
      newTouched[field] = true;
    }

    setTouched((prev) => ({ ...prev, ...newTouched }));
    setErrors(zodErrors);

    return Object.keys(zodErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!validateAll()) {
      e.preventDefault();
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form action={sendOtpFormAction} onSubmit={handleSubmit}>
        <FieldGroup>
          {/* 👤 NAME */}
          <Field>
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <User size={16} />
              </span>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                className={cn(
                  "pl-9 tracking-widest",
                  showError("name") && "border-red-300 ",
                )}
                autoComplete="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                aria-invalid={!!showError("name")}
              />
            </div>
            {showError("name") && (
              <p className="flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="w-3 h-3" /> {showError("name")}
              </p>
            )}
          </Field>

          {/* 📲 PHONE */}
          <Field>
            <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
            <div className="flex">
              <div className="flex items-center gap-1.5 px-3 border border-r-0 rounded-l-md bg-gray-100 text-gray-600 text-sm whitespace-nowrap">
                <Phone size={14} />
                +880
              </div>
              <Input
                id="phone"
                type="text"
                placeholder="017XXXXXXXX অথবা 17XXXXXXXX"
                className={cn(
                  "rounded-l-none tracking-widest",
                  showError("phone") && "border-red-300 ",
                )}
                value={formData.phone}
                autoComplete="tel"
                maxLength={11}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  handleChange("phone", value);
                }}
                onBlur={() => handleBlur("phone")}
                aria-invalid={!!showError("phone")}
              />
            </div>
            <input type="hidden" name="phone" value={fullPhone} />
            {showError("phone") && (
              <p className="flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="w-3 h-3" /> {showError("phone")}
              </p>
            )}
          </Field>

          {/* 🔐 PASSWORD */}
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Lock size={16} />
              </span>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 chars, 1 uppercase, 1 number"
                className={cn(
                  "pl-9 pr-10 tracking-widest",
                  showError("password") && "border-red-300 ",
                )}
                autoComplete="new-password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                aria-invalid={!!showError("password")}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowPassword((prev) => !prev);
                }}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-0 top-0 h-full px-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors touch-manipulation"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {showError("password") && (
              <p className="flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="w-3 h-3" /> {showError("password")}
              </p>
            )}
          </Field>

          {/* 🔐 CONFIRM PASSWORD */}
          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ShieldCheck size={16} />
              </span>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                className={cn(
                  "pl-9 pr-10 tracking-widest",
                  showError("confirmPassword") && "border-red-300 ",
                )}
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                onBlur={() => handleBlur("confirmPassword")}
                aria-invalid={!!showError("confirmPassword")}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowConfirmPassword((prev) => !prev);
                }}
                tabIndex={-1}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                className="absolute right-0 top-0 h-full px-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors touch-manipulation"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {showError("confirmPassword") && (
              <p className="flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="w-3 h-3" />{" "}
                {showError("confirmPassword")}
              </p>
            )}
          </Field>

          <Field>
            <Button type="submit" disabled={isSendingOtp} className="w-full">
              {isSendingOtp ? "Sending OTP..." : "Continue"}
            </Button>

            {/* ─── OR divider ─── */}
            <div className="relative ">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-400">Or</span>
              </div>
            </div>

            {/* 🔵 GOOGLE — sign up context, OTP flow বাইপাস করে সরাসরি account তৈরি হবে */}
            <GoogleAuthButton
              onCredential={handleGoogleCredential}
              disabled={isGooglePending}
              label="Continue with Google"
            />

            <FieldDescription className="text-center">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 font-medium hover:underline underline-offset-4"
              >
                Sign in
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
