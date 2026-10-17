"use server";
import { publicFetch } from "@/lib/public-fetch";
import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";

interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface IOffer {
  id: string;
  productId: string;
  offerStartDate: string;
  offerEndDate: string;
  offerSale: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IUpsertOfferPayload {
  offerStartDate: string;
  offerEndDate: string;
  offerSale: boolean;
}

export interface IPublicOfferProduct {
  id: string;
  productId: string;
  offerStartDate: string;
  offerEndDate: string;
  offerSale: boolean;
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

    productMedia: {
      url: string;
      fileType?: string;
      isMain?: boolean;
    }[];

    variations?: {
      id: string;
      color?: string | null;
      size?: string | null;
      price?: number | null;
      sku?: string | null;
    }[];
  };
}
export interface IPublicOfferResponse {
  products: IPublicOfferProduct[];
  nextChangeAt: string | null;
}

export const getPublicOfferProducts =
  async (): Promise<IPublicOfferResponse | null> => {
    try {
      const res = await publicFetch.get("/products/public/offer", {
        next: {
          tags: ["offer-products"],
          revalidate: 3600,
        },
      });

      const result: IApiResponse<IPublicOfferResponse> = await res.json();

      if (!res.ok || !result.success) {
        return null;
      }
      return result.data;
    } catch (error) {
      return null;
    }
  };

export const getProductOffer = async (
  productId: string,
): Promise<IOffer | null> => {
  const res = await serverFetch.get(`/products/${productId}/offer`);
  const json: IApiResponse<IOffer | null> = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch offer");
  }
  return json.data;
};

export const upsertProductOffer = async (
  productId: string,
  payload: IUpsertOfferPayload,
): Promise<IOffer> => {
  const res = await serverFetch.put(`/products/${productId}/offer`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json: IApiResponse<IOffer> = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to save offer");
  }
  revalidateTag("offer-products", "max");
  return json.data;
};

export const removeProductOffer = async (productId: string): Promise<void> => {
  const res = await serverFetch.delete(`/products/${productId}/offer`);
  const json: IApiResponse<null> = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to remove offer");
  }
  revalidateTag("offer-products", "max");
};
