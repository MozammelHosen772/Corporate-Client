"use server";
import { serverFetch } from "@/lib/server-fetch";

interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface IShipping {
  id: string;
  productId: string;
  shippingType: "free" | "flat_rate";
  shippingCost: number;
  isQuantityMultiply: boolean;
  returnPolicy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IUpsertShippingPayload {
  shippingType: "free" | "flat_rate";
  shippingCost: number;
  isQuantityMultiply: boolean;
  returnPolicy?: string;
}

export const getProductShipping = async (
  productId: string,
): Promise<IShipping | null> => {
  const res = await serverFetch.get(`/products/${productId}/shipping`);
  const json: IApiResponse<IShipping | null> = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch shipping");
  }
  return json.data;
};

export const upsertProductShipping = async (
  productId: string,
  payload: IUpsertShippingPayload,
): Promise<IShipping> => {
  const res = await serverFetch.put(`/products/${productId}/shipping`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json: IApiResponse<IShipping> = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to save shipping");
  }
  return json.data;
};
