/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";

export const sendOtpAction = async (
  _currentState: any,
  formData: any,
): Promise<any> => {
  try {
    const phone = formData.get("phone");

    const res = await serverFetch.post("/auth-otp/send-otp", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to send OTP",
      };
    }

    return {
      success: true,
      message: result.message || "OTP sent successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};
