"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidatePath } from "next/cache";

// ================= SHARED TYPES =================

export interface IMediaCreator {
  id: number;
  name: string;
  email: string;
  phone?: string;
  profilePicture?: string | null;
}

export interface IMediaMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: IMediaMeta;
}

const defaultMeta = (): IMediaMeta => ({
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
});

const revalidateMediaAdminPage = () =>
  revalidatePath("/admin/dashboard/media-content-management", "page");

// ================= IMAGE =================

export interface IImage {
  id: string;
  title?: string | null;
  description?: string | null;
  imageUrl: string;
  publicId: string;
  isPublished: boolean;
  creator?: IMediaCreator;
  createdAt: string;
  updatedAt: string;
}

export interface IImagePayload {
  title?: string;
  description?: string;
  imageUrl: string;
  publicId: string;
}

export interface IImageListParams {
  page?: number;
  limit?: number;
  search?: string;
  isPublished?: boolean;
}

const buildQuery = (params: IImageListParams) => {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.isPublished !== undefined) {
    query.set("isPublished", String(params.isPublished));
  }
  return query.toString();
};

export const getAllImages = async (
  params: IImageListParams = {},
): Promise<{ data: IImage[]; meta: IMediaMeta }> => {
  const query = buildQuery(params);
  const res = await serverFetch.get(
    `/media-content/image${query ? `?${query}` : ""}`,
    {
      cache: "no-store",
    },
  );

  const json: IApiResponse<IImage[]> = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch images");

  return { data: json.data ?? [], meta: json.meta ?? defaultMeta() };
};

export const createImage = async (payload: IImagePayload): Promise<IImage> => {
  const res = await serverFetch.post("/media-content/image", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json: IApiResponse<IImage> = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to create image");

  revalidateMediaAdminPage();
  return json.data;
};

export const updateImage = async (
  id: string,
  payload: Partial<IImagePayload> & { title?: string; description?: string },
): Promise<IImage> => {
  const res = await serverFetch.patch(`/media-content/image/${id}`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json: IApiResponse<IImage> = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to update image");

  revalidateMediaAdminPage();
  return json.data;
};
export const getImageById = async (id: string): Promise<IImage | null> => {
  const res = await serverFetch.get(`/media-content/image/${id}`, {
    cache: "no-store",
  });

  if (res.status === 404) {
    return null;
  }

  const json: IApiResponse<IImage> = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch image");

  return json.data;
};
export const togglePublishImage = async (
  id: string,
  isPublished: boolean,
): Promise<IImage> => {
  const res = await serverFetch.patch(`/media-content/image/${id}/publish`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isPublished }),
  });

  const json: IApiResponse<IImage> = await res.json();
  if (!json.success)
    throw new Error(json.message || "Failed to update publish status");

  revalidateMediaAdminPage();
  return json.data;
};

export const deleteImage = async (id: string): Promise<void> => {
  const res = await serverFetch.delete(`/media-content/image/${id}`);
  const json: IApiResponse<null> = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to delete image");
  revalidateMediaAdminPage();
};
