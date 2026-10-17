// ─── Related Products ──────────────────────────────────────────────────────────
"use server";
import { serverFetch } from "@/lib/server-fetch";

export interface IRelatedProduct {
  id: string;
  name: string;
  slug: string;
  sellingPrice: number;
}
interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
export const getRelatedProducts = async (
  productId: string,
): Promise<IRelatedProduct[]> => {
  const res = await serverFetch.get(`/products/${productId}/related`);
  const json: IApiResponse<IRelatedProduct[]> = await res.json();

  if (!res.ok || !json.success)
    throw new Error(json.message || "Failed to fetch related products");

  return json.data;
};

export const updateRelatedProducts = async (
  productId: string,
  relatedProductIds: string[],
): Promise<void> => {
  const res = await serverFetch.patch(`/products/${productId}/related`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ relatedProductIds }),
  });

  const json: IApiResponse<null> = await res.json();

  if (!res.ok || !json.success)
    throw new Error(json.message || "Failed to update related products");
};
