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

export interface IMusicalInstrument {
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

export interface IMusicalInstrumentPayload {
  title?: string;
  description?: string;
  imageUrl?: string;
  publicId?: string;
}

export interface IMusicalInstrumentListParams {
  page?: number;
  limit?: number;
  search?: string;
  isPublished?: boolean;
}

const buildQuery = (params: IMusicalInstrumentListParams) => {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.isPublished !== undefined) {
    query.set("isPublished", String(params.isPublished));
  }
  return query.toString();
};

export const getAllMusicalInstruments = async (
  params: IMusicalInstrumentListParams = {},
): Promise<{ data: IMusicalInstrument[]; meta: IMediaMeta }> => {
  const query = buildQuery(params);
  const res = await serverFetch.get(
    `/media-content/musical-instrument${query ? `?${query}` : ""}`,
    { cache: "no-store" },
  );

  const json: IApiResponse<IMusicalInstrument[]> = await res.json();
  if (!json.success)
    throw new Error(json.message || "Failed to fetch musical instruments");

  return { data: json.data ?? [], meta: json.meta ?? defaultMeta() };
};

export const getMusicalInstrumentById = async (
  id: string,
): Promise<IMusicalInstrument | null> => {
  const res = await serverFetch.get(`/media-content/musical-instrument/${id}`, {
    cache: "no-store",
  });

  if (res.status === 404) return null;

  const json: IApiResponse<IMusicalInstrument> = await res.json();
  if (!json.success)
    throw new Error(json.message || "Failed to fetch musical instrument");

  return json.data;
};

export const createMusicalInstrument = async (
  payload: IMusicalInstrumentPayload,
): Promise<IMusicalInstrument> => {
  const res = await serverFetch.post("/media-content/musical-instrument", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json: IApiResponse<IMusicalInstrument> = await res.json();
  if (!json.success)
    throw new Error(json.message || "Failed to create musical instrument");

  revalidateMediaAdminPage();
  return json.data;
};

export const updateMusicalInstrument = async (
  id: string,
  payload: IMusicalInstrumentPayload,
): Promise<IMusicalInstrument> => {
  const res = await serverFetch.patch(
    `/media-content/musical-instrument/${id}`,
    {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  const json: IApiResponse<IMusicalInstrument> = await res.json();
  if (!json.success)
    throw new Error(json.message || "Failed to update musical instrument");

  revalidateMediaAdminPage();
  return json.data;
};

export const togglePublishMusicalInstrument = async (
  id: string,
  isPublished: boolean,
): Promise<IMusicalInstrument> => {
  const res = await serverFetch.patch(
    `/media-content/musical-instrument/${id}/publish`,
    {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished }),
    },
  );

  const json: IApiResponse<IMusicalInstrument> = await res.json();
  if (!json.success)
    throw new Error(json.message || "Failed to update publish status");

  revalidateMediaAdminPage();
  return json.data;
};

export const deleteMusicalInstrument = async (id: string): Promise<void> => {
  const res = await serverFetch.delete(
    `/media-content/musical-instrument/${id}`,
  );
  const json: IApiResponse<null> = await res.json();
  if (!json.success)
    throw new Error(json.message || "Failed to delete musical instrument");
  revalidateMediaAdminPage();
};