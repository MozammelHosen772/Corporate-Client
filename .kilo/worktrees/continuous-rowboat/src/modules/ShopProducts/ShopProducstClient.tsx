// // "use client";

// // import { IShopFilterOptions } from "@/services/products/products.service";
// // import { IPublicProduct } from "@/types/AdminProducts/AdminProducts.interface";
// // import { SlidersHorizontal, X } from "lucide-react";
// // import { useSearchParams } from "next/navigation";
// // import { useState } from "react";

// // import ProductFilterPanel from "./components/Productfilterpanel";
// // import ShopProductGrid from "./components/ShopProductGrid";
// // import ShopToolbar, { TGridMode } from "./components/ShopToolbar";

// // interface Props {
// //   initialProducts: IPublicProduct[];
// //   meta: { total: number; page: number; limit: number; totalPages: number };
// //   filterOptions: IShopFilterOptions;
// // }

// // export default function ShopProducstClient({
// //   initialProducts,
// //   meta,
// //   filterOptions,
// // }: Props) {
// //   const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
// //   const [gridMode, setGridMode] = useState<TGridMode>("cols-4");
// //   const searchParams = useSearchParams();

// //   const filterKey = (() => {
// //     const p = new URLSearchParams(searchParams.toString());
// //     p.delete("page");
// //     return p.toString();
// //   })();

// //   // Shop page-এ query param নাম "brands"/"colors" (plural) — এটাই আগে থেকে ব্যবহার হচ্ছিল
// //   // (ShopProductGrid ইতিমধ্যে এই নামেই searchParams পড়ে), তাই এখানে সেটাই রাখা হলো
// //   const filterGroups = [
// //     { key: "brands", label: "Brand", options: filterOptions.brands },
// //     { key: "colors", label: "Color", options: filterOptions.colors },
// //   ];

// //   return (
// //     <div>
// //       {/* ── Mobile filter trigger — শুধু ছোট স্ক্রিনে ─────────────────── */}
// //       <div className="mb-3 flex items-center justify-end lg:hidden">
// //         <button
// //           onClick={() => setMobileFiltersOpen(true)}
// //           className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600"
// //         >
// //           <SlidersHorizontal className="h-3.5 w-3.5" />
// //           Filters
// //         </button>
// //       </div>

// //       <div className="flex items-start gap-6">
// //         {/* ── Sidebar (desktop) ─────────────────────────────────────────── */}
// //         <aside className="hidden w-64 shrink-0 lg:block">
// //           <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-transparent">
// //             <ProductFilterPanel groups={filterGroups} showHeader={true} />
// //           </div>
// //         </aside>

// //         {/* ── Sidebar (mobile drawer) ───────────────────────────────────── */}
// //         {mobileFiltersOpen && (
// //           <div className="fixed inset-0 z-50 flex lg:hidden">
// //             <div
// //               className="absolute inset-0 bg-black/40"
// //               onClick={() => setMobileFiltersOpen(false)}
// //             />
// //             <div className="relative ml-auto flex h-full w-80 max-w-[85vw] flex-col overflow-y-auto bg-white p-5 shadow-xl">
// //               <div className="mb-4 flex items-center justify-between">
// //                 <h2 className="text-sm font-semibold text-gray-800">Filters</h2>
// //                 <button
// //                   onClick={() => setMobileFiltersOpen(false)}
// //                   className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100"
// //                 >
// //                   <X className="h-4 w-4" />
// //                 </button>
// //               </div>
// //               <ProductFilterPanel groups={filterGroups} showHeader={true} />
// //             </div>
// //           </div>
// //         )}

// //         {/* ── Product area ─────────────────────────────────────────────── */}
// //         <div className="min-w-0 flex-1">
// //           <ShopToolbar
// //             totalProducts={meta.total}
// //             showingCount={initialProducts.length}
// //             gridMode={gridMode}
// //             onGridModeChange={setGridMode}
// //           />
// //           <ShopProductGrid
// //             key={filterKey}
// //             products={initialProducts}
// //             meta={meta}
// //             gridMode={gridMode}
// //           />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// "use client";

