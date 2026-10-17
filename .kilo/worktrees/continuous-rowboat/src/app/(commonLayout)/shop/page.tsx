// // import ShopProducstClient from "@/modules/ShopProducts/ShopProducstClient";
// // import {
// //   getShopFilterOptions,
// //   getShopProducts,
// // } from "@/services/products/products.service";
// // import FetchErrorState from "@/shared/FetchErrorState";

// // type Props = {
// //   searchParams: Promise<{
// //     page?: string;
// //     search?: string;
// //     brands?: string;
// //     colors?: string;
// //     sortBy?: string;
// //     sortOrder?: string;
// //   }>;
// // };

// // const LIMIT = 12;

// // export default async function ShopPage({ searchParams }: Props) {
// //   const {
// //     page: pageStr,
// //     search,
// //     brands,
// //     colors,
// //     sortBy,
// //     sortOrder,
// //   } = await searchParams;

// //   const page = Number(pageStr) || 1;
// //   const brandIds = brands ? brands.split(",").filter(Boolean) : [];
// //   const selectedColors = colors ? colors.split(",").filter(Boolean) : [];

// //   let filterOptions;
// //   let result;

// //   try {
// //     [filterOptions, result] = await Promise.all([
// //       getShopFilterOptions(),
// //       getShopProducts({
// //         page,
// //         limit: LIMIT,
// //         search: search || undefined,
// //         brandIds: brandIds.length ? brandIds : undefined,
// //         colors: selectedColors.length ? selectedColors : undefined,
// //         sortBy: sortBy || undefined,
// //         sortOrder: (sortOrder as "asc" | "desc") || undefined,
// //       }),
// //     ]);
// //   } catch (error) {
// //     return (
// //       <section className="w-full py-10 px-2 md:px-4 ">
// //         <div className="max-w-[1400px] mx-auto">
// //           <FetchErrorState
// //             title="প্রোডাক্ট লোড করা যায়নি"
// //             message="সার্ভারের সাথে সংযোগ করা যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।"
// //           />
// //         </div>
// //       </section>
// //     );
// //   }

// //   return (
// //     <section className="w-full py-6 px-2 md:px-4 ">
// //       <div className="max-w-[1400px] mx-auto">
// //         <ShopProducstClient
// //           initialProducts={result.data}
// //           meta={
// //             result.meta ?? { total: 0, page: 1, limit: LIMIT, totalPages: 1 }
// //           }
// //           filterOptions={filterOptions}
// //         />
// //       </div>
// //     </section>
// //   );
// // }
// import ShopProducstClient from "@/modules/ShopProducts/ShopProducstClient";
// import { getCategories } from "@/services/products/category.service";
// import {
//   getShopFilterOptions,
//   getShopProducts,
// } from "@/services/products/products.service";
// import FetchErrorState from "@/shared/FetchErrorState";

// type Props = {
//   searchParams: Promise<{
//     page?: string;
//     search?: string;
//     brands?: string;
//     colors?: string;
//     category?: string; // ✅ নতুন
//     sortBy?: string;
//     sortOrder?: string;
//   }>;
// };

// const LIMIT = 12;

// export default async function ShopPage({ searchParams }: Props) {
//   const {
//     page: pageStr,
//     search,
//     brands,
//     colors,
//     category,
//     sortBy,
//     sortOrder,
//   } = await searchParams;

//   const page = Number(pageStr) || 1;
//   const brandIds = brands ? brands.split(",").filter(Boolean) : [];
//   const selectedColors = colors ? colors.split(",").filter(Boolean) : [];

//   let filterOptions, result, categories;

//   try {
//     [filterOptions, result, categories] = await Promise.all([
//       getShopFilterOptions(category),
//       getShopProducts({
//         page,
//         limit: LIMIT,
//         search: search || undefined,
//         brandIds: brandIds.length ? brandIds : undefined,
//         colors: selectedColors.length ? selectedColors : undefined,
//         category: category || undefined,
//         sortBy: sortBy || undefined,
//         sortOrder: (sortOrder as "asc" | "desc") || undefined,
//       }),
//       getCategories(),
//     ]);
//   } catch (error) {
//     return (
//       <section className="w-full py-10 px-2 md:px-4 ">
//         <div className="max-w-[1400px] mx-auto">
//           <FetchErrorState
//             title="প্রোডাক্ট লোড করা যায়নি"
//             message="সার্ভারের সাথে সংযোগ করা যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।"
//           />
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="w-full py-6 px-2 md:px-4 ">
//       <div className="max-w-[1400px] mx-auto">
//         <ShopProducstClient
//           initialProducts={result.data}
//           meta={
//             result.meta ?? { total: 0, page: 1, limit: LIMIT, totalPages: 1 }
//           }
//           filterOptions={filterOptions}
//           categories={categories}
//           currentCategorySlug={category}
//         />
//       </div>
//     </section>
//   );
// }
import {
  loadShopPageData,
  ShopSearchParams,
} from "@/modules/ShopProducts/constants/loadShopPageData";
import ShopProducstClient from "@/modules/ShopProducts/ShopProducstClient";

import FetchErrorState from "@/shared/FetchErrorState";

type Props = { searchParams: Promise<ShopSearchParams> };

export default async function ShopPage({ searchParams }: Props) {
  const sp = await searchParams;

  let data;
  try {
    data = await loadShopPageData(undefined, sp);
  } catch {
    return (
      <section className="w-full py-10 px-2 md:px-4">
        <div className="max-w-[1400px] mx-auto">
          <FetchErrorState
            title="প্রোডাক্ট লোড করা যায়নি"
            message="সার্ভারের সাথে সংযোগ করা যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-6 px-2 md:px-4">
      <div className="max-w-[1400px] mx-auto">
        <ShopProducstClient
          initialProducts={data.result.data}
          meta={data.meta}
          filterOptions={data.filterOptions}
          categories={data.categories}
          currentCategorySlug={undefined}
        />
      </div>
    </section>
  );
}
