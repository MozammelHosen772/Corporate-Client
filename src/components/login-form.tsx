// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Field,
//   FieldDescription,
//   FieldGroup,
//   FieldLabel,
// } from "@/components/ui/field";
// import { Input } from "@/components/ui/input";
// import { cn } from "@/lib/utils";
// import { GoogleAuthButton } from "@/services/auth/GoogleAuthButton";
// import { googleLogin, loginUser } from "@/services/auth/loginUser";
// import { loginValidationZodSchema } from "@/zod/auth.validation";
// import { AlertCircle, Eye, EyeOff, Lock, Phone } from "lucide-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useActionState, useEffect, useState, useTransition } from "react";
// import { toast } from "sonner";
// import InputFieldError from "../shared/InputFieldError";

// export const LOGIN_DRAFT_KEY = "login_draft";

// // ✅ verify-otp form er shathe EXACT same key — OTP send howar shomoy
// // (login OTP-required hole) ekhane cooldown set hobe, verify page e read hobe
// const COOLDOWN_STORAGE_KEY = `otp_resend_cooldown:${LOGIN_DRAFT_KEY}`;
// const RESEND_COOLDOWN_SECONDS = 60;

// function setCooldown(seconds: number) {
//   const until = Date.now() + seconds * 1000;
//   sessionStorage.setItem(COOLDOWN_STORAGE_KEY, String(until));
// }

// const normalizeBdPhone = (rawInput: string): string => {
//   const digitsOnly = rawInput.replace(/\D/g, "");
//   const withoutLeadingZero = digitsOnly.startsWith("0")
//     ? digitsOnly.slice(1)
//     : digitsOnly;
//   return `+880${withoutLeadingZero}`;
// };

// type LoginFormData = {
//   phone: string;
//   password: string;
// };

// type LoginFormErrors = Partial<Record<keyof LoginFormData, string>>;

// const REQUIRED_FIELDS: (keyof LoginFormData)[] = ["phone", "password"];

// const getZodErrors = (data: LoginFormData): LoginFormErrors => {
//   const result = loginValidationZodSchema.safeParse(data);

//   if (result.success) return {};

//   const fieldErrors: LoginFormErrors = {};
//   for (const issue of result.error.issues) {
//     const field = issue.path[0] as keyof LoginFormData;
//     if (field && !fieldErrors[field]) {
//       fieldErrors[field] = issue.message;
//     }
//   }
//   return fieldErrors;
// };

// export function LoginForm({
//   redirect,
//   className,
//   ...props
// }: {
//   redirect?: string;
// } & React.ComponentProps<"div">) {
//   const [showPassword, setShowPassword] = useState(false);

//   const [state, formAction, isPending] = useActionState(loginUser, null);
//   const errorResetKey = JSON.stringify(state);

//   const [formData, setFormData] = useState<LoginFormData>({
//     phone: "",
//     password: "",
//   });

//   const [errors, setErrors] = useState<LoginFormErrors>({});
//   const [touched, setTouched] = useState<Record<string, boolean>>({});

//   const router = useRouter();
//   const fullPhone = normalizeBdPhone(formData.phone);

//   const [isGooglePending, startGoogleTransition] = useTransition();

//   const handleGoogleCredential = (idToken: string) => {
//     startGoogleTransition(async () => {
//       const result = await googleLogin(idToken, redirect);

//       if (!result.success) {
//         toast.error(result.message || "Google login failed");
//         return;
//       }

//       toast.success(result.message || "Logged in successfully!");
//       window.dispatchEvent(new Event("userChanged"));
//       window.location.href = result.redirectTo || "/";
//     });
//   };

//   useEffect(() => {
//     if (!state) return;

//     if (!state.success) {
//       if (state.message) toast.error(state.message);
//       return;
//     }

//     if (state.otpRequired) {
//       // ✅ OTP just send hoise (loginUser server action theke) — verify
//       // page e giye sathe sathe jeno "Resend OTP" button na dekhe
//       setCooldown(RESEND_COOLDOWN_SECONDS);

