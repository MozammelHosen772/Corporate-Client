"use server";

import { serverFetch } from "@/lib/server-fetch";
import { parse } from "cookie";
import { revalidateTag } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { deleteCookie, getCookie, setCookie } from "./tokenHandlers";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function updateMyProfile(formData: FormData) {
  try {
    const uploadFormData = new FormData();

    const data: any = {};
    formData.forEach((value, key) => {
      if (key !== "file" && value) {
        data[key] = value;
      }
    });

    uploadFormData.append("data", JSON.stringify(data));

    const file = formData.get("file");
    if (file && file instanceof File && file.size > 0) {
      uploadFormData.append("file", file);
    }

    const response = await serverFetch.patch(`/user/me`, {
      body: uploadFormData,
    });

    const result = await response.json();

    if (result.success) {
      revalidateTag("user-info", { expire: 0 });
    }
    return result;
  } catch (error: any) {
    if (isRedirectError(error)) throw error;
    return {
      success: false,
      message: `${process.env.NODE_ENV === "development" ? error.message : "Something went wrong"}`,
    };
  }
}

export async function getNewAccessToken() {
  try {
    const accessToken = await getCookie("accessToken");
    const refreshToken = await getCookie("refreshToken");

    // Case 1: দুটোই নেই — logged out
    if (!accessToken && !refreshToken) {
      return { tokenRefreshed: false };
    }

    // Case 2: refresh token নেই — logout
    if (!refreshToken) {
      return { tokenRefreshed: false };
    }

    // ─── Cookie options — environment অনুযায়ী ────────────────────────────
    const isProduction = process.env.NEXT_PUBLIC_IS_PRODUCTION === "true";

    const cookieOptions = {
      httpOnly: true,
      path: "/",
      secure: isProduction,
      sameSite: isProduction ? ("none" as const) : ("lax" as const),
    };

    let accessTokenObject: null | any = null;
    let refreshTokenObject: null | any = null;

    const response = await serverFetch.post("/auth/refresh-token", {
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    const result = await response.json();

    // backend 401 দিলে — tokenVersion mismatch — refreshFailed
    if (!response.ok || !result.success) {
      await deleteCookie("accessToken");
      await deleteCookie("refreshToken");
      return {
        tokenRefreshed: false,
        refreshFailed: true,
        message: result.message || "Session expired",
      };
    }

    const setCookieHeaders = response.headers.getSetCookie();

    if (setCookieHeaders && setCookieHeaders.length > 0) {
      setCookieHeaders.forEach((cookie: string) => {
        const parsedCookie = parse(cookie);
        if (parsedCookie["accessToken"]) accessTokenObject = parsedCookie;
        if (parsedCookie["refreshToken"]) refreshTokenObject = parsedCookie;
      });
    } else {
      throw new Error("No Set-Cookie header found");
    }

    if (!accessTokenObject || !refreshTokenObject) {
      throw new Error("Tokens not found in cookies");
    }

    // ─── Access Token set ─────────────────────────────────────────────────
    await deleteCookie("accessToken");
    await setCookie("accessToken", accessTokenObject.accessToken, {
      ...cookieOptions,
      maxAge: parseInt(accessTokenObject["Max-Age"]) || 60 * 60,
    });

    // ─── Refresh Token set ────────────────────────────────────────────────
    await deleteCookie("refreshToken");
    await setCookie("refreshToken", refreshTokenObject.refreshToken, {
      ...cookieOptions,
      maxAge: parseInt(refreshTokenObject["Max-Age"]) || 60 * 60 * 24 * 90,
    });

    return {
      tokenRefreshed: true,
      success: true,
      message: "Token refreshed successfully",
    };
  } catch (error: any) {
    await deleteCookie("accessToken");
    await deleteCookie("refreshToken");
    return {
      tokenRefreshed: false,
      refreshFailed: true,
      message: error?.message || "Something went wrong",
    };
  }
}
