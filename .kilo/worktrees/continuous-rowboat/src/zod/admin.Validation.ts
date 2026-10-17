// zod/adminBlog.validation.ts
import * as z from "zod";

export const blogSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug is required"),
  excerpt: z
    .string()
    .max(300, "Excerpt must be under 300 characters")
    .optional(),
  content: z.string().min(1, "Content is required"),
  thumbnail: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional(), // comma separated string in form
  status: z.enum(["DRAFT", "PUBLISHED"]),
  metaTitle: z
    .string()
    .max(60, "Meta title should be under 60 characters")
    .optional(),
  metaDescription: z
    .string()
    .max(160, "Meta description should be under 160 characters")
    .optional(),
});

export type BlogFormValues = z.infer<typeof blogSchema>;
