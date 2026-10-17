export const BLOG_CATEGORIES = [
  "Tech Tips",
  "Repair Guides",
  "Product Updates",
  "Announcements",
  "General",
] as const;

export type TBlogCategory = (typeof BLOG_CATEGORIES)[number];
