// /* eslint-disable @typescript-eslint/no-explicit-any */

// "use server";

// import { serverFetch } from "@/lib/server-fetch";
// import { zodValidator } from "@/lib/zodValidator";
// import { registerUserValidationZodSchema } from "@/zod/auth.validation";
// import { parse } from "cookie";
// import { headers } from "next/headers";
// import { setCookie } from "./tokenHandlers";

// const isProduction = process.env.NEXT_PUBLIC_IS_PRODUCTION === "true";

// const cookieOptions = {
//   httpOnly: true,
//   path: "/",
//   secure: isProduction,
//   sameSite: isProduction ? ("none" as const) : ("lax" as const),
// };

// // ✅ notun — আসল client-এর IP/User-Agent বের করে backend-এ forward করার helper
// const getClientHeaders = async () => {
//   const incomingHeaders = await headers();
//   const clientIp =
//     incomingHeaders.get("x-forwarded-for") ??
//     incomingHeaders.get("x-real-ip") ??
//     "";
//   const clientUserAgent = incomingHeaders.get("user-agent") ?? "";

//   return {
//     "x-forwarded-for": clientIp,
//     "user-agent": clientUserAgent,
//   };
// };

// export const registerUser = async (
//   _currentState: any,
//   formData: any,
// ): Promise<any> => {
//   try {
//     const redirectTo = formData.get("redirect") || "/";
//     const phone = formData.get("phone");
//     const otp = formData.get("otp");

//     // ✅ OTP ফিল্ড খালি/ভুল ফরম্যাট হলে API কল করার আগেই আটকাও
//     if (!otp || String(otp).length !== 6) {
//       return {
//         success: false,
//         errors: [{ field: "otp", message: "Please enter the 6-digit OTP" }],
//       };
//     }

//     // ✅ notun — real IP/UA forward (verify-otp, register, auto-login সবকটাতেই লাগবে)
//     const clientHeaders = await getClientHeaders();

//     /* ================= VERIFY OTP প্রথমে — এটা ফেইল হলে register হবেই না ================= */
//     const verifyRes = await serverFetch.post("/auth-otp/verify-otp", {
//       headers: {
//         "Content-Type": "application/json",
//         ...clientHeaders,
//       },
//       body: JSON.stringify({ phone, otp }),
//     });

//     const verifyResult = await verifyRes.json();

//     if (!verifyRes.ok || !verifyResult.success) {
//       // ✅ Rate limit (429) — top-level message রিটার্ন করছি, কোনো "errors" array ছাড়া।
//       // frontend এর generic useEffect (state.message দেখলেই toast দেখায়) এটা
//       // স্বয়ংক্রিয়ভাবে sonner toast এ দেখাবে, inline field error হিসেবে না।
//       if (verifyRes.status === 429) {
//         return {
//           success: false,
//           message:
//             verifyResult.message ||
//             "Too many attempts. Please try again later.",
//         };
//       }

//       // ✅ অন্যান্য ভুল (Invalid/expired OTP) — field-level error, OTP box এর
//       // ঠিক নিচে ছোট করে দেখাবে
//       return {
//         success: false,
//         errors: [
//           {
//             field: "otp",
//             message: verifyResult.message || "Invalid or expired OTP",
//           },
//         ],
//       };
//     }

//     const payload = {
//       name: formData.get("name"),
//       phone,
//       password: formData.get("password"),
//       confirmPassword: formData.get("confirmPassword"),
//     };

//     /* ================= VALIDATION ================= */
//     const validated = zodValidator(payload, registerUserValidationZodSchema);
//     if (!validated.success) return validated;

//     const validatedData = validated.data as {
//       name: string;
//       phone: string;
//       password: string;
//       confirmPassword: string;
//     };

//     const registerData = {
//       name: validatedData.name,
//       phone: validatedData.phone,
//       password: validatedData.password,
//       authProvider: "CREDENTIALS",
//     };

//     /* ================= REGISTER API ================= */
//     const res = await serverFetch.post("/user/register", {
//       headers: {
//         "Content-Type": "application/json",
//         ...clientHeaders,
//       },
//       body: JSON.stringify(registerData),
//     });

//     const result = await res.json();

//     // ✅ throw না করে return — backend message সরাসরি যাবে
//     if (!res.ok || !result.success) {
//       return {
//         success: false,
//         message: result.message || "Registration failed",
//       };
//     }

//     /* ================= AUTO LOGIN ================= */
//     const loginRes = await serverFetch.post("/auth/login", {
//       headers: {
//         "Content-Type": "application/json",
//         ...clientHeaders,
//       },
//       body: JSON.stringify({
//         phone: validatedData.phone,
//         password: validatedData.password,
//       }),
//     });

//     const loginResult = await loginRes.json();

//     // ✅ login fail হলেও registration success — login page এ পাঠাও
//     if (!loginRes.ok || !loginResult.success) {
//       return {
//         success: true,
//         message: "Registration successful! Please log in.",
//         redirectTo: "/login",
//       };
//     }

//     /* ================= GET COOKIES ================= */
//     let accessTokenObject: null | any = null;
//     let refreshTokenObject: null | any = null;

//     const setCookieHeaders = loginRes.headers.getSetCookie();

//     if (!setCookieHeaders?.length) {
//       return {
//         success: true,
//         message: "Registration successful! Please log in.",
//         redirectTo: "/login",
//       };
//     }

