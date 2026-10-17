"use server";
import { serverFetch } from "@/lib/server-fetch";
import {
  ICreateProductPayload,
  IProduct,
  IPublicProduct,
} from "@/types/AdminProducts/AdminProducts.interface";
import { revalidateTag } from "next/cache";
import { cache } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IGetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "ACTIVE" | "INACTIVE";
  sortBy?: string; // ← যোগ করো
  sortOrder?: "asc" | "desc"; // ← যোগ করো
}
// Public product — buyingPrice, sku বাদ (sensitive)

export interface IPublicProductsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface IPublicSearchResult {
  id: string;
  name: string;
  slug: string;
  sellingPrice: number;
  productMedia: { url: string }[];
}

interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
export type IProductMeta = NonNullable<IApiResponse<IProduct[]>["meta"]>;

export interface IGetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "ACTIVE" | "INACTIVE";
}

export const getServerNow = cache(() => Date.now());

// ─── Get All Public Products ───────────────────────────────────────────────────

export const getPublicProducts = async (
  params?: IPublicProductsParams,
): Promise<{
  data: IPublicProduct[];
  meta: IApiResponse<IPublicProduct[]>["meta"];
}> => {
  const query = new URLSearchParams();

  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.search) query.set("search", params.search);

  const res = await serverFetch.get(`/products/public?${query.toString()}`);

  const json: IApiResponse<IPublicProduct[]> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch products");
  }

  return { data: json.data, meta: json.meta };
};

// ─── Get Single Public Product by Slug ────────────────────────────────────────

export const getPublicProductBySlug = async (
  slug: string,
): Promise<IPublicProduct> => {
  const res = await serverFetch.get(`/products/public/${slug}`);

  const json: IApiResponse<IPublicProduct> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Product not found");
  }

  return json.data;
};

// ─── Search Public Products ────────────────────────────────────────────────────

export const searchPublicProducts = async (
  q: string,
  limit = 8,
): Promise<IPublicSearchResult[]> => {
  if (!q.trim()) return [];

  const query = new URLSearchParams();
  query.set("q", q);
  query.set("limit", String(limit));

  const res = await serverFetch.get(
    `/products/public/search?${query.toString()}`,
  );

  const json: IApiResponse<IPublicSearchResult[]> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Search failed");
  }

  return json.data;
};

// ─── Create ────────────────────────────────────────────────────────────────────
export const createProduct = async (
  payload: ICreateProductPayload,
): Promise<IProduct> => {
  const res = await serverFetch.post("/products", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json: IApiResponse<IProduct> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to create product");
  }
  revalidateTag("offer-products", "max");
  revalidateTag("flash-products", "max");
  revalidateTag("products", "max");

  return json.data;
};

// ─── Get All ───────────────────────────────────────────────────────────────────

export const getAllProducts = async (
  params?: IGetProductsParams,
): Promise<{ data: IProduct[]; meta: IApiResponse<IProduct[]>["meta"] }> => {
  const query = new URLSearchParams();

  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.search) query.set("search", params.search);
  if (params?.status) query.set("status", params.status);
  if (params?.sortBy) query.set("sortBy", params.sortBy);
  if (params?.sortOrder) query.set("sortOrder", params.sortOrder);

  const res = await serverFetch.get(`/products?${query.toString()}`);
  const json: IApiResponse<IProduct[]> = await res.json();

  if (!res.ok || !json.success)
    throw new Error(json.message || "Failed to fetch products");

  return { data: json.data, meta: json.meta };
};

// ─── Get Single ────────────────────────────────────────────────────────────────
export const getProductById = async (id: string): Promise<IProduct> => {
  const res = await serverFetch.get(`/products/${id}`);

  const json: IApiResponse<IProduct> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch product");
  }

  return json.data;
};

// ─── Update ────────────────────────────────────────────────────────────────────
export const updateProduct = async (
  id: string,
  payload: Partial<ICreateProductPayload>,
): Promise<IProduct> => {
  const res = await serverFetch.patch(`/products/${id}`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json: IApiResponse<IProduct> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to update product");
  }
  revalidateTag("offer-products", "max");
  revalidateTag("flash-products", "max");
  revalidateTag(`product-${id}`, "max");
  revalidateTag("products", "max");
  return json.data;
};

