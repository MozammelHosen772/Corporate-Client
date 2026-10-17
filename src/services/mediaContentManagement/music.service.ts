"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidatePath } from "next/cache";
import { IMediaCreator, IMediaMeta } from "./audio.service";

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

export type TMusicType = "VIDEO" | "AUDIO";

export interface IMusic {
  id: string;
  title?: string | null;
  description?: string | null;
  type: TMusicType;
  youtubeUrl?: string | null;
  audioUrl?: string | null;
  publicId?: string | null;
  thumbnailUrl?: string | null;
  thumbnailPublicId?: string | null;
  isPublished: boolean;
  creator?: IMediaCreator;
  createdAt: string;
  updatedAt: string;
}

export interface IMusicListParams {
  page?: number;
  limit?: number;
  search?: string;
  isPublished?: boolean;
}

export interface IMusicPayload {
  title?: string;
  description?: string;
  type?: TMusicType; // update-এ লাগে না, create-এ required
  youtubeUrl?: string;
  audioUrl?: string;
  publicId?: string;
  thumbnailUrl?: string;
  thumbnailPublicId?: string;
}

const buildQuery = (params: IMusicListParams) => {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.isPublished !== undefined) {
    query.set("isPublished", String(params.isPublished));
  }
  return query.toString();
};

export const getAllMusic = async (
  params: IMusicListParams = {},
): Promise<{ data: IMusic[]; meta: IMediaMeta }> => {
  const query = buildQuery(params);
  const res = await serverFetch.get(
    `/media-content/music${query ? `?${query}` : ""}`,
    { cache: "no-store" },
  );

  const json: IApiResponse<IMusic[]> = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch music");

  return { data: json.data ?? [], meta: json.meta ?? defaultMeta() };
};

export const getMusicById = async (id: string): Promise<IMusic | null> => {
  const res = await serverFetch.get(`/media-content/music/${id}`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;

  const json: IApiResponse<IMusic> = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch music");

  return json.data;
};

export const createMusic = async (payload: IMusicPayload): Promise<IMusic> => {
  const res = await serverFetch.post("/media-content/music", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json: IApiResponse<IMusic> = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to create music");

  revalidateMediaAdminPage();
  return json.data;
};

export const updateMusic = async (
  id: string,
  payload: IMusicPayload,
): Promise<IMusic> => {
  const res = await serverFetch.patch(`/media-content/music/${id}`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json: IApiResponse<IMusic> = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to update music");

  revalidateMediaAdminPage();
  return json.data;
};

export const togglePublishMusic = async (
  id: string,
  isPublished: boolean,
): Promise<IMusic> => {
  const res = await serverFetch.patch(`/media-content/music/${id}/publish`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isPublished }),
  });

  const json: IApiResponse<IMusic> = await res.json();
  if (!json.success)
    throw new Error(json.message || "Failed to update publish status");

  revalidateMediaAdminPage();
  return json.data;
};

export const deleteMusic = async (id: string): Promise<void> => {
  const res = await serverFetch.delete(`/media-content/music/${id}`);
  const json: IApiResponse<null> = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to delete music");
  revalidateMediaAdminPage();
};

// ─── Dedicated raw audio uploader (thumbnail generic /upload-image দিয়ে) ───
export const uploadMusicAudio = async (
  file: File,
): Promise<{ url: string; publicId: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await serverFetch.post("/media-content/music/upload-audio", {
    body: formData,
  });

  const json: IApiResponse<{ url: string; publicId: string }> =
    await res.json();
  if (!json.success) throw new Error(json.message || "Failed to upload audio");

  return json.data;
};
