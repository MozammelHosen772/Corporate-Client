"use server";

export interface ISearchProduct {
  id: string;
  name: string;
  slug: string;
  sellingPrice: number;
  mrpPrice: number;
  productMedia: { url: string }[];
}

interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:5000/api/v1";

export const searchProducts = async (
  query: string,
  limit = 10,
): Promise<ISearchProduct[]> => {
  const res = await fetch(
    `${BACKEND_API_URL}/products/public/search?q=${encodeURIComponent(query)}&limit=${limit}`,
    {
      method: "GET",
      next: {
        revalidate: 3000, // ✅ 60 সেকেন্ড cache
        tags: [`search-${query}`],
      },
    },
  );

  const json: IApiResponse<ISearchProduct[]> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Search failed");
  }

  return json.data;
};
