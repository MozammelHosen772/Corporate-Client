"use client";

import BlogForm from "@/modules/ManageBlog/components/BlogForm";
import { createBlog, TBlogPayload } from "@/services/blog/blog.service";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminBlogsCreate() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (payload: TBlogPayload) => {
    setSaving(true);
    try {
      await createBlog(payload);
      toast.success(
        payload.status === "PUBLISHED" ? "Blog published" : "Draft saved",
      );
      router.push("/admin/dashboard/all-blog-management");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create blog",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-800 md:text-2xl">
          New Blog
        </h1>
        <p className="mt-1 text-sm text-slate-500">Write a new blog post</p>
      </div>
      <BlogForm onSubmit={handleSubmit} saving={saving} />
    </main>
  );
}