//       sessionStorage.setItem(
//         LOGIN_DRAFT_KEY,
//         JSON.stringify({
//           phone: fullPhone,
//           password: formData.password,
//           redirect: state.redirectTo || "/",
//         }),
//       );
//       router.push(`/login/verify-otp?phone=${encodeURIComponent(fullPhone)}`);
//       return;
//     }

//     toast.success(state.message || "Logged in successfully!");
//     window.dispatchEvent(new Event("userChanged"));
//     window.location.href = state.redirectTo || "/";
//   }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

//   const handleChange = (field: keyof LoginFormData, value: string) => {
//     const updated = { ...formData, [field]: value };
//     setFormData(updated);

//     if (Object.values(touched).some(Boolean)) {
//       const dataForValidation: LoginFormData = {
//         ...updated,
//         phone: normalizeBdPhone(updated.phone),
//       };

//       const zodErrors = getZodErrors(dataForValidation);
//       const newErrors: LoginFormErrors = {};

//       for (const key of REQUIRED_FIELDS) {
//         if (touched[key]) newErrors[key] = zodErrors[key];
//       }

//       setErrors(newErrors);
//     }
//   };

//   const handleBlur = (field: keyof LoginFormData) => {
//     setTouched((prev) => ({ ...prev, [field]: true }));

//     const dataForValidation: LoginFormData = {
//       ...formData,
//       phone: normalizeBdPhone(formData.phone),
//     };

//     const zodErrors = getZodErrors(dataForValidation);
//     setErrors((prev) => ({ ...prev, [field]: zodErrors[field] }));
//   };

//   const showError = (field: keyof LoginFormData) =>
//     touched[field] ? errors[field] : undefined;

//   const validateAll = (): boolean => {
//     const dataForValidation: LoginFormData = {
//       ...formData,
//       phone: normalizeBdPhone(formData.phone),
//     };

//     const zodErrors = getZodErrors(dataForValidation);
//     const newTouched: Record<string, boolean> = {};

//     for (const field of REQUIRED_FIELDS) {
//       newTouched[field] = true;
//     }

//     setTouched((prev) => ({ ...prev, ...newTouched }));
//     setErrors(zodErrors);

//     return Object.keys(zodErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     if (!validateAll()) {
//       e.preventDefault();
//     }
//   };

//   return (
//     <div className={cn("flex flex-col gap-6", className)} {...props}>
//       <form action={formAction} onSubmit={handleSubmit}>
//         {redirect && <input type="hidden" name="redirect" value={redirect} />}

//         <FieldGroup>
//           {/* 📲 PHONE */}
//           <Field>
//             <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
//             <div className="flex">
//               <div className="flex items-center gap-1.5 px-3 border border-r-0 rounded-l-md bg-gray-100 text-gray-600 text-sm whitespace-nowrap">
//                 <Phone size={14} />
//                 +880
//               </div>
//               <Input
//                 id="phone"
//                 type="text"
//                 placeholder="017XXX OR 17XXX"
//                 className={cn(
//                   "rounded-l-none tracking-widest",
//                   showError("phone") && "border-red-300",
//                 )}
//                 value={formData.phone}
//                 autoComplete="tel"
//                 maxLength={11}
//                 onChange={(e) => {
//                   const value = e.target.value.replace(/\D/g, "");
//                   handleChange("phone", value);
//                 }}
//                 onBlur={() => handleBlur("phone")}
//                 aria-invalid={!!showError("phone")}
//               />
//             </div>
//             <input type="hidden" name="phone" value={fullPhone} />
//             {showError("phone") ? (
//               <p className="flex items-center gap-1 text-xs text-red-500">
//                 <AlertCircle className="w-3 h-3" /> {showError("phone")}
//               </p>
//             ) : (
//               <InputFieldError
//                 field="phone"
//                 state={state}
//                 key={`phone-${errorResetKey}`}
//               />
//             )}
//           </Field>

