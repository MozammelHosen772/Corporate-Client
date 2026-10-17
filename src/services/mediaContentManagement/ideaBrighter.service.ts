"use server";

import { publicFetch } from "@/lib/public-fetch";
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

export interface IIdeaBrighter {
  id: string;
  title?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  publicId?: string | null;
  isPublished: boolean;
  creator?: IMediaCreator;
  createdAt: string;
  updatedAt: string;
}

export interface IIdeaBrighterPayload {
  title?: string;
  description?: string;
  imageUrl?: string;
  publicId?: string;
}

export interface IIdeaBrighterListParams {
  page?: number;
  limit?: number;
  search?: string;
  isPublished?: boolean;
}
interface IPublicApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const buildQuery = (params: IIdeaBrighterListParams) => {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.isPublished !== undefined) {
    query.set("isPublished", String(params.isPublished));
  }
  return query.toString();
};

export const getAllPublicIdeaBrighters = async (
  params: IIdeaBrighterListParams = {},
): Promise<{ data: IIdeaBrighter[]; meta: IMediaMeta }> => {
  const query = buildQuery(params);
  const res = await publicFetch.get(
    `/media-content/idea-brighter${query ? `?${query}` : ""}`,
    { cache: "no-store" },
  );

  const json: IApiResponse<IIdeaBrighter[]> = await res.json();
  if (!json.success)
    throw new Error(json.message || "Failed to fetch AI Explore items");

  return { data: json.data ?? [], meta: json.meta ?? defaultMeta() };
};

export const getAllIdeaBrighters = async (
  params: IIdeaBrighterListParams = {},
): Promise<{ data: IIdeaBrighter[]; meta: IMediaMeta }> => {
  const query = buildQuery(params);
  const res = await serverFetch.get(
    `/media-content/idea-brighter${query ? `?${query}` : ""}`,
    { cache: "no-store" },
  );

  const json: IApiResponse<IIdeaBrighter[]> = await res.json();
  if (!json.success)
    throw new Error(json.message || "Failed to fetch AI Explore items");

  return { data: json.data ?? [], meta: json.meta ?? defaultMeta() };
};
export const getPublicIdeaBrighterById = async (
  id: string,
): Promise<IIdeaBrighter | null> => {
  const res = await publicFetch.get(`/media-content/idea-brighter/${id}`, {
    cache: "no-store",
  });

  if (res.status === 404) return null;

  const json: IApiResponse<IIdeaBrighter> = await res.json();
  if (!json.success)
    throw new Error(json.message || "Failed to fetch Idea Brighter item");

  return json.data;
};
export const getIdeaBrighterById = async (
  id: string,
): Promise<IIdeaBrighter | null> => {
  const res = await serverFetch.get(`/media-content/idea-brighter/${id}`, {
    cache: "no-store",
  });

  if (res.status === 404) return null;

  const json: IApiResponse<IIdeaBrighter> = await res.json();
  if (!json.success)
    throw new Error(json.message || "Failed to fetch AI Explore item");

  return json.data;
};

export const createIdeaBrighter = async (
  payload: IIdeaBrighterPayload,
): Promise<IIdeaBrighter> => {
  const res = await serverFetch.post("/media-content/idea-brighter", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json: IApiResponse<IIdeaBrighter> = await res.json();
  if (!json.success)
    throw new Error(json.message || "Failed to create AI Explore item");

  revalidateMediaAdminPage();
  return json.data;
};

export const updateIdeaBrighter = async (
  id: string,
  payload: IIdeaBrighterPayload,
): Promise<IIdeaBrighter> => {
  const res = await serverFetch.patch(`/media-content/idea-brighter/${id}`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json: IApiResponse<IIdeaBrighter> = await res.json();
  if (!json.success)
    throw new Error(json.message || "Failed to update AI Explore item");

  revalidateMediaAdminPage();
  return json.data;
};

export const togglePublishIdeaBrighter = async (
  id: string,
  isPublished: boolean,
): Promise<IIdeaBrighter> => {
  const res = await serverFetch.patch(
    `/media-content/idea-brighter/${id}/publish`,
    {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished }),
    },
  );

  const json: IApiResponse<IIdeaBrighter> = await res.json();
  if (!json.success)
    throw new Error(json.message || "Failed to update publish status");

  revalidateMediaAdminPage();
  return json.data;
};

export const deleteIdeaBrighter = async (id: string): Promise<void> => {
  const res = await serverFetch.delete(`/media-content/idea-brighter/${id}`);
  const json: IApiResponse<null> = await res.json();
  if (!json.success)
    throw new Error(json.message || "Failed to delete AI Explore item");
  revalidateMediaAdminPage();
};
