"use client";

import {
  getBlogById,
  TBlog,
  TBlogPayload,
  updateBlog,
} from "@/services/blog/blog.service";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import BlogForm from "./BlogForm";

export default function AdminblogsEdit() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [blog, setBlog] = useState<TBlog | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await getBlogById(Number(params.id));
        setBlog(data);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load blog",
        );
        router.push("/admin/dashboard/all-blog-management");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [params.id, router]);

  const handleSubmit = async (payload: TBlogPayload) => {
    if (!blog) return;
    setSaving(true);
    try {
      await updateBlog(blog.id, payload);
      toast.success(
        payload.status === "PUBLISHED" ? "Blog published" : "Draft saved",
      );
      router.push("/admin/dashboard/all-blog-management");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update blog",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main>
        <div className="h-8 w-40 animate-pulse rounded bg-slate-100 mb-6" />
        <div className="h-96 animate-pulse rounded-2xl bg-slate-100" />
      </main>
    );
  }

  if (!blog) return null;

  return (
    <main>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-800 md:text-2xl">
          Edit Blog
        </h1>
        <p className="mt-1 text-sm text-slate-500">{blog.title}</p>
      </div>
      <BlogForm initialData={blog} onSubmit={handleSubmit} saving={saving} />
    </main>
  );
}
