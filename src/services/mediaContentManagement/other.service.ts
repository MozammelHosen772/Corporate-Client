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

export type TOtherFileType = "txt" | "docx" | "pdf" | null;

export interface IOtherMedia {
  id: string;
  title?: string | null;
  content?: string | null;
  fileType: TOtherFileType;
  isPublished: boolean;
  creator?: IMediaCreator;
  createdAt: string;
  updatedAt: string;
}

export interface IOtherMediaListParams {
  page?: number;
  limit?: number;
  search?: string;
  isPublished?: boolean;
}

const buildQuery = (params: IOtherMediaListParams) => {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.isPublished !== undefined) {
    query.set("isPublished", String(params.isPublished));
  }
  return query.toString();
};

export const getAllOtherMedia = async (
  params: IOtherMediaListParams = {},
): Promise<{ data: IOtherMedia[]; meta: IMediaMeta }> => {
  const query = buildQuery(params);
  const res = await serverFetch.get(
    `/media-content/other${query ? `?${query}` : ""}`,
    { cache: "no-store" },
  );

  const json: IApiResponse<IOtherMedia[]> = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch items");

  return { data: json.data ?? [], meta: json.meta ?? defaultMeta() };
};

export const getOtherMediaById = async (
  id: string,
): Promise<IOtherMedia | null> => {
  const res = await serverFetch.get(`/media-content/other/${id}`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;

  const json: IApiResponse<IOtherMedia> = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch item");

  return json.data;
};

export const createOtherMedia = async (
  payload: { title?: string; content?: string },
  file?: File | null,
): Promise<IOtherMedia> => {
  const formData = new FormData();
  if (payload.title !== undefined) formData.append("title", payload.title);
  if (payload.content !== undefined)
    formData.append("content", payload.content);
  if (file) formData.append("file", file);

  const res = await serverFetch.post("/media-content/other", {
    body: formData,
  });

  const json: IApiResponse<IOtherMedia> = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to create item");

  revalidateMediaAdminPage();
  return json.data;
};

export const updateOtherMedia = async (
  id: string,
  payload: { title?: string; content?: string },
  file?: File | null,
): Promise<IOtherMedia> => {
  const formData = new FormData();
  if (payload.title !== undefined) formData.append("title", payload.title);
  if (payload.content !== undefined)
    formData.append("content", payload.content);
  if (file) formData.append("file", file);

  const res = await serverFetch.patch(`/media-content/other/${id}`, {
    body: formData,
  });

  const json: IApiResponse<IOtherMedia> = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to update item");

  revalidateMediaAdminPage();
  return json.data;
};

export const togglePublishOtherMedia = async (
  id: string,
  isPublished: boolean,
): Promise<IOtherMedia> => {
  const res = await serverFetch.patch(`/media-content/other/${id}/publish`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isPublished }),
  });

  const json: IApiResponse<IOtherMedia> = await res.json();
  if (!json.success)
    throw new Error(json.message || "Failed to update publish status");

  revalidateMediaAdminPage();
  return json.data;
};

export const deleteOtherMedia = async (id: string): Promise<void> => {
  const res = await serverFetch.delete(`/media-content/other/${id}`);
  const json: IApiResponse<null> = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to delete item");
  revalidateMediaAdminPage();
};