// import { ICategory } from "@/services/products/category.service"; // ← পাথ চেক করুন
// import { IShopFilterOptions } from "@/services/products/products.service";
// import { IPublicProduct } from "@/types/AdminProducts/AdminProducts.interface";
// import { SlidersHorizontal, X } from "lucide-react";
// import { useSearchParams } from "next/navigation";
// import { useState } from "react";

// import CategorySidebarTree from "@/modules/PublicCategoryproducts/components/Categorysidebartree"; // ← পাথ চেক করুন
// import ProductFilterPanel from "./components/Productfilterpanel";
// import ShopProductGrid from "./components/ShopProductGrid";
// import ShopToolbar, { TGridMode } from "./components/ShopToolbar";

// interface Props {
//   initialProducts: IPublicProduct[];
//   meta: { total: number; page: number; limit: number; totalPages: number };
//   filterOptions: IShopFilterOptions;
//   categories: ICategory[]; // ✅ নতুন
//   currentCategorySlug?: string; // ✅ নতুন
// }

// export default function ShopProducstClient({
//   initialProducts,
//   meta,
//   filterOptions,
//   categories,
//   currentCategorySlug,
// }: Props) {
//   const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
//   const [gridMode, setGridMode] = useState<TGridMode>("cols-4");
//   const searchParams = useSearchParams();

//   const filterKey = (() => {
//     const p = new URLSearchParams(searchParams.toString());
//     p.delete("page");
//     return p.toString();
//   })();

//   const filterGroups = [
//     { key: "brands", label: "Brand", options: filterOptions.brands },
//     { key: "colors", label: "Color", options: filterOptions.colors },
//   ];

//   return (
//     <div>
//       <div className="mb-3 flex items-center justify-end lg:hidden">
//         <button
//           onClick={() => setMobileFiltersOpen(true)}
//           className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600"
//         >
//           <SlidersHorizontal className="h-3.5 w-3.5" />
//           Filters
//         </button>
//       </div>

//       <div className="flex items-start gap-6">
//         <aside className="hidden w-64 shrink-0 lg:block">
//           <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-transparent">
//             <CategorySidebarTree
//               categories={categories}
//               currentSlug={currentCategorySlug ?? ""}
//               basePath="/shop"
//               categoryParam="category"
//             />
//             <div className="mt-4">
//               <ProductFilterPanel groups={filterGroups} showHeader={true} />
//             </div>
//           </div>
//         </aside>

