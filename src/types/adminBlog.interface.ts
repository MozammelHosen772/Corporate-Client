export type TBlogStatus = "DRAFT" | "PUBLISHED";

export interface ISelectOption {
  label: string;
  value: string;
}

export interface IBlog {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  thumbnail: string | null;
  thumbnailPublicId: string | null;
  status: TBlogStatus;
  metaTitle: string | null;
  metaDescription: string | null;
  category: string | null;
  tags: string[];
  views: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  author?: { id: number; email: string | null } | null;
}

export interface IBlogMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ICreateBlogPayload {
  title: string;
  excerpt?: string;
  content: string;
  thumbnail?: string;
  thumbnailPublicId?: string;
  status?: TBlogStatus;
  metaTitle?: string;
  metaDescription?: string;
  category?: string;
  tags?: string[];
}
