// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use server";

// import { serverFetch } from "@/lib/server-fetch";
// import { zodValidator } from "@/lib/zodValidator";
// import { loginValidationZodSchema } from "@/zod/auth.validation";
// import { parse } from "cookie";
// import { setCookie } from "./tokenHandlers";

// const isProduction = process.env.NEXT_PUBLIC_IS_PRODUCTION === "true";

// const cookieOptions = {
//   httpOnly: true,
//   path: "/",
//   secure: isProduction,
//   sameSite: isProduction ? ("none" as const) : ("lax" as const),
// };

// export const loginUser = async (
//   _currentState: any,
//   formData: any,
// ): Promise<any> => {
//   try {
//     const redirectTo = formData.get("redirect") || "/";

//     let accessTokenObject: null | any = null;
//     let refreshTokenObject: null | any = null;

//     const payload = {
//       phone: formData.get("phone"),
//       password: formData.get("password"),
//     };

//     const validated = zodValidator(payload, loginValidationZodSchema);
//     if (!validated.success) return validated;

//     const res = await serverFetch.post("/auth/login", {
//       body: JSON.stringify(validated.data),
//       headers: { "Content-Type": "application/json" },
//     });

//     const result = await res.json();

//     // ✅ backend এর original message — "User is INACTIVE" etc
//     if (!res.ok || !result.success) {
//       return {
//         success: false,
//         message: result.message || "Login failed",
//       };
//     }

//     // ✅ OTP লাগলে — কোনো cookie নেই, শুধু frontend কে জানিয়ে দিচ্ছি
//     // verify-login-otp পেজে পাঠিয়ে দিতে হবে
//     if (result.data?.otpRequired) {
//       return {
//         success: true,
//         otpRequired: true as const,
//         phone: result.data.phone,
//         redirectTo: redirectTo.toString(),
//       };
//     }

//     const setCookieHeaders = res.headers.getSetCookie();
//     if (!setCookieHeaders?.length)
//       throw new Error("No Set-Cookie header found");

//     setCookieHeaders.forEach((cookie: string) => {
//       const parsedCookie = parse(cookie);
//       if (parsedCookie["accessToken"]) accessTokenObject = parsedCookie;
//       if (parsedCookie["refreshToken"]) refreshTokenObject = parsedCookie;
//     });

//     if (!accessTokenObject || !refreshTokenObject) {
//       throw new Error("Tokens not found in cookies");
//     }

//     await setCookie("accessToken", accessTokenObject.accessToken, {
//       ...cookieOptions,
//       maxAge: parseInt(accessTokenObject["Max-Age"]) || 60 * 60,
//     });

//     await setCookie("refreshToken", refreshTokenObject.refreshToken, {
//       ...cookieOptions,
//       maxAge: parseInt(refreshTokenObject["Max-Age"]) || 60 * 60 * 24 * 90,
//     });

//     return {
//       success: true,
//       otpRequired: false as const,
//       message: "You have been logged in successfully.",
//       redirectTo: redirectTo.toString(),
//     };
//   } catch (error: any) {
//     if (
//       error?.message === "NEXT_REDIRECT" ||
//       error?.digest?.startsWith("NEXT_REDIRECT")
//     ) {
//       throw error;
//     }

//     return {
//       success: false,
//       message: "কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।",
//     };
//   }
// };

// export const googleLogin = async (
//   idToken: string,
//   redirect?: string,
// ): Promise<any> => {
//   try {
//     let accessTokenObject: null | any = null;
//     let refreshTokenObject: null | any = null;

//     const res = await serverFetch.post("/auth/google-login", {
//       body: JSON.stringify({ idToken }),
//       headers: { "Content-Type": "application/json" },
//     });

//     const result = await res.json();

//     // ✅ backend এর original message
//     if (!res.ok || !result.success) {
//       return {
//         success: false,
//         message: result.message || "Google login failed",
//       };
//     }

//     const setCookieHeaders = res.headers.getSetCookie();
//     if (!setCookieHeaders?.length)
//       throw new Error("No Set-Cookie header found");

//     setCookieHeaders.forEach((cookie: string) => {
//       const parsedCookie = parse(cookie);
//       if (parsedCookie["accessToken"]) accessTokenObject = parsedCookie;
//       if (parsedCookie["refreshToken"]) refreshTokenObject = parsedCookie;
//     });

//     if (!accessTokenObject || !refreshTokenObject) {
//       throw new Error("Tokens not found in cookies");
//     }

