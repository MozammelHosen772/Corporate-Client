"use server";
import { serverFetch } from "@/lib/server-fetch";

// ─── Shared Response Type ──────────────────────────────────────────────────────
interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ─── Variation Types ───────────────────────────────────────────────────────────
export interface IVariation {
  id: string;
  productId: string;
  color: string;
  size: string;
  price: number;
  sku: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateVariationPayload {
  color: string;
  size: string;
  price: number;
  sku: string;
}

// ─── Get Variations ────────────────────────────────────────────────────────────
export const getProductVariations = async (
  productId: string,
): Promise<IVariation[]> => {
  const res = await serverFetch.get(`/products/${productId}/variations`);
  const json: IApiResponse<IVariation[]> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch variations");
  }

  return json.data;
};

// ─── Create Variation ──────────────────────────────────────────────────────────
export const createProductVariation = async (
  productId: string,
  payload: ICreateVariationPayload,
): Promise<IVariation> => {
  const res = await serverFetch.post(`/products/${productId}/variations`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json: IApiResponse<IVariation> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to create variation");
  }

  return json.data;
};

// ─── Delete Variation ──────────────────────────────────────────────────────────
export const deleteProductVariation = async (
  productId: string,
  variationId: string,
): Promise<void> => {
  const res = await serverFetch.delete(
    `/products/${productId}/variations/${variationId}`,
  );
  const json: IApiResponse<null> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to delete variation");
  }
};
