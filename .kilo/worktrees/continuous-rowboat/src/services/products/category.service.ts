"use server";

import { publicFetch } from "@/lib/public-fetch";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface ICategoryChild {
  id: string;
  label: string;
  slug: string;
}

export interface ICategorySubGroup {
  id: string;
  label: string;
  slug: string;
  children: ICategoryChild[];
}

export interface ICategory {
  id: string;
  label: string;
  slug: string;
  children: ICategorySubGroup[];
}

export interface ICategoryProduct {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  brandId: string | null;
  sellingPrice: number | null;
  mrpPrice: number;
  stock: number;
  showStockOut: boolean;
  productMedia: { url: string; fileType: string; name: string }[];
  productOffer: {
    offerStartDate: string;
    offerEndDate: string;
    offerSale: boolean;
  } | null;
  productFlashSale: {
    flashSaleStartDate: string;
    flashSaleEndDate: string;
    flashSale: boolean;
  } | null;
  variations: { id: string; color: string; size: string; price: number }[];
}

export interface ICategoryProductMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IFilterOption {
  value: string;
  count: number;
}

export interface ICategoryFilterOptions {
  brands: IFilterOption[];
  colors: IFilterOption[];
  sizes: IFilterOption[];
}

export interface IGetProductsByCategoryParams {
  slug: string;
  page?: number;
  limit?: number;
  brandIds?: string[];
  colors?: string[];
  sizes?: string[];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: ICategoryProductMeta;
}

export interface ICategoryBreadcrumbItem {
  id: string;
  label: string;
  slug: string;
}

export interface ICategoryChildOption {
  id: string;
  label: string;
  slug: string;
  hasChildren: boolean;
}

export interface ICategoryNodeInfo {
  current: ICategoryBreadcrumbItem;
  breadcrumb: ICategoryBreadcrumbItem[];
  children: ICategoryChildOption[];
}

export const getCategoryNode = async (
  slug: string,
): Promise<ICategoryNodeInfo> => {
  const res = await publicFetch.get(`/products/category/${slug}/node`);
  const json: IApiResponse<ICategoryNodeInfo> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch category info");
  }

  return json.data;
};

// // ─── Get Category Tree ─────────────────────────────────────────────────────────

export const getCategories = async (): Promise<ICategory[]> => {
  const res = await publicFetch.get("/products/categories");
  const json: IApiResponse<ICategory[]> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch categories");
  }

  return json.data;
};

// ─── Get Category Filter Options (brand/color/size) ────────────────────────────

export const getCategoryFilters = async (
  slug: string,
): Promise<ICategoryFilterOptions> => {
  const res = await publicFetch.get(`/products/category/${slug}/filters`);
  const json: IApiResponse<ICategoryFilterOptions> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch filter options");
  }

  return json.data;
};

// ─── Get Products By Category Slug ────────────────────────────────────────────

export const getProductsByCategory = async (
  params: IGetProductsByCategoryParams,
): Promise<{ data: ICategoryProduct[]; meta: ICategoryProductMeta }> => {
  const { slug, page, limit, brandIds, colors, sizes, sortBy, sortOrder } =
    params;

  const query = new URLSearchParams();
  if (page) query.set("page", String(page));
  if (limit) query.set("limit", String(limit));
  if (brandIds?.length) query.set("brandId", brandIds.join(","));
  if (colors?.length) query.set("color", colors.join(","));
  if (sizes?.length) query.set("size", sizes.join(","));
  if (sortBy) query.set("sortBy", sortBy);
  if (sortOrder) query.set("sortOrder", sortOrder);

  const res = await publicFetch.get(
    `/products/category/${slug}?${query.toString()}`,
  );
  const json: IApiResponse<ICategoryProduct[]> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch products");
  }

  return {
    data: json.data,
    meta: json.meta ?? { total: 0, page: 1, limit: 12, totalPages: 0 },
  };
};