//           {/* 🔐 PASSWORD */}
//           <Field>
//             <FieldLabel htmlFor="password">Password</FieldLabel>
//             <div className="relative">
//               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
//                 <Lock size={16} />
//               </span>
//               <Input
//                 id="password"
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter your password"
//                 className={cn(
//                   "pl-9 pr-10 text-lg tracking-widest",
//                   showError("password") && "border-red-300",
//                 )}
//                 autoComplete="current-password"
//                 value={formData.password}
//                 onChange={(e) => handleChange("password", e.target.value)}
//                 onBlur={() => handleBlur("password")}
//                 aria-invalid={!!showError("password")}
//               />
//               <button
//                 type="button"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   e.stopPropagation();
//                   setShowPassword((prev) => !prev);
//                 }}
//                 tabIndex={-1}
//                 aria-label={showPassword ? "Hide password" : "Show password"}
//                 className="absolute right-0 top-0 h-full px-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors touch-manipulation"
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//             {showError("password") ? (
//               <p className="flex items-center gap-1 text-xs text-red-500">
//                 <AlertCircle className="w-3 h-3" /> {showError("password")}
//               </p>
//             ) : (
//               <InputFieldError
//                 field="password"
//                 state={state}
//                 key={`password-${errorResetKey}`}
//               />
//             )}
//           </Field>

//           {/* Forgot password */}
//           <div className="flex justify-start">
//             <Link
//               href="#"
//               className="text-sm text-gray-500 underline-offset-4 hover:underline"
//             >
//               Forgot your password?
//             </Link>
//           </div>

//           {/* BUTTON */}
//           <Field>
//             <Button type="submit" disabled={isPending} className="w-full">
//               {isPending ? "Logging in..." : "Login"}
//             </Button>

//             {/* ─── OR divider ─── */}
//             <div className="relative ">
//               <div className="absolute inset-0 flex items-center">
//                 <span className="w-full border-t" />
//               </div>
//               <div className="relative flex justify-center text-xs uppercase">
//                 <span className="bg-white px-2 text-gray-400">Or</span>
//               </div>
//             </div>

//             {/* 🔵 GOOGLE */}
//             <GoogleAuthButton
//               onCredential={handleGoogleCredential}
//               disabled={isGooglePending}
//               label="Continue with Google"
//             />