// ─── Delete ────────────────────────────────────────────────────────────────────
export const deleteProduct = async (id: string): Promise<void> => {
  const res = await serverFetch.delete(`/products/${id}`);

  const json: IApiResponse<null> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to delete product");
  }
  revalidateTag("offer-products", "max");
  revalidateTag("flash-products", "max");
  revalidateTag(`product-${id}`, "max");
  revalidateTag("products", "max");
};
// ─── Shop Filter Options (brand + color, category ছাড়া) ──────────────────────

// export interface IShopFilterOption {
//   value: string;
//   count: number;
// }

// export interface IShopFilterOptions {
//   brands: IShopFilterOption[];
//   colors: IShopFilterOption[];
// }

// export const getShopFilterOptions = async (
//   categorySlug?: string,
// ): Promise<IShopFilterOptions> => {
//   const query = new URLSearchParams();
//   if (categorySlug) query.set("category", categorySlug);

//   const res = await serverFetch.get(
//     `/products/public/shop/filters?${query.toString()}`,
//   );

//   const json: IApiResponse<IShopFilterOptions> = await res.json();

//   if (!res.ok || !json.success) {
//     throw new Error(json.message || "Failed to fetch shop filters");
//   }

//   return json.data;
// };

// // ─── Shop Products (brand + color multi-select filter) ────────────────────────

// export interface IGetShopProductsParams {
//   page?: number;
//   limit?: number;
//   search?: string;
//   brandIds?: string[];
//   colors?: string[];
//   category?: string; // ✅ নতুন
//   sortBy?: string;
//   sortOrder?: "asc" | "desc";
// }

// export const getShopProducts = async (
//   params?: IGetShopProductsParams,
// ): Promise<{
//   data: IPublicProduct[];
//   meta: IApiResponse<IPublicProduct[]>["meta"];
// }> => {
//   const query = new URLSearchParams();

//   if (params?.page) query.set("page", String(params.page));
//   if (params?.limit) query.set("limit", String(params.limit));
//   if (params?.search) query.set("search", params.search);
//   if (params?.brandIds?.length)
//     query.set("brandIds", params.brandIds.join(","));
//   if (params?.colors?.length) query.set("colors", params.colors.join(","));
//   if (params?.category) query.set("category", params.category); // ✅ নতুন
//   if (params?.sortBy) query.set("sortBy", params.sortBy);
//   if (params?.sortOrder) query.set("sortOrder", params.sortOrder);

//   const res = await serverFetch.get(
//     `/products/public/shop?${query.toString()}`,
//   );

//   const json: IApiResponse<IPublicProduct[]> = await res.json();

//   if (!res.ok || !json.success) {
//     throw new Error(json.message || "Failed to fetch shop products");
//   }

//   return { data: json.data, meta: json.meta };
// };
export interface IShopFilterOption {
  value: string;
  count: number;
}

export interface IShopFilterOptions {
  brands: IShopFilterOption[];
  colors: IShopFilterOption[];
}

export const getShopFilterOptions = async (
  categorySlug?: string,
): Promise<IShopFilterOptions> => {
  const query = new URLSearchParams();
  if (categorySlug) query.set("category", categorySlug);

  const res = await serverFetch.get(
    `/products/public/shop/filters?${query.toString()}`,
  );

  const json: IApiResponse<IShopFilterOptions> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch shop filters");
  }

  return json.data;
};

export interface IGetShopProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  brandIds?: string[];
  colors?: string[];
  category?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const getShopProducts = async (
  params?: IGetShopProductsParams,
): Promise<{
  data: IPublicProduct[];
  meta: IApiResponse<IPublicProduct[]>["meta"];
}> => {
  const query = new URLSearchParams();

  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.search) query.set("search", params.search);
  if (params?.brandIds?.length)
    query.set("brandIds", params.brandIds.join(","));
  if (params?.colors?.length) query.set("colors", params.colors.join(","));
  if (params?.category) query.set("category", params.category);
  if (params?.sortBy) query.set("sortBy", params.sortBy);
  if (params?.sortOrder) query.set("sortOrder", params.sortOrder);

  const res = await serverFetch.get(
    `/products/public/shop?${query.toString()}`,
  );

  const json: IApiResponse<IPublicProduct[]> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch shop products");
  }

  return { data: json.data, meta: json.meta };
};
