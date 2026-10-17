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

// ================= AUDIO =================

export interface IAudio {
  id: string;
  title?: string | null;
  description?: string | null;
  audioUrl: string;
  publicId: string;
  isPublished: boolean;
  creator?: IMediaCreator;
  createdAt: string;
  updatedAt: string;
}

export interface IAudioListParams {
  page?: number;
  limit?: number;
  search?: string;
  isPublished?: boolean;
}

const buildQuery = (params: IAudioListParams) => {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.isPublished !== undefined) {
    query.set("isPublished", String(params.isPublished));
  }
  return query.toString();
};

export const getAllAudios = async (
  params: IAudioListParams = {},
): Promise<{ data: IAudio[]; meta: IMediaMeta }> => {
  const query = buildQuery(params);
  const res = await serverFetch.get(
    `/media-content/audio${query ? `?${query}` : ""}`,
    {
      cache: "no-store",
    },
  );

  const json: IApiResponse<IAudio[]> = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch audios");

  return { data: json.data ?? [], meta: json.meta ?? defaultMeta() };
};

export const createAudio = async (
  payload: { title?: string; description?: string },
  file: File,
): Promise<IAudio> => {
  const formData = new FormData();
  if (payload.title !== undefined) formData.append("title", payload.title);
  if (payload.description !== undefined)
    formData.append("description", payload.description);
  formData.append("file", file);

  const res = await serverFetch.post("/media-content/audio", {
    body: formData,
  });

  const json: IApiResponse<IAudio> = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to create audio");

  revalidateMediaAdminPage();
  return json.data;
};
export const getAudioById = async (id: string): Promise<IAudio | null> => {
  const res = await serverFetch.get(`/media-content/audio/${id}`, {
    cache: "no-store",
  });

  if (res.status === 404) {
    return null;
  }

  const json: IApiResponse<IAudio> = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch audio");

  return json.data;
};
export const updateAudio = async (
  id: string,
  payload: { title?: string; description?: string },
  file?: File | null,
): Promise<IAudio> => {
  const formData = new FormData();
  if (payload.title !== undefined) formData.append("title", payload.title);
  if (payload.description !== undefined)
    formData.append("description", payload.description);
  if (file) formData.append("file", file);

  const res = await serverFetch.patch(`/media-content/audio/${id}`, {
    body: formData,
  });

  const json: IApiResponse<IAudio> = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to update audio");

  revalidateMediaAdminPage();
  return json.data;
};

export const togglePublishAudio = async (
  id: string,
  isPublished: boolean,
): Promise<IAudio> => {
  const res = await serverFetch.patch(`/media-content/audio/${id}/publish`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isPublished }),
  });

  const json: IApiResponse<IAudio> = await res.json();
  if (!json.success)
    throw new Error(json.message || "Failed to update publish status");

  revalidateMediaAdminPage();
  return json.data;
};

export const deleteAudio = async (id: string): Promise<void> => {
  const res = await serverFetch.delete(`/media-content/audio/${id}`);
  const json: IApiResponse<null> = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to delete audio");
  revalidateMediaAdminPage();
};