//             <FieldDescription className="text-center">
//               Don&apos;t have an account?{" "}
//               <Link
//                 href="/register"
//                 className="text-blue-600 font-medium hover:underline underline-offset-4"
//               >
//                 Sign up
//               </Link>
//             </FieldDescription>
//           </Field>
//         </FieldGroup>
//       </form>
//     </div>
//   );
// }
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
import { googleLogin, loginUser } from "@/services/auth/loginUser";
import { loginValidationZodSchema } from "@/zod/auth.validation";
import { AlertCircle, Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import InputFieldError from "../shared/InputFieldError";

type LoginFormData = {
  email: string;
  password: string;
};

type LoginFormErrors = Partial<Record<keyof LoginFormData, string>>;

const REQUIRED_FIELDS: (keyof LoginFormData)[] = ["email", "password"];

const getZodErrors = (data: LoginFormData): LoginFormErrors => {
  const result = loginValidationZodSchema.safeParse(data);

  if (result.success) return {};

  const fieldErrors: LoginFormErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof LoginFormData;
    if (field && !fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }
  return fieldErrors;
};

// ─── Styles (gold on dark) ────────────────────────────────────────────────────

const labelCls = "text-sm font-normal text-[#d8d2c8]";

const inputCls =
  "h-12 rounded-none border-[#c8a15a]/30 bg-[#14110c] text-base text-white placeholder:text-[#968f83]/70 transition-colors focus-visible:border-[#c8a15a] focus-visible:ring-[#c8a15a]/30";

const iconCls =
  "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#c8a15a]/70";

const errorCls = "flex items-center gap-1.5 text-xs text-red-400";

export function LoginForm({
  redirect,
  className,
  ...props
}: {
  redirect?: string;
} & React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);

  const [state, formAction, isPending] = useActionState(loginUser, null);
  const errorResetKey = JSON.stringify(state);

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [isGooglePending, startGoogleTransition] = useTransition();

  const handleGoogleCredential = (idToken: string) => {
    startGoogleTransition(async () => {
      const result = await googleLogin(idToken, redirect);

      if (!result.success) {
        toast.error(result.message || "Google login failed");
        return;
      }

      toast.success(result.message || "Logged in successfully!");
      window.dispatchEvent(new Event("userChanged"));
      window.location.href = result.redirectTo || "/";
    });
  };

  // Email + password login: no OTP step, go straight in on success
  useEffect(() => {
    if (!state) return;

    if (!state.success) {
      if (state.message) toast.error(state.message);
      return;
    }

    toast.success(state.message || "Logged in successfully!");
    window.dispatchEvent(new Event("userChanged"));
    window.location.href = state.redirectTo || "/";
  }, [state]);

  const handleChange = (field: keyof LoginFormData, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    if (Object.values(touched).some(Boolean)) {
      const zodErrors = getZodErrors(updated);
      const newErrors: LoginFormErrors = {};

      for (const key of REQUIRED_FIELDS) {
        if (touched[key]) newErrors[key] = zodErrors[key];
      }

      setErrors(newErrors);
    }
  };

  const handleBlur = (field: keyof LoginFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    const zodErrors = getZodErrors(formData);
    setErrors((prev) => ({ ...prev, [field]: zodErrors[field] }));
  };

  const showError = (field: keyof LoginFormData) =>
    touched[field] ? errors[field] : undefined;

  const validateAll = (): boolean => {
    const zodErrors = getZodErrors(formData);
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
      {/* noValidate: our own zod messages show instead of the browser bubble */}
      <form action={formAction} onSubmit={handleSubmit} noValidate>
        {redirect && <input type="hidden" name="redirect" value={redirect} />}

        <FieldGroup>
          {/* ✉️ EMAIL */}
          <Field>
            <FieldLabel htmlFor="email" className={labelCls}>
              Email address
            </FieldLabel>
            <div className="relative">
              <span className={iconCls}>
                <Mail size={16} />
              </span>
              <Input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                placeholder="you@example.com"
                autoComplete="email"
                className={cn(
                  inputCls,
                  "pl-10",
                  showError("email") && "border-red-400/70",
                )}
                value={formData.email}
                onChange={(e) =>
                  handleChange("email", e.target.value.replace(/\s/g, ""))
                }
                onBlur={() => handleBlur("email")}
                aria-invalid={!!showError("email")}
              />
            </div>
            {showError("email") ? (
              <p className={errorCls}>
                <AlertCircle className="h-3 w-3" /> {showError("email")}
              </p>
            ) : (
              <InputFieldError
                field="email"
                state={state}
                key={`email-${errorResetKey}`}
              />
            )}
          </Field>

          {/* 🔐 PASSWORD */}
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="password" className={labelCls}>
                Password
              </FieldLabel>
              <Link
                href="#"
                className="text-xs text-[#e0c28a] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0c28a]"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <span className={iconCls}>
                <Lock size={16} />
              </span>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={cn(
                  inputCls,
                  "pl-10 pr-11",
                  showError("password") && "border-red-400/70",
                )}
                autoComplete="current-password"
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
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute right-0 top-0 flex h-full touch-manipulation items-center px-3.5 text-[#968f83] transition-colors hover:text-[#e0c28a] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#e0c28a]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {showError("password") ? (
              <p className={errorCls}>
                <AlertCircle className="h-3 w-3" /> {showError("password")}
              </p>
            ) : (
              <InputFieldError
                field="password"
                state={state}
                key={`password-${errorResetKey}`}
              />
            )}
          </Field>

          {/* BUTTONS */}
          <Field>
            <Button
              type="submit"
              disabled={isPending}
              className="h-12 w-full rounded-none bg-[#c8a15a] text-sm font-medium text-[#120e09] transition-all duration-300 hover:bg-[#e0c28a] hover:shadow-[0_0_24px_rgba(200,161,90,0.35)] disabled:opacity-60"
            >
              {isPending ? "Logging in..." : "Login"}
            </Button>

            {/* ─── Or divider ─── */}
            <div className="relative my-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#c8a15a]/20" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#120f0a] px-3 text-[#968f83]">or</span>
              </div>
            </div>

            {/* 🔵 GOOGLE */}
            <GoogleAuthButton
              onCredential={handleGoogleCredential}
              disabled={isGooglePending}
              label="Continue with Google"
            />

            <FieldDescription className="text-center text-[#968f83]">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-[#e0c28a] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0c28a]"
              >
                Sign up
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
