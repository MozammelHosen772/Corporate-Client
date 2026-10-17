"use server";
import { serverFetch } from "@/lib/server-fetch";

interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface IProductVideo {
  videoUrl: string | null;
}

export const getProductVideo = async (
  productId: string,
): Promise<IProductVideo> => {
  const res = await serverFetch.get(`/products/${productId}/video`);
  const json: IApiResponse<IProductVideo> = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch video");
  }
  return json.data;
};

export const saveProductVideo = async (
  productId: string,
  payload: { videoUrl: string },
): Promise<IProductVideo> => {
  const res = await serverFetch.put(`/products/${productId}/video`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json: IApiResponse<IProductVideo> = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to save video");
  }
  return json.data;
};

export const removeProductVideo = async (productId: string): Promise<void> => {
  const res = await serverFetch.delete(`/products/${productId}/video`);
  const json: IApiResponse<null> = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to remove video");
  }
};
