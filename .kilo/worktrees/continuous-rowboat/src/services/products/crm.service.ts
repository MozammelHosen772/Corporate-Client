"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface TCRMProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  stock: number;
  sellingPrice: number | null;
  mrpPrice: number;
  status: "ACTIVE" | "INACTIVE";
  image: string | null;
  totalSold: number;
  revenue: number;
}

export interface TCRMProductDetail extends Omit<TCRMProduct, "revenue"> {
  totalRevenue: number;
  salesTrend: { month: string; quantity: number }[];
}

export interface TCRMMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface TApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: TCRMMeta;
}

export const getCRMProductList = async (
  params: { page?: number; limit?: number; search?: string } = {},
): Promise<{ data: TCRMProduct[]; meta: TCRMMeta | null }> => {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);

  const res = await serverFetch.get(`/products/crm/list?${query.toString()}`, {
    cache: "no-store",
  });

  const json: TApiResponse<TCRMProduct[]> = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch CRM products");

  return { data: json.data ?? [], meta: json.meta ?? null };
};

export const getCRMProductDetail = async (
  id: string,
): Promise<TCRMProductDetail> => {
  const res = await serverFetch.get(`/products/crm/${id}`, {
    cache: "no-store",
  });

  const json: TApiResponse<TCRMProductDetail> = await res.json();
  if (!res.ok)
    throw new Error(json.message || "Failed to fetch product CRM detail");

  return json.data;
};