//         {mobileFiltersOpen && (
//           <div className="fixed inset-0 z-50 flex lg:hidden">
//             <div
//               className="absolute inset-0 bg-black/40"
//               onClick={() => setMobileFiltersOpen(false)}
//             />
//             <div className="relative ml-auto flex h-full w-80 max-w-[85vw] flex-col overflow-y-auto bg-white p-5 shadow-xl">
//               <div className="mb-4 flex items-center justify-between">
//                 <h2 className="text-sm font-semibold text-gray-800">Filters</h2>
//                 <button
//                   onClick={() => setMobileFiltersOpen(false)}
//                   className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100"
//                 >
//                   <X className="h-4 w-4" />
//                 </button>
//               </div>
//               <CategorySidebarTree
//                 categories={categories}
//                 currentSlug={currentCategorySlug ?? ""}
//                 basePath="/shop"
//                 categoryParam="category"
//               />
//               <div className="mt-4">
//                 <ProductFilterPanel groups={filterGroups} showHeader={true} />
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="min-w-0 flex-1">
//           <ShopToolbar
//             totalProducts={meta.total}
//             showingCount={initialProducts.length}
//             gridMode={gridMode}
//             onGridModeChange={setGridMode}
//           />
//           <ShopProductGrid
//             key={filterKey}
//             products={initialProducts}
//             meta={meta}
//             gridMode={gridMode}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import {
  ICategory,
  ICategoryNodeInfo,
} from "@/services/products/category.service"; // ← পাথ চেক করুন
import { IShopFilterOptions } from "@/services/products/products.service";
import { IPublicProduct } from "@/types/AdminProducts/AdminProducts.interface";
import { SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import CategorySidebarTree from "./components/CategorySidebarTree";
import ProductFilterPanel from "./components/Productfilterpanel";
import ShopProductGrid from "./components/ShopProductGrid";
import ShopToolbar, { TGridMode } from "./components/ShopToolbar";

interface Props {
  initialProducts: IPublicProduct[];
  meta: { total: number; page: number; limit: number; totalPages: number };
  filterOptions: IShopFilterOptions;
  categories: ICategory[];
  currentCategorySlug?: string;
  categoryNode?: ICategoryNodeInfo; // ✅ নতুন — শুধু /shop/[category] এ থাকবে, /shop এ undefined
}

export default function ShopProducstClient({
  initialProducts,
  meta,
  filterOptions,
  categories,
  currentCategorySlug,
  categoryNode,
}: Props) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [gridMode, setGridMode] = useState<TGridMode>("cols-4");
  const searchParams = useSearchParams();

  const filterKey = (() => {
    const p = new URLSearchParams(searchParams.toString());
    p.delete("page");
    return `${currentCategorySlug ?? ""}::${p.toString()}`;
  })();

  const filterGroups = [
    { key: "brands", label: "Brand", options: filterOptions.brands },
    { key: "colors", label: "Color", options: filterOptions.colors },
  ];

  return (
    <div>
      {/* ── Breadcrumb + Title (শুধু category page-এ) ──────────────────── */}
      {categoryNode && (
        <>
          <nav className="mb-3 text-sm text-gray-500">
            <Link href="/shop">Home</Link>
            {categoryNode.breadcrumb.map((b) => (
              <span key={b.id}>
                {" / "}
                {b.slug === currentCategorySlug ? (
                  <span className="font-semibold text-gray-800">{b.label}</span>
                ) : (
                  <Link
                    href={`/shop/${b.slug}`}
                    className="hover:text-orange-600"
                  >
                    {b.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>

          <h1 className="mb-5 flex items-center gap-2 text-2xl font-bold text-gray-800">
            <span className="text-orange-500">»</span>{" "}
            {categoryNode.current.label}
          </h1>
        </>
      )}

      {/* ── Mobile filter trigger ─────────────────────────────────────── */}
      <div className="mb-3 flex items-center justify-end lg:hidden">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
        </button>
      </div>

      <div className="flex items-start gap-6">
        {/* ── Sidebar (desktop) ─────────────────────────────────────────── */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-transparent">
            <CategorySidebarTree
              categories={categories}
              currentSlug={currentCategorySlug ?? ""}
            />
            <div className="mt-4">
              <ProductFilterPanel groups={filterGroups} showHeader={true} />
            </div>
          </div>
        </aside>

        {/* ── Sidebar (mobile drawer) ───────────────────────────────────── */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <div className="relative ml-auto flex h-full w-80 max-w-[85vw] flex-col overflow-y-auto bg-white p-5 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-800">Filters</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <CategorySidebarTree
                categories={categories}
                currentSlug={currentCategorySlug ?? ""}
              />
              <div className="mt-4">
                <ProductFilterPanel
                  groups={filterGroups}
                  showHeader={true}
                  onApply={() => setMobileFiltersOpen(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Product area ─────────────────────────────────────────────── */}
        <div className="min-w-0 flex-1">
          <ShopToolbar
            totalProducts={meta.total}
            showingCount={initialProducts.length}
            gridMode={gridMode}
            onGridModeChange={setGridMode}
          />
          <ShopProductGrid
            key={filterKey}
            products={initialProducts}
            meta={meta}
            gridMode={gridMode}
          />
        </div>
      </div>
    </div>
  );
}
