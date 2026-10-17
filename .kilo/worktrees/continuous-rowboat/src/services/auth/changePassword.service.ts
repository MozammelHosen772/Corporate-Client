/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await serverFetch.patch("/auth/change-password", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const result = await response.json().catch(() => null);
    if (!result) return { success: false, message: "Something went wrong" };
    return result;
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong" };
  }
};

export const verifyPasswordAction = async (
  currentPassword: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await serverFetch.post("/auth/verify-password", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword }),
    });
    const result = await response.json().catch(() => null);
    if (!result) return { success: false, message: "Something went wrong" };
    return result;
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong" };
  }
};
