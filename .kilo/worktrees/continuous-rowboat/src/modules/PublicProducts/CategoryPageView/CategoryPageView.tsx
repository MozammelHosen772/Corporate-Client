import {
  ICategoryFilterOptions,
  ICategoryNodeInfo,
  ICategoryProduct,
  ICategoryProductMeta,
} from "@/services/products/category.service";
import Link from "next/link";

interface Props {
  category: ICategoryNodeInfo;
  products: ICategoryProduct[];
  meta: ICategoryProductMeta;
  filterOptions: ICategoryFilterOptions;
  currentSlug: string;
  fullSlugPath: string[];
}

export default function CategoryPageView({
  category,
  products,
  meta,
  filterOptions,
  currentSlug,
  fullSlugPath,
}: Props) {
  return (
    <main className="max-w-[1400px] mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4 flex flex-wrap items-center gap-1">
        <Link href="/" className="hover:text-orange-500">
          Home
        </Link>
        {category.breadcrumb.map((b, i) => (
          <span key={b.slug} className="flex items-center gap-1">
            <span>/</span>
            {i === category.breadcrumb.length - 1 ? (
              <span className="text-gray-900 font-medium">{b.label}</span>
            ) : (
              <Link
                href={`/products/${category.breadcrumb
                  .slice(0, i + 1)
                  .map((c) => c.slug)
                  .join("/")}`}
                className="hover:text-orange-500"
              >
                {b.label}
              </Link>
            )}
          </span>
        ))}
      </nav>

      <h1 className="text-2xl font-bold mb-6">{category.current.label}</h1>

      {/* Sub-category chips */}
      {category.children.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {category.children.map((child) => (
            <Link
              key={child.slug}
              href={`/products/${currentSlug}/${child.slug}`}
              className="px-3 py-1.5 rounded-full border border-gray-300 text-sm hover:border-orange-500 hover:text-orange-500 transition-colors"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          {filterOptions.brands.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Brand</h3>
              {filterOptions.brands.map((b) => (
                <label
                  key={b.value}
                  className="flex items-center gap-2 text-sm mb-1"
                >
                  <input type="checkbox" />
                  {b.value} ({b.count})
                </label>
              ))}
            </div>
          )}

          {filterOptions.colors.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Color</h3>
              {filterOptions.colors.map((c) => (
                <label
                  key={c.value}
                  className="flex items-center gap-2 text-sm mb-1"
                >
                  <input type="checkbox" />
                  {c.value} ({c.count})
                </label>
              ))}
            </div>
          )}

          {filterOptions.sizes.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Size</h3>
              {filterOptions.sizes.map((s) => (
                <label
                  key={s.value}
                  className="flex items-center gap-2 text-sm mb-1"
                >
                  <input type="checkbox" />
                  {s.value} ({s.count})
                </label>
              ))}
            </div>
          )}
        </aside>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {products.length === 0 ? (
            <p className="text-gray-500 py-10 text-center">
              এই ক্যাটাগরিতে কোনো প্রোডাক্ট পাওয়া যায়নি।
            </p>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.slug}`}
                    className="border rounded-lg p-3 hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-square bg-gray-100 rounded mb-2 overflow-hidden">
                      {p.productMedia?.[0]?.url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.productMedia[0].url}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <p className="text-sm font-medium line-clamp-2">{p.name}</p>
                    <p className="text-orange-600 font-bold mt-1">
                      ৳{(p.sellingPrice ?? p.mrpPrice).toLocaleString()}
                    </p>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {meta.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <Link
                        key={pageNum}
                        href={`/products/${fullSlugPath.join("/")}?page=${pageNum}`}
                        className={`w-8 h-8 flex items-center justify-center rounded ${
                          pageNum === meta.page
                            ? "bg-orange-500 text-white"
                            : "border border-gray-300"
                        }`}
                      >
                        {pageNum}
                      </Link>
                    ),
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
