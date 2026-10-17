// app/blog/blog.service.ts (অথবা services/blog/blog.service.ts — তোমার structure অনুযায়ী)
"use server";

import { publicFetch } from "@/lib/public-fetch";
import { serverFetch } from "@/lib/server-fetch";

export type TBlogStatus = "DRAFT" | "PUBLISHED";

export interface TBlog {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  thumbnail: string | null;
  status: TBlogStatus;
  metaTitle: string | null;
  metaDescription: string | null;
  category: string | null;
  tags: string[];
  views: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  author?: { id: number; email: string | null } | null;
}

export interface TBlogMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TBlogPayload {
  title: string;
  excerpt?: string;
  content: string;
  thumbnail?: string;
  status?: TBlogStatus;
  metaTitle?: string;
  metaDescription?: string;
  category?: string;
  tags?: string[];
}

interface TApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: TBlogMeta;
}

// ─── Get Published (Public list) ──────────────────────────────────────────────

export const getPublishedBlogs = async (
  params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  } = {},
): Promise<{ data: TBlog[]; meta: TBlogMeta }> => {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.category) query.set("category", params.category);
  if (params.search) query.set("search", params.search);

  const res = await publicFetch.get(`/blogs?${query.toString()}`, {
    next: { revalidate: 60 },
  });

  const json: TApiResponse<TBlog[]> = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch blogs");

  return {
    data: json.data ?? [],
    meta: json.meta ?? { total: 0, page: 1, limit: 9, totalPages: 1 },
  };
};

// ─── Get Single (Public, by slug) ─────────────────────────────────────────────

export const getBlogBySlug = async (slug: string): Promise<TBlog | null> => {
  const res = await publicFetch.get(`/blogs/slug/${slug}`, {
    next: { revalidate: 60 },
  });

  if (res.status === 404) return null;

  const json: TApiResponse<TBlog> = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch blog");
  return json.data;
};

// ─── Create ───────────────────────────────────────────────────────────────────

export const createBlog = async (payload: TBlogPayload): Promise<TBlog> => {
  const res = await serverFetch.post("/blogs", {
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });

  const data: TApiResponse<TBlog> = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create blog");
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
): Promise<{ data: TBlog[]; meta: TBlogMeta }> => {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.status) query.set("status", params.status);
  if (params.category) query.set("category", params.category);
  if (params.search) query.set("search", params.search);

  const res = await serverFetch.get(`/blogs/admin?${query.toString()}`, {
    cache: "no-store",
  });

  const json: TApiResponse<TBlog[]> = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch blogs");

  return {
    data: json.data ?? [],
    meta: json.meta ?? { total: 0, page: 1, limit: 10, totalPages: 1 },
  };
};

// ─── Get Single (Admin, by id) ────────────────────────────────────────────────

export const getBlogById = async (id: number): Promise<TBlog> => {
  const res = await serverFetch.get(`/blogs/admin/${id}`, {
    cache: "no-store",
  });

  const data: TApiResponse<TBlog> = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch blog");
  return data.data;
};

// ─── Update ───────────────────────────────────────────────────────────────────

export const updateBlog = async (
  id: number,
  payload: Partial<TBlogPayload>,
): Promise<TBlog> => {
  const res = await serverFetch.patch(`/blogs/${id}`, {
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });

  const data: TApiResponse<TBlog> = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update blog");
  return data.data;
};

// ─── Update Status ────────────────────────────────────────────────────────────

export const updateBlogStatus = async (
  id: number,
  status: TBlogStatus,
): Promise<TBlog> => {
  const res = await serverFetch.patch(`/blogs/${id}/status`, {
    body: JSON.stringify({ status }),
    headers: { "Content-Type": "application/json" },
  });

  const data: TApiResponse<TBlog> = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update status");
  return data.data;
};

// ─── Delete ───────────────────────────────────────────────────────────────────

export const deleteBlog = async (id: number): Promise<void> => {
  const res = await serverFetch.delete(`/blogs/${id}`);
  const data: TApiResponse<null> = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete blog");
};
