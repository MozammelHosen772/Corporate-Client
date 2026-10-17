// types/adminDashboard/AdminBlog/AdminBlog.interface.ts

export interface IBlog {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  thumbnail?: string | null;
  status: "DRAFT" | "PUBLISHED";
  metaTitle?: string | null;
  metaDescription?: string | null;
  category?: string | null;
  tags: string[];
  views: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
}

export interface ICreateBlogPayload {
  title: string;
  excerpt?: string;
  content: string;
  thumbnail?: string;
  status: "DRAFT" | "PUBLISHED";
  metaTitle?: string;
  metaDescription?: string;
  category?: string;
  tags?: string[];
}

export interface ISelectOption {
  label: string;
  value: string;
}
