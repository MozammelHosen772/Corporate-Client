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

export type TAiConversationFileType = "txt" | "docx" | "pdf" | null;

export interface IAiConversation {
  id: string;
  title?: string | null;
  content?: string | null;
  fileType: TAiConversationFileType;
  isPublished: boolean;
  creator?: IMediaCreator;
  createdAt: string;
  updatedAt: string;
}

export interface IAiConversationListParams {
  page?: number;
  limit?: number;
  search?: string;
  isPublished?: boolean;
}

export interface ICreateAiConversationPayload {
  title?: string;
  content?: string;
}

export interface IUpdateAiConversationPayload {
  title?: string;
  content?: string;
}

const buildQuery = (params: IAiConversationListParams) => {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.isPublished !== undefined) {
    query.set("isPublished", String(params.isPublished));
  }
  return query.toString();
};

export const getAllAiConversations = async (
  params: IAiConversationListParams = {},
): Promise<{ data: IAiConversation[]; meta: IMediaMeta }> => {
  const query = buildQuery(params);
  const res = await serverFetch.get(
    `/media-content/ai-conversation${query ? `?${query}` : ""}`,
    { cache: "no-store" },
  );

  const json: IApiResponse<IAiConversation[]> = await res.json();
  if (!json.success)
    throw new Error(json.message || "Failed to fetch AI conversations");

  return { data: json.data ?? [], meta: json.meta ?? defaultMeta() };
};

export const getAiConversationById = async (
  id: string,
): Promise<IAiConversation | null> => {
  const res = await serverFetch.get(`/media-content/ai-conversation/${id}`, {
    cache: "no-store",
  });

  if (res.status === 404) return null;

  const json: IApiResponse<IAiConversation> = await res.json();
  if (!json.success)
    throw new Error(json.message || "Failed to fetch AI conversation");

  return json.data;
};

export const createAiConversation = async (
  payload: ICreateAiConversationPayload,
  file?: File | null,
): Promise<IAiConversation> => {
  const formData = new FormData();

  if (payload.title !== undefined) formData.append("title", payload.title);
  if (payload.content !== undefined)
    formData.append("content", payload.content);
  if (file) formData.append("file", file);

  const res = await serverFetch.post("/media-content/ai-conversation", {
    body: formData,
  });

  const json: IApiResponse<IAiConversation> = await res.json();
  if (!json.success)
    throw new Error(json.message || "Failed to create AI conversation");

  revalidateMediaAdminPage();
  return json.data;
};

export const updateAiConversation = async (
  id: string,
  payload: IUpdateAiConversationPayload,
  file?: File | null,
): Promise<IAiConversation> => {
  const formData = new FormData();

  if (payload.title !== undefined) formData.append("title", payload.title);
  if (payload.content !== undefined)
    formData.append("content", payload.content);
  if (file) formData.append("file", file);

  const res = await serverFetch.patch(`/media-content/ai-conversation/${id}`, {
    body: formData,
  });

  const json: IApiResponse<IAiConversation> = await res.json();
  if (!json.success)
    throw new Error(json.message || "Failed to update AI conversation");

  revalidateMediaAdminPage();
  return json.data;
};

export const togglePublishAiConversation = async (
  id: string,
  isPublished: boolean,
): Promise<IAiConversation> => {
  const res = await serverFetch.patch(
    `/media-content/ai-conversation/${id}/publish`,
    {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished }),
    },
  );

  const json: IApiResponse<IAiConversation> = await res.json();
  if (!json.success)
    throw new Error(json.message || "Failed to update publish status");

  revalidateMediaAdminPage();
  return json.data;
};

export const deleteAiConversation = async (id: string): Promise<void> => {
  const res = await serverFetch.delete(`/media-content/ai-conversation/${id}`);
  const json: IApiResponse<null> = await res.json();
  if (!json.success)
    throw new Error(json.message || "Failed to delete AI conversation");
  revalidateMediaAdminPage();
};
