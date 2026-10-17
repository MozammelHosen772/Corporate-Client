/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { parse } from "cookie";
import { setCookie } from "./tokenHandlers";

const isProduction = process.env.NEXT_PUBLIC_IS_PRODUCTION === "true";

const cookieOptions = {
  httpOnly: true,
  path: "/",
  secure: isProduction,
  sameSite: isProduction ? ("none" as const) : ("lax" as const),
};

export const verifyLoginOtp = async (
  _currentState: any,
  formData: any,
): Promise<any> => {
  try {
    const redirectTo = formData.get("redirect") || "/";

    let accessTokenObject: null | any = null;
    let refreshTokenObject: null | any = null;

    const payload = {
      phone: formData.get("phone"),
      otp: formData.get("otp"),
    };

    const res = await serverFetch.post("/auth/verify-login-otp", {
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "OTP verification failed",
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
