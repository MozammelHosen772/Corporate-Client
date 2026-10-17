export type SortOption = {
  label: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
};

export const SORT_OPTIONS: SortOption[] = [
  { label: "Default", sortBy: "default", sortOrder: "desc" },
  { label: "Newest First", sortBy: "createdAt", sortOrder: "desc" },
  { label: "Oldest First", sortBy: "createdAt", sortOrder: "asc" },
  { label: "Price: Low to High", sortBy: "sellingPrice", sortOrder: "asc" },
  { label: "Price: High to Low", sortBy: "sellingPrice", sortOrder: "desc" },
];

export const PER_PAGE_OPTIONS = [12, 24, 36, 48];

export const DEFAULT_LIMIT = 12;
export const DEFAULT_SORT_BY = "createdAt";
export const DEFAULT_SORT_ORDER = "desc";
