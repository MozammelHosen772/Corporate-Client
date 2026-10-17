import { getCategories } from "@/services/products/category.service"; // ← পাথ চেক করুন
import {
  getShopFilterOptions,
  getShopProducts,
} from "@/services/products/products.service";

const LIMIT = 12;

export interface ShopSearchParams {
  page?: string;
  search?: string;
  brands?: string;
  colors?: string;
  sortBy?: string;
  sortOrder?: string;
}

export async function loadShopPageData(
  categorySlug: string | undefined,
  sp: ShopSearchParams,
) {
  const page = Number(sp.page) || 1;
  const brandIds = sp.brands ? sp.brands.split(",").filter(Boolean) : [];
  const selectedColors = sp.colors ? sp.colors.split(",").filter(Boolean) : [];

  const [filterOptions, result, categories] = await Promise.all([
    getShopFilterOptions(categorySlug),
    getShopProducts({
      page,
      limit: LIMIT,
      search: sp.search || undefined,
      brandIds: brandIds.length ? brandIds : undefined,
      colors: selectedColors.length ? selectedColors : undefined,
      category: categorySlug,
      sortBy: sp.sortBy || undefined,
      sortOrder: (sp.sortOrder as "asc" | "desc") || undefined,
    }),
    getCategories(),
  ]);

  return {
    filterOptions,
    result,
    categories,
    meta: result.meta ?? { total: 0, page: 1, limit: LIMIT, totalPages: 1 },
  };
}
