import * as z from "zod";

export const blogSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug is required"),
  excerpt: z
    .string()
    .max(300, "Excerpt is too long")
    .optional()
    .or(z.literal("")),
  content: z.string().min(20, "Content must be at least 20 characters"),
  thumbnail: z.string().optional().or(z.literal("")),
  thumbnailPublicId: z.string().optional().or(z.literal("")),
  category: z.string().optional().or(z.literal("")),
  tags: z.string().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  metaTitle: z
    .string()
    .max(60, "Meta title too long")
    .optional()
    .or(z.literal("")),
  metaDescription: z
    .string()
    .max(160, "Meta description too long")
    .optional()
    .or(z.literal("")),
});
