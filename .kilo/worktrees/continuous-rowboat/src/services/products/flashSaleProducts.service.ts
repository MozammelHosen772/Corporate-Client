"use server";
import { publicFetch } from "@/lib/public-fetch";
import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";

interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface IFlashSale {
  id: string;
  productId: string;
  flashSaleStartDate: string;
  flashSaleEndDate: string;
  flashSale: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IUpsertFlashSalePayload {
  flashSaleStartDate: string;
  flashSaleEndDate: string;
  flashSale: boolean;
}

export interface IPublicFlashSaleProduct {
  id: string;
  productId: string;
  flashSaleStartDate: string;
  flashSaleEndDate: string;
  flashSale: boolean;
  createdAt: string;
  updatedAt: string;
  displayPrice: number;
  product: {
    id: string;
    name: string;
    mrpPrice: number;
    sellingPrice?: number | null;
    slug: string;
    stock?: number;
    showStockOut: boolean;
    // ✅ FIX: fileType o isMain add kora holo — eigulo chara
    // resolveCardImage() e PDF/VIDEO filter kora jay na, ar
    // "main" image thik moto select kora jay na
    productMedia: {
      url: string;
      fileType?: string;
      isMain?: boolean;
    }[];
    // ✅ NEW: variation thakle color/size — na thakle ei array
    // empty ba undefined thakbe, FlashSaleCard er hasVariations
    // check eita diyei kaj korbe
    variations?: {
      id: string;
      color?: string | null;
      size?: string | null;
      price?: number | null;
      sku?: string | null;
    }[];
  };
}
export interface IPublicFlashSaleResponse {
  products: IPublicFlashSaleProduct[];
  nextChangeAt: string | null;
}

export const getPublicFlashSaleProducts =
  async (): Promise<IPublicFlashSaleResponse | null> => {
    try {
      const res = await publicFetch.get("/products/public/flash-sales", {
        next: {
          tags: ["flash-products"],
          revalidate: 60,
        },
      });
      const result: IApiResponse<IPublicFlashSaleResponse> = await res.json();

      if (!res.ok || !result.success) {
        return null;
      }
      return result.data;
    } catch (error) {
      return null;
    }
  };

export const getProductFlashSale = async (
  productId: string,
): Promise<IFlashSale | null> => {
  const res = await serverFetch.get(`/products/${productId}/flashSale`);
  const result: IApiResponse<IFlashSale | null> = await res.json();
  if (!res.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch Flash Sale");
  }
  return result.data;
};

export const upsertProductFlashSale = async (
  productId: string,
  payload: IUpsertFlashSalePayload,
): Promise<IFlashSale> => {
  const res = await serverFetch.put(`/products/${productId}/flashSale`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result: IApiResponse<IFlashSale> = await res.json();
  if (!res.ok || !result.success) {
    throw new Error(result.message || "Failed to save Flash Sale");
  }
  revalidateTag("flash-products", "max");
  return result.data;
};

export const removeProductFlashSale = async (
  productId: string,
): Promise<void> => {
  const res = await serverFetch.delete(`/products/${productId}/flashSale`);
  const result: IApiResponse<null> = await res.json();
  if (!res.ok || !result.success) {
    throw new Error(result.message || "Failed to remove Flash Sale");
  }
  revalidateTag("flash-products", "max");
};
