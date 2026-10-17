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

// ================= VIDEO =================

export interface IVideo {
  id: string;
  title?: string | null;
  description?: string | null;
  youtubeUrl: string;
  isPublished: boolean;
  creator?: IMediaCreator;
  createdAt: string;
  updatedAt: string;
}

export interface IVideoPayload {
  title?: string;
  description?: string;
  youtubeUrl: string;
}

export interface IVideoListParams {
  page?: number;
  limit?: number;
  search?: string;
  isPublished?: boolean;
}

const buildQuery = (params: IVideoListParams) => {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.isPublished !== undefined) {
    query.set("isPublished", String(params.isPublished));
  }
  return query.toString();
};

export const getAllVideos = async (
  params: IVideoListParams = {},
): Promise<{ data: IVideo[]; meta: IMediaMeta }> => {
  const query = buildQuery(params);
  const res = await serverFetch.get(
    `/media-content/video${query ? `?${query}` : ""}`,
    {
      cache: "no-store",
    },
  );

  const json: IApiResponse<IVideo[]> = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch videos");

  return { data: json.data ?? [], meta: json.meta ?? defaultMeta() };
};

export const createVideo = async (payload: IVideoPayload): Promise<IVideo> => {
  const res = await serverFetch.post("/media-content/video", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json: IApiResponse<IVideo> = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to create video");

  revalidateMediaAdminPage();
  return json.data;
};

export const updateVideo = async (
  id: string,
  payload: Partial<IVideoPayload>,
): Promise<IVideo> => {
  const res = await serverFetch.patch(`/media-content/video/${id}`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json: IApiResponse<IVideo> = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to update video");

  revalidateMediaAdminPage();
  return json.data;
};

export const togglePublishVideo = async (
  id: string,
  isPublished: boolean,
): Promise<IVideo> => {
  const res = await serverFetch.patch(`/media-content/video/${id}/publish`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isPublished }),
  });

  const json: IApiResponse<IVideo> = await res.json();
  if (!json.success)
    throw new Error(json.message || "Failed to update publish status");

  revalidateMediaAdminPage();
  return json.data;
};
export const getVideoById = async (id: string): Promise<IVideo | null> => {
  const res = await serverFetch.get(`/media-content/video/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  const json: IApiResponse<IVideo> = await res.json();

  if (!json.success) {
    return null;
  }

  return json.data;
};
export const deleteVideo = async (id: string): Promise<void> => {
  const res = await serverFetch.delete(`/media-content/video/${id}`);
  const json: IApiResponse<null> = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to delete video");
  revalidateMediaAdminPage();
};
