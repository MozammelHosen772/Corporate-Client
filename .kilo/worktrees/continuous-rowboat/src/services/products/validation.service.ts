"use server";

export interface ICartValidationVariation {
  sku: string;
  price: number | null;
}

export interface ICartValidationProduct {
  id: string;
  stock: number;
  maximumPurchaseQuantity: number | null;
  canPurchasable: boolean;
  showStockOut: boolean;
  mrpPrice: number;
  sellingPrice: number | null;
  variations: ICartValidationVariation[];
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

// ✅ "use server" file — server-side e run hocche, tai NEXT_PUBLIC_ prefix lagbe na.
// Tomar serverFetch/publicFetch wrapper jei base URL env var use kore, exact
// shei nam ta boshao (e.g. API_BASE_URL, BACKEND_URL, ba jeta tomar .env e ache)

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
export const validateCartProducts = async (
  ids: string[],
): Promise<ICartValidationProduct[]> => {
  if (!ids.length) return [];

  if (!BACKEND_API_URL) {
    // ✅ env var missing hole clearly bole dibe, silent "network failed" na diye
    throw new Error(
      "BACKEND_API_URL is not configured in environment variables",
    );
  }

  let res: Response;
  try {
    res = await fetch(`${BACKEND_API_URL}/products/public/validate-cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
      cache: "no-store",
    });
  } catch (err) {
    console.error("Cart validation network error:", err);
    throw new Error(
      `Cart validation network request failed: ${
        err instanceof Error ? err.message : String(err)
      }`,
    );
  }

  let json: IApiResponse<{ products: ICartValidationProduct[] }>;
  try {
    json = await res.json();
  } catch {
    throw new Error(
      `Cart validation failed — invalid response (status ${res.status})`,
    );
  }

  if (!res.ok || !json.success) {
    throw new Error(
      json.message || `Cart validation failed (status ${res.status})`,
    );
  }

  return json.data.products;
};
