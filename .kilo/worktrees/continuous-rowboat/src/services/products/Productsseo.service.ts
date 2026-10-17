"use server";
import { serverFetch } from "@/lib/server-fetch";

interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface IProductSeo {
  id: string;
  productId: string;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null; // comma-separated
  createdAt: string;
  updatedAt: string;
}

export interface IUpsertSeoPayload {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string; // comma-separated
}

export const getProductSeo = async (
  productId: string,
): Promise<IProductSeo | null> => {
  const res = await serverFetch.get(`/products/${productId}/seo`);
  const json: IApiResponse<IProductSeo | null> = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch SEO");
  }
  return json.data;
};

export const upsertProductSeo = async (
  productId: string,
  payload: IUpsertSeoPayload,
): Promise<IProductSeo> => {
  const res = await serverFetch.put(`/products/${productId}/seo`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json: IApiResponse<IProductSeo> = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to save SEO");
  }
  return json.data;
};
