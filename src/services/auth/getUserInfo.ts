"use server";
import { serverFetch } from "@/lib/server-fetch";
import { getCookie } from "@/services/auth/tokenHandlers";
import type { UserInfo } from "@/types/user.interface";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export const getUserInfo = async (): Promise<UserInfo | null> => {
  try {
    const accessToken = await getCookie("accessToken");
    const refreshToken = await getCookie("refreshToken");

    // দুটোই নেই — definitely logged out
    if (!accessToken && !refreshToken) return null;

    const response = await serverFetch.get("/user/me", {
      cache: "no-store",
    });

    if (!response.ok) return null;

    const result = await response.json();
    if (!result.success) return null;

    return {
      id: result.data?.id,
      name: result.data?.name,
      profilePicture: result.data?.profilePicture,
      phone: result.data?.phone,
      email: result.data?.email,
      address: result.data?.address,
      gender: result.data?.gender,
      role: result.data?.userRole,
      status: result.data?.userStatus,
      createdAt: result.data?.createdAt,
      updatedAt: result.data?.updatedAt,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return null;
  }
};
