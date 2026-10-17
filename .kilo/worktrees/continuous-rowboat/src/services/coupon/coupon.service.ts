"use server";

import { serverFetch } from "@/lib/server-fetch";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TCouponType = "PERCENTAGE" | "FIXED" | "FREE_DELIVERY";

export interface TCoupon {
  id: string;
  code: string;
  type: TCouponType;
  value: number;
  minOrderAmount: number;
  maxDiscount: number | null;
  isActive: boolean;
  expiresAt: string | null;
  usageLimit: number | null;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TValidateCouponResult {
  discount: number;
  freeDelivery: boolean;
  type: TCouponType;
  value: number;
  code: string;
  minOrderAmount: number;
}

export interface TCouponMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface TApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: TCouponMeta;
}
export interface TValidateCouponResponse {
  success: boolean;
  message?: string;
  data?: TValidateCouponResult;
}

export const validateCoupon = async (
  code: string,
  orderTotal: number,
): Promise<TValidateCouponResponse> => {
  try {
    const res = await serverFetch.post("/coupons/validate", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, orderTotal }),
    });

    const data: TApiResponse<TValidateCouponResult> = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Invalid coupon code" };
    }

    return { success: true, data: data.data };
  } catch (error) {
    console.error("validateCoupon error:", error);
    return {
      success: false,
      message: "Something went wrong, please try again",
    };
  }
};
// ─── Validate Coupon (User) ───────────────────────────────────────────────────

// export const validateCoupon = async (
//   code: string,
//   orderTotal: number,
// ): Promise<TValidateCouponResult> => {
//   const res = await serverFetch.post("/coupons/validate", {
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ code, orderTotal }),
//   });

//   const data: TApiResponse<TValidateCouponResult> = await res.json();
//   if (!res.ok) throw new Error(data.message || "Invalid coupon");

//   return data.data;
// };

// ─── Get All Coupons (Admin) ──────────────────────────────────────────────────

export const getAllCoupons = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "inactive";
}): Promise<{ data: TCoupon[]; meta: TCouponMeta }> => {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.search) query.set("search", params.search);
  if (params?.status) query.set("status", params.status);

  const res = await serverFetch.get(`/coupons?${query.toString()}`, {
    cache: "no-store",
  });

  const data: TApiResponse<TCoupon[]> = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch coupons");

  return {
    data: data.data ?? [],
    meta: data.meta ?? { total: 0, page: 1, limit: 10, totalPages: 1 },
  };
};

// ─── Get Single Coupon (Admin) ────────────────────────────────────────────────

export const getCouponById = async (id: string): Promise<TCoupon> => {
  const res = await serverFetch.get(`/coupons/${id}`, {
    cache: "no-store",
  });

  const data: TApiResponse<TCoupon> = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch coupon");

  return data.data;
};

// ─── Create Coupon (Admin) ────────────────────────────────────────────────────

export const createCoupon = async (payload: {
  code: string;
  type: TCouponType;
  value?: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  isActive?: boolean;
  expiresAt?: string;
  usageLimit?: number;
}): Promise<TCoupon> => {
  const res = await serverFetch.post("/coupons", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data: TApiResponse<TCoupon> = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create coupon");

  return data.data;
};

// ─── Update Coupon (Admin) ────────────────────────────────────────────────────

export const updateCoupon = async (
  id: string,
  payload: Partial<{
    code: string;
    type: TCouponType;
    value: number;
    minOrderAmount: number;
    maxDiscount: number | null;
    isActive: boolean;
    expiresAt: string | null;
    usageLimit: number | null;
  }>,
): Promise<TCoupon> => {
  const res = await serverFetch.patch(`/coupons/${id}`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data: TApiResponse<TCoupon> = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update coupon");

  return data.data;
};

// ─── Toggle Active Status (Admin) ─────────────────────────────────────────────

export const toggleCouponStatus = async (
  id: string,
  currentStatus: boolean,
): Promise<TCoupon> => {
  return updateCoupon(id, { isActive: !currentStatus });
};

// ─── Delete Coupon (Admin) ────────────────────────────────────────────────────

export const deleteCoupon = async (id: string): Promise<void> => {
  const res = await serverFetch.delete(`/coupons/${id}`);

  const data: TApiResponse<null> = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete coupon");
};
