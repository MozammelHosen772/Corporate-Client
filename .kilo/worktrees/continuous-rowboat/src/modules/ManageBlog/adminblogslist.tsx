"use client";

import {
  deleteBlog,
  TBlog,
  TBlogMeta,
  updateBlogStatus,
} from "@/services/blog/blog.service";
import { useCallback, useState, useTransition } from "react";
import { toast } from "sonner";
import BlogConfirmModal from "./components/Blogconfirmmodal";
import BlogFilters from "./components/Blogfilters";
import BlogTable from "./components/Blogtable";

interface Props {
  blogs: TBlog[];
  meta: TBlogMeta;
}

export default function AdminblogsList({ blogs: initialBlogs, meta }: Props) {
  const [isPending, startTransition] = useTransition();
  const [filterPending, setFilterPending] = useState(false);
  const [localBlogs, setLocalBlogs] = useState<TBlog[]>(initialBlogs);
  const [deleteTarget, setDeleteTarget] = useState<TBlog | null>(null);

  const handleFilterPending = useCallback((pending: boolean) => {
    setFilterPending(pending);
  }, []);

  // ── Quick publish/unpublish toggle ────────────────────────────────────────
  const togglePublish = (blog: TBlog) => {
    const newStatus = blog.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

    setLocalBlogs((prev) =>
      prev.map((b) => (b.id === blog.id ? { ...b, status: newStatus } : b)),
    );

    startTransition(async () => {
      try {
        await updateBlogStatus(blog.id, newStatus);
        toast.success(
          newStatus === "PUBLISHED" ? "Blog published" : "Blog moved to draft",
        );
      } catch (error) {
        setLocalBlogs((prev) =>
          prev.map((b) =>
            b.id === blog.id ? { ...b, status: blog.status } : b,
          ),
        );
        toast.error(
          error instanceof Error ? error.message : "Failed to update status",
        );
      }
    });
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const confirmDeleteAction = () => {
    if (!deleteTarget) return;
    const blog = deleteTarget;
    setDeleteTarget(null);

    setLocalBlogs((prev) => prev.filter((b) => b.id !== blog.id));

    startTransition(async () => {
      try {
        await deleteBlog(blog.id);
        toast.success("Blog deleted successfully");
      } catch (error) {
        setLocalBlogs((prev) => {
          const idx = initialBlogs.findIndex((b) => b.id === blog.id);
          const next = [...prev];
          next.splice(idx, 0, blog);
          return next;
        });
        toast.error(
          error instanceof Error ? error.message : "Failed to delete blog",
        );
      }
    });
  };

  return (
    <>
      {deleteTarget && (
        <BlogConfirmModal
          message={
            <>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-orange-500">
                {deleteTarget.title}
              </span>
              ? This action cannot be undone.
            </>
          }
          onConfirm={confirmDeleteAction}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <BlogFilters onPendingChange={handleFilterPending} />

      <BlogTable
        blogs={localBlogs}
        meta={meta}
        isPending={filterPending}
        onTogglePublish={togglePublish}
        onDelete={setDeleteTarget}
      />
    </>
  );
}
