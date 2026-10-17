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

export interface ITheGround {
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

export interface ITheGroundPayload {
  title?: string;
  description?: string;
  imageUrl?: string;
  publicId?: string;
}

export interface ITheGroundListParams {
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

const buildQuery = (params: ITheGroundListParams) => {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.isPublished !== undefined) {
    query.set("isPublished", String(params.isPublished));
  }
  return query.toString();
};

export const getAllPublicTheGrounds = async (
  params: ITheGroundListParams = {},
): Promise<{ data: ITheGround[]; meta: IMediaMeta }> => {
  const query = buildQuery(params);
  const res = await publicFetch.get(
    `/media-content/the-ground${query ? `?${query}` : ""}`,
    { cache: "no-store" },
  );

  const json: IApiResponse<ITheGround[]> = await res.json();
  if (!json.success)
    throw new Error(json.message || "Failed to fetch AI Explore items");

  return { data: json.data ?? [], meta: json.meta ?? defaultMeta() };
};

export const getAllTheGrounds = async (
  params: ITheGroundListParams = {},
): Promise<{ data: ITheGround[]; meta: IMediaMeta }> => {
  const query = buildQuery(params);
  const res = await serverFetch.get(
    `/media-content/the-ground${query ? `?${query}` : ""}`,
    { cache: "no-store" },
  );

  const json: IApiResponse<ITheGround[]> = await res.json();
  if (!json.success)
    throw new Error(json.message || "Failed to fetch AI Explore items");

  return { data: json.data ?? [], meta: json.meta ?? defaultMeta() };
};

export const getTheGroundById = async (
  id: string,
): Promise<ITheGround | null> => {
  const res = await serverFetch.get(`/media-content/the-ground/${id}`, {
    cache: "no-store",
  });

  if (res.status === 404) return null;

  const json: IApiResponse<ITheGround> = await res.json();
  if (!json.success)
    throw new Error(json.message || "Failed to fetch AI Explore item");

  return json.data;
};

export const createTheGround = async (
  payload: ITheGroundPayload,
): Promise<ITheGround> => {
  const res = await serverFetch.post("/media-content/the-ground", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json: IApiResponse<ITheGround> = await res.json();
  if (!json.success)
    throw new Error(json.message || "Failed to create AI Explore item");

  revalidateMediaAdminPage();
  return json.data;
};

export const updateTheGround = async (
  id: string,
  payload: ITheGroundPayload,
): Promise<ITheGround> => {
  const res = await serverFetch.patch(`/media-content/the-ground/${id}`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json: IApiResponse<ITheGround> = await res.json();
  if (!json.success)
    throw new Error(json.message || "Failed to update AI Explore item");

  revalidateMediaAdminPage();
  return json.data;
};

export const togglePublishTheGround = async (
  id: string,
  isPublished: boolean,
): Promise<ITheGround> => {
  const res = await serverFetch.patch(
    `/media-content/the-ground/${id}/publish`,
    {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished }),
    },
  );

  const json: IApiResponse<ITheGround> = await res.json();
  if (!json.success)
    throw new Error(json.message || "Failed to update publish status");

  revalidateMediaAdminPage();
  return json.data;
};

export const deleteTheGround = async (id: string): Promise<void> => {
  const res = await serverFetch.delete(`/media-content/the-ground/${id}`);
  const json: IApiResponse<null> = await res.json();
  if (!json.success)
    throw new Error(json.message || "Failed to delete AI Explore item");
  revalidateMediaAdminPage();
};