//     setCookieHeaders.forEach((cookie: string) => {
//       const parsedCookie = parse(cookie);
//       if (parsedCookie["accessToken"]) accessTokenObject = parsedCookie;
//       if (parsedCookie["refreshToken"]) refreshTokenObject = parsedCookie;
//     });

//     if (!accessTokenObject || !refreshTokenObject) {
//       return {
//         success: true,
//         message: "Registration successful! Please log in.",
//         redirectTo: "/login",
//       };
//     }

//     /* ================= SAVE ACCESS TOKEN ================= */
//     await setCookie("accessToken", accessTokenObject.accessToken, {
//       ...cookieOptions,
//       maxAge: parseInt(accessTokenObject["Max-Age"]) || 60 * 60,
//     });

//     /* ================= SAVE REFRESH TOKEN ================= */
//     await setCookie("refreshToken", refreshTokenObject.refreshToken, {
//       ...cookieOptions,
//       maxAge: parseInt(refreshTokenObject["Max-Age"]) || 60 * 60 * 24 * 90,
//     });

//     return {
//       success: true,
//       message: "Registration successful! Welcome aboard.",
//       redirectTo: redirectTo.toString(),
//     };
//   } catch (error: any) {
//     // ✅ redirect error — re-throw
//     if (
//       error?.message === "NEXT_REDIRECT" ||
//       error?.digest?.startsWith("NEXT_REDIRECT")
//     ) {
//       throw error;
//     }

//     // ✅ isSessionExpired object
//     if (error?.isSessionExpired === true) {
//       return {
//         success: false,
//         isSessionExpired: true,
//         message: error.message || "Session expired",
//       };
//     }

//     return {
//       success: false,
//       message: error.message || "Registration failed. Please try again.",
//     };
//   }
// };
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { registerUserValidationZodSchema } from "@/zod/auth.validation";
import { parse } from "cookie";
import { headers } from "next/headers";
import { setCookie } from "./tokenHandlers";

const isProduction = process.env.NEXT_PUBLIC_IS_PRODUCTION === "true";

const cookieOptions = {
  httpOnly: true,
  path: "/",
  secure: isProduction,
  sameSite: isProduction ? ("none" as const) : ("lax" as const),
};

const getClientHeaders = async () => {
  const incomingHeaders = await headers();
  return {
    "x-forwarded-for":
      incomingHeaders.get("x-forwarded-for") ??
      incomingHeaders.get("x-real-ip") ??
      "",
    "user-agent": incomingHeaders.get("user-agent") ?? "",
  };
};

// redirect param safe kora (open redirect ঠেকাতে)
const safeRedirect = (value: unknown) => {
  const v = String(value ?? "/");
  return v.startsWith("/") && !v.startsWith("//") ? v : "/";
};

export const registerUser = async (
  _currentState: any,
  formData: any,
): Promise<any> => {
  try {
    const redirectTo = safeRedirect(formData.get("redirect"));

    const payload = {
      name: formData.get("name"),
      email: String(formData.get("email") ?? "")
        .trim()
        .toLowerCase(),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    const validated = zodValidator(payload, registerUserValidationZodSchema);
    if (!validated.success) return validated;

    const data = validated.data as {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
    };

    const clientHeaders = await getClientHeaders();

    /* ===== REGISTER ===== */
    const res = await serverFetch.post("/user/register", {
      headers: { "Content-Type": "application/json", ...clientHeaders },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
        authProvider: "CREDENTIALS",
      }),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Registration failed",
      };
    }

    /* ===== AUTO LOGIN ===== */
    const loginRes = await serverFetch.post("/auth/login", {
      headers: { "Content-Type": "application/json", ...clientHeaders },
      body: JSON.stringify({ email: data.email, password: data.password }),
    });

    const loginResult = await loginRes.json();

    const goToLogin = {
      success: true,
      message: "Registration successful! Please log in.",
      redirectTo: "/login",
    };

    if (!loginRes.ok || !loginResult.success) return goToLogin;

    const setCookieHeaders = loginRes.headers.getSetCookie();
    if (!setCookieHeaders?.length) return goToLogin;

    let accessTokenObject: null | any = null;
    let refreshTokenObject: null | any = null;

    setCookieHeaders.forEach((cookie: string) => {
      const parsed = parse(cookie);
      if (parsed["accessToken"]) accessTokenObject = parsed;
      if (parsed["refreshToken"]) refreshTokenObject = parsed;
    });

    if (!accessTokenObject || !refreshTokenObject) return goToLogin;

    await setCookie("accessToken", accessTokenObject.accessToken, {
      ...cookieOptions,
      maxAge: parseInt(accessTokenObject["Max-Age"]) || 60 * 60,
    });

    await setCookie("refreshToken", refreshTokenObject.refreshToken, {
      ...cookieOptions,
      maxAge: parseInt(refreshTokenObject["Max-Age"]) || 60 * 60 * 24 * 90,
    });

    return {
      success: true,
      message: "Registration successful! Welcome aboard.",
      redirectTo,
    };
  } catch (error: any) {
    if (
      error?.message === "NEXT_REDIRECT" ||
      error?.digest?.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }
    return {
      success: false,
      message: "Registration failed. Please try again.",
    };
  }
};
