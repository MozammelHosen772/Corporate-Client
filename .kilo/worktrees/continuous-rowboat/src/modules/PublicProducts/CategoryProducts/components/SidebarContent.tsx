// "use client";

// import { ICategoryFilterOptions } from "@/services/products/category.service";
// import { SortOption } from "../constants/categoryProducts.constants.ts";
// import FilterSection from "./Filtersection";

// interface SidebarContentProps {
//   currentSort: SortOption;
//   limit: number;
//   onSortChange: (sortBy: string, sortOrder: string) => void;
//   onLimitChange: (limit: number) => void;

//   filterOptions: ICategoryFilterOptions;
//   selectedBrands: string[];
//   selectedColors: string[];
//   selectedSizes: string[];
//   onToggleFilter: (type: "brandId" | "color" | "size", value: string) => void;
// }

// export function SidebarContent({
//   currentSort,
//   limit,
//   onSortChange,
//   onLimitChange,
//   filterOptions,
//   selectedBrands,
//   selectedColors,
//   selectedSizes,
//   onToggleFilter,
// }: SidebarContentProps) {
//   return (
//     <div className="w-full">
//       {/* ✅ Brand Filter */}
//       {filterOptions.brands.length > 0 && (
//         <FilterSection title="Brand">
//           <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
//             {filterOptions.brands.map((b) => (
//               <label
//                 key={b.value}
//                 className="flex items-center justify-between gap-2 cursor-pointer group"
//               >
//                 <span className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     checked={selectedBrands.includes(b.value)}
//                     onChange={() => onToggleFilter("brandId", b.value)}
//                     className="accent-blue-600 rounded"
//                   />
//                   <span className="text-sm text-gray-600 group-hover:text-gray-900">
//                     {b.value}
//                   </span>
//                 </span>
//                 <span className="text-xs text-gray-400">{b.count}</span>
//               </label>
//             ))}
//           </div>
//         </FilterSection>
//       )}

//       {/* ✅ Color Filter */}
//       {filterOptions.colors.length > 0 && (
//         <FilterSection title="Color">
//           <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
//             {filterOptions.colors.map((c) => (
//               <label
//                 key={c.value}
//                 className="flex items-center justify-between gap-2 cursor-pointer group"
//               >
//                 <span className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     checked={selectedColors.includes(c.value)}
//                     onChange={() => onToggleFilter("color", c.value)}
//                     className="accent-blue-600 rounded"
//                   />
//                   <span
//                     className="w-3.5 h-3.5 rounded-full border border-gray-300 shrink-0"
//                     style={{ backgroundColor: c.value.toLowerCase() }}
//                   />
//                   <span className="text-sm text-gray-600 group-hover:text-gray-900 capitalize">
//                     {c.value}
//                   </span>
//                 </span>
//                 <span className="text-xs text-gray-400">{c.count}</span>
//               </label>
//             ))}
//           </div>
//         </FilterSection>
//       )}

//       {/* ✅ Size Filter */}
//       {filterOptions.sizes.length > 0 && (
//         <FilterSection title="Size">
//           <div className="flex flex-wrap gap-2">
//             {filterOptions.sizes.map((s) => {
//               const active = selectedSizes.includes(s.value);
//               return (
//                 <button
//                   key={s.value}
//                   onClick={() => onToggleFilter("size", s.value)}
//                   className={`px-3 h-8 rounded text-sm font-medium border transition-colors ${
//                     active
//                       ? "bg-blue-700 text-white border-blue-700"
//                       : "bg-white text-gray-600 border-gray-200 hover:border-blue-400"
//                   }`}
//                 >
//                   {s.value}
//                 </button>
//               );
//             })}
//           </div>
//         </FilterSection>
//       )}
//     </div>
//   );
// }
"use client";

import { ICategoryFilterOptions } from "@/services/products/category.service";
import { Loader2, X } from "lucide-react";
import { SortOption } from "../constants/categoryProducts.constants.ts";
import FilterSection from "./Filtersection";

interface SidebarContentProps {
  currentSort: SortOption;
  limit: number;
  onSortChange: (sortBy: string, sortOrder: string) => void;
  onLimitChange: (limit: number) => void;

  filterOptions: ICategoryFilterOptions;
  selectedBrands: string[];
  selectedColors: string[];
  selectedSizes: string[];
  onToggleFilter: (type: "brandId" | "color" | "size", value: string) => void;

  // ✅ নতুন props — reset + loading
  onResetFilters?: () => void;
  isLoading?: boolean;
}

export function SidebarContent({
  currentSort,
  limit,
  onSortChange,
  onLimitChange,
  filterOptions,
  selectedBrands,
  selectedColors,
  selectedSizes,
  onToggleFilter,
  onResetFilters,
  isLoading = false,
}: SidebarContentProps) {
  const hasActiveFilters =
    selectedBrands.length > 0 ||
    selectedColors.length > 0 ||
    selectedSizes.length > 0;

  return (
    <div className="w-full relative">
      {/* ✅ Filter apply হওয়ার সময় sidebar-এ হালকা loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[1px] rounded-lg">
          <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
        </div>
      )}

      {/* ✅ Reset All — কোনো filter সিলেক্ট করা থাকলেই দেখাবে */}
      {hasActiveFilters && onResetFilters && (
        <button
          onClick={onResetFilters}
          disabled={isLoading}
          className="flex items-center gap-1 mb-3 text-xs font-semibold text-orange-600 hover:text-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Clear all filters
        </button>
      )}

      {/* ✅ Brand Filter */}
      {filterOptions.brands.length > 0 && (
        <FilterSection title="Brand">
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {filterOptions.brands.map((b) => (
              <label
                key={b.value}
                className="flex items-center justify-between gap-2 cursor-pointer group"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(b.value)}
                    onChange={() => onToggleFilter("brandId", b.value)}
                    disabled={isLoading}
                    className="accent-orange-500 rounded disabled:opacity-50"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900">
                    {b.value}
                  </span>
                </span>
                <span className="text-xs text-gray-400">{b.count}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* ✅ Color Filter */}
      {filterOptions.colors.length > 0 && (
        <FilterSection title="Color">
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {filterOptions.colors.map((c) => (
              <label
                key={c.value}
                className="flex items-center justify-between gap-2 cursor-pointer group"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedColors.includes(c.value)}
                    onChange={() => onToggleFilter("color", c.value)}
                    disabled={isLoading}
                    className="accent-orange-500 rounded disabled:opacity-50"
                  />
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-gray-300 shrink-0"
                    style={{ backgroundColor: c.value.toLowerCase() }}
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 capitalize">
                    {c.value}
                  </span>
                </span>
                <span className="text-xs text-gray-400">{c.count}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* ✅ Size Filter */}
      {filterOptions.sizes.length > 0 && (
        <FilterSection title="Size">
          <div className="flex flex-wrap gap-2">
            {filterOptions.sizes.map((s) => {
              const active = selectedSizes.includes(s.value);
              return (
                <button
                  key={s.value}
                  onClick={() => onToggleFilter("size", s.value)}
                  disabled={isLoading}
                  className={`px-3 h-8 rounded text-sm font-medium border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    active
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-gray-600 border-gray-200 hover:border-orange-400"
                  }`}
                >
                  {s.value}
                </button>
              );
            })}
          </div>
        </FilterSection>
      )}
    </div>
  );
}
