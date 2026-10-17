"use server";

import { serverFetch } from "@/lib/server-fetch";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TPaymentCategory = "MOBILE_WALLET" | "BANK";

export interface TPaymentMethod {
  id: string;
  category: TPaymentCategory;
  provider: string;
  accountType: string;
  amount?: number;
  accountNumber: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Public checkout list এ amount/isActive দরকার নেই, তাই আলাদা lighter type
export interface TActivePaymentMethod {
  id: string;
  category: TPaymentCategory;
  provider: string;
  accountType: string;
  accountNumber: string;
}

export interface TPaymentMethodMeta {
  total: number;
  page: number;
  limit: number;
  totalPage: number;
}

interface TApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: TPaymentMethodMeta;
}

// ─── Get Active Payment Methods (Public — checkout page) ─────────────────────

export const getActivePaymentMethods = async (): Promise<
  TActivePaymentMethod[]
> => {
  const res = await serverFetch.get("/payment-methods/active", {
    cache: "no-store",
  });

  const data: TApiResponse<TActivePaymentMethod[]> = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Failed to fetch payment methods");

  return data.data ?? [];
};

// ─── Get All Payment Methods (Admin) ──────────────────────────────────────────

export const getAllPaymentMethods = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: TPaymentCategory;
  provider?: string;
  status?: "active" | "inactive";
}): Promise<{ data: TPaymentMethod[]; meta: TPaymentMethodMeta }> => {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.search) query.set("search", params.search);
  if (params?.category) query.set("category", params.category);
  if (params?.provider) query.set("provider", params.provider);
  if (params?.status) query.set("status", params.status);

  const res = await serverFetch.get(`/payment-methods?${query.toString()}`, {
    cache: "no-store",
  });

  const data: TApiResponse<TPaymentMethod[]> = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Failed to fetch payment methods");

  return {
    data: data.data ?? [],
    meta: data.meta ?? { total: 0, page: 1, limit: 10, totalPage: 1 },
  };
};

// ─── Get Single Payment Method (Admin) ────────────────────────────────────────

export const getPaymentMethodById = async (
  id: string,
): Promise<TPaymentMethod> => {
  const res = await serverFetch.get(`/payment-methods/${id}`, {
    cache: "no-store",
  });

  const data: TApiResponse<TPaymentMethod> = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Failed to fetch payment method");

  return data.data;
};

// ─── Create Payment Method (Admin) ────────────────────────────────────────────

export const createPaymentMethod = async (payload: {
  category: TPaymentCategory;
  provider: string;
  accountType: string;
  amount?: number;
  accountNumber: string;
  isActive?: boolean;
}): Promise<TPaymentMethod> => {
  const res = await serverFetch.post("/payment-methods", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data: TApiResponse<TPaymentMethod> = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to add payment method");

  return data.data;
};

// ─── Update Payment Method (Admin) ────────────────────────────────────────────

export const updatePaymentMethod = async (
  id: string,
  payload: Partial<{
    category: TPaymentCategory;
    provider: string;
    accountType: string;
    amount: number;
    accountNumber: string;
    isActive: boolean;
  }>,
): Promise<TPaymentMethod> => {
  const res = await serverFetch.patch(`/payment-methods/${id}`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data: TApiResponse<TPaymentMethod> = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Failed to update payment method");

  return data.data;
};

// ─── Toggle Active Status (Admin) ─────────────────────────────────────────────

export const togglePaymentMethodStatus = async (
  id: string,
  currentStatus: boolean,
): Promise<TPaymentMethod> => {
  return updatePaymentMethod(id, { isActive: !currentStatus });
};

// ─── Delete Payment Method (Admin) ────────────────────────────────────────────

export const deletePaymentMethod = async (id: string): Promise<void> => {
  const res = await serverFetch.delete(`/payment-methods/${id}`);

  const data: TApiResponse<null> = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Failed to delete payment method");
};
