"use server";
import { serverFetch } from "@/lib/server-fetch";

// ─── Media Types ───────────────────────────────────────────────────────────────
export interface IProductMedia {
  id: string;
  productId: string;
  url: string;
  publicId: string;
  name: string;
  fileType: "IMAGE" | "VIDEO" | "PDF";
  isMain: boolean;
  createdAt: string;
}
interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
export interface ICreateMediaPayload {
  url: string;
  publicId: string;
  name: string;
  fileType: string;
  isMain: boolean;
}

// ─── Save Product Media ────────────────────────────────────────────────────────
export const saveProductMedia = async (
  productId: string,
  payload: {
    media: ICreateMediaPayload[];
  },
): Promise<IProductMedia[]> => {
  const res = await serverFetch.patch(`/products/${productId}/media`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json: IApiResponse<IProductMedia[]> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to save media");
  }

  return json.data;
};

// ─── Get Product Media ─────────────────────────────────────────────────────────
export const getProductMedia = async (
  productId: string,
): Promise<IProductMedia[]> => {
  const res = await serverFetch.get(`/products/${productId}/media`);

  const json: IApiResponse<IProductMedia[]> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch media");
  }

  return json.data;
};
