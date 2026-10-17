"use server";

import { publicFetch } from "@/lib/public-fetch";
import { serverFetch } from "@/lib/server-fetch";
import {
  IBlog,
  IBlogMeta,
  ICreateBlogPayload,
  TBlogStatus,
} from "@/types/adminBlog.interface";
import { revalidateTag } from "next/cache";

interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: IBlogMeta;
}

const BLOGS_TAG = "blogs";
const blogTag = (slug: string) => `blog:${slug}`;

// ─── Get Published (Public list) ──────────────────────────────────────────────

export const getPublishedBlogs = async (
  params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  } = {},
): Promise<{ data: IBlog[]; meta: IBlogMeta }> => {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.category) query.set("category", params.category);
  if (params.search) query.set("search", params.search);

  const res = await publicFetch.get(`/blogs?${query.toString()}`, {
    next: { revalidate: 120, tags: [BLOGS_TAG] },
  });

  const json: IApiResponse<IBlog[]> = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch blogs");

  return {
    data: json.data ?? [],
    meta: json.meta ?? { total: 0, page: 1, limit: 9, totalPages: 1 },
  };
};

// ─── Get Single (Public, by slug) ─────────────────────────────────────────────

export const getBlogBySlug = async (slug: string): Promise<IBlog | null> => {
  const res = await publicFetch.get(`/blogs/slug/${slug}`, {
    next: { revalidate: 120, tags: [BLOGS_TAG, blogTag(slug)] },
  });

  if (res.status === 404) return null;

  const json: IApiResponse<IBlog> = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch blog");
  return json.data;
};

// ─── Create ───────────────────────────────────────────────────────────────────

export const createBlog = async (
  payload: ICreateBlogPayload,
): Promise<IBlog> => {
  const res = await serverFetch.post("/blogs", {
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });

  const data: IApiResponse<IBlog> = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create blog");

  revalidateTag(BLOGS_TAG, "max");
  return data.data;
};

// ─── Get All (Admin) ──────────────────────────────────────────────────────────

export const getAllBlogs = async (
  params: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    search?: string;
  } = {},
): Promise<{ data: IBlog[]; meta: IBlogMeta }> => {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.status) query.set("status", params.status);
  if (params.category) query.set("category", params.category);
  if (params.search) query.set("search", params.search);

  const res = await serverFetch.get(`/blogs/admin?${query.toString()}`, {
    cache: "no-store",
  });

  const json: IApiResponse<IBlog[]> = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch blogs");

  return {
    data: json.data ?? [],
    meta: json.meta ?? { total: 0, page: 1, limit: 10, totalPages: 1 },
  };
};

// ─── Get Single (Admin, by id) ────────────────────────────────────────────────

export const getBlogById = async (id: number): Promise<IBlog> => {
  const res = await serverFetch.get(`/blogs/admin/${id}`, {
    cache: "no-store",
  });

  const data: IApiResponse<IBlog> = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch blog");
  return data.data;
};

// ─── Update ───────────────────────────────────────────────────────────────────

export const updateBlog = async (
  id: number,
  payload: Partial<ICreateBlogPayload>,
): Promise<IBlog> => {
  const res = await serverFetch.patch(`/blogs/${id}`, {
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });

  const data: IApiResponse<IBlog> = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update blog");

  revalidateTag(BLOGS_TAG, "max");
  revalidateTag(blogTag(data.data.slug), "max");
  return data.data;
};

// ─── Update Status ────────────────────────────────────────────────────────────

export const updateBlogStatus = async (
  id: number,
  status: TBlogStatus,
): Promise<IBlog> => {
  const res = await serverFetch.patch(`/blogs/${id}/status`, {
    body: JSON.stringify({ status }),
    headers: { "Content-Type": "application/json" },
  });

  const data: IApiResponse<IBlog> = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update status");

  revalidateTag(BLOGS_TAG, "max");
  revalidateTag(blogTag(data.data.slug), "max");
  return data.data;
};

// ─── Delete ───────────────────────────────────────────────────────────────────

export const deleteBlog = async (id: number): Promise<void> => {
  const res = await serverFetch.delete(`/blogs/${id}`);
  const data: IApiResponse<null> = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete blog");

  revalidateTag(BLOGS_TAG, "max");
};
