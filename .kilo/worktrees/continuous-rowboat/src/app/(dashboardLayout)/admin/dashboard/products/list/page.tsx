import AdminProductsList, {
  IProductMeta,
} from "@/modules/AdminDashboard/AdminProducts/AdminProductsList";
import { ProductTableSkeleton } from "@/modules/AdminDashboard/AdminProducts/components/ProductTableSkeleton";
import { getAllProducts } from "@/services/products/products.service";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    sortOrder?: string;
  }>;
};

const PRODUCT_LIMIT = 10;

// আলাদা component — data fetch করবে
async function ProductsContent({
  page,
  search,
  status,
  sortOrder,
}: {
  page: number;
  search?: string;
  status?: "ACTIVE" | "INACTIVE";
  sortOrder?: string;
}) {
  const result = await getAllProducts({
    page,
    limit: PRODUCT_LIMIT,
    search: search || undefined,
    status,
    sortBy: sortOrder ? "sellingPrice" : undefined,
    sortOrder:
      sortOrder === "price_asc"
        ? "asc"
        : sortOrder === "price_desc"
          ? "desc"
          : undefined,
  });

  return (
    <AdminProductsList
      products={result.data ?? []}
      meta={result.meta as IProductMeta}
    />
  );
}

// Page component — শুধু searchParams parse করবে
export default async function AdminProductsPage({ searchParams }: Props) {
  const { page: pageStr, search, status, sortOrder } = await searchParams;
  const page = Number(pageStr) || 1;

  return (
    <main>
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-slate-800">
          Products
        </h1>
        <p className="mt-1 text-sm text-slate-500">Manage your products</p>
      </div>

      <section id="products-table" aria-label="Products List">
        <Suspense fallback={<ProductTableSkeleton />}>
          <ProductsContent
            page={page}
            search={search}
            status={status as "ACTIVE" | "INACTIVE" | undefined}
            sortOrder={sortOrder}
          />
        </Suspense>
      </section>
    </main>
  );
}