//     await setCookie("accessToken", accessTokenObject.accessToken, {
//       ...cookieOptions,
//       maxAge: parseInt(accessTokenObject["Max-Age"]) || 60 * 60,
//     });

//     await setCookie("refreshToken", refreshTokenObject.refreshToken, {
//       ...cookieOptions,
//       maxAge: parseInt(refreshTokenObject["Max-Age"]) || 60 * 60 * 24 * 90,
//     });

//     return {
//       success: true,
//       message: "You have been logged in successfully.",
//       redirectTo: redirect || "/",
//     };
//   } catch (error: any) {
//     if (
//       error?.message === "NEXT_REDIRECT" ||
//       error?.digest?.startsWith("NEXT_REDIRECT")
//     ) {
//       throw error;
//     }

//     return {
//       success: false,
//       message: "কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।",
//     };
//   }
// };
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { loginValidationZodSchema } from "@/zod/auth.validation";
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

// ✅ notun — আসল client-এর IP/User-Agent বের করে backend-এ forward করার helper
const getClientHeaders = async () => {
  const incomingHeaders = await headers();
  const clientIp =
    incomingHeaders.get("x-forwarded-for") ??
    incomingHeaders.get("x-real-ip") ??
    "";
  const clientUserAgent = incomingHeaders.get("user-agent") ?? "";

  return {
    "x-forwarded-for": clientIp,
    "user-agent": clientUserAgent,
  };
};

export const loginUser = async (
  _currentState: any,
  formData: any,
): Promise<any> => {
  try {
    const redirectTo = formData.get("redirect") || "/";

    let accessTokenObject: null | any = null;
    let refreshTokenObject: null | any = null;

    const payload = {
      phone: formData.get("phone"),
      password: formData.get("password"),
    };

    const validated = zodValidator(payload, loginValidationZodSchema);
    if (!validated.success) return validated;

    // ✅ notun — real IP/UA forward
    const clientHeaders = await getClientHeaders();

    const res = await serverFetch.post("/auth/login", {
      body: JSON.stringify(validated.data),
      headers: {
        "Content-Type": "application/json",
        ...clientHeaders,
      },
    });

    const result = await res.json();

    // ✅ backend এর original message — "User is INACTIVE" etc
    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Login failed",
      };
    }

    // ✅ OTP লাগলে — কোনো cookie নেই, শুধু frontend কে জানিয়ে দিচ্ছি
    // verify-login-otp পেজে পাঠিয়ে দিতে হবে
    if (result.data?.otpRequired) {
      return {
        success: true,
        otpRequired: true as const,
        phone: result.data.phone,
        redirectTo: redirectTo.toString(),
      };
    }

    const setCookieHeaders = res.headers.getSetCookie();
    if (!setCookieHeaders?.length)
      throw new Error("No Set-Cookie header found");

    setCookieHeaders.forEach((cookie: string) => {
      const parsedCookie = parse(cookie);
      if (parsedCookie["accessToken"]) accessTokenObject = parsedCookie;
      if (parsedCookie["refreshToken"]) refreshTokenObject = parsedCookie;
    });

    if (!accessTokenObject || !refreshTokenObject) {
      throw new Error("Tokens not found in cookies");
    }

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
      otpRequired: false as const,
      message: "You have been logged in successfully.",
      redirectTo: redirectTo.toString(),
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
      message: "কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।",
    };
  }
};

export const googleLogin = async (
  idToken: string,
  redirect?: string,
): Promise<any> => {
  try {
    let accessTokenObject: null | any = null;
    let refreshTokenObject: null | any = null;

    // ✅ notun — real IP/UA forward
    const clientHeaders = await getClientHeaders();

    const res = await serverFetch.post("/auth/google-login", {
      body: JSON.stringify({ idToken }),
      headers: {
        "Content-Type": "application/json",
        ...clientHeaders,
      },
    });

    const result = await res.json();

    // ✅ backend এর original message
    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Google login failed",
      };
    }

    const setCookieHeaders = res.headers.getSetCookie();
    if (!setCookieHeaders?.length)
      throw new Error("No Set-Cookie header found");

    setCookieHeaders.forEach((cookie: string) => {
      const parsedCookie = parse(cookie);
      if (parsedCookie["accessToken"]) accessTokenObject = parsedCookie;
      if (parsedCookie["refreshToken"]) refreshTokenObject = parsedCookie;
    });

    if (!accessTokenObject || !refreshTokenObject) {
      throw new Error("Tokens not found in cookies");
    }

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
      message: "You have been logged in successfully.",
      redirectTo: redirect || "/",
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
      message: "কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।",
    };
  }
};
