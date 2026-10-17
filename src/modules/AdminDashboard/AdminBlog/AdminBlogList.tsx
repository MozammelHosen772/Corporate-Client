"use client";

import { deleteBlog, updateBlogStatus } from "@/services/blog/blog.service";
import { IBlog, IBlogMeta } from "@/types/adminBlog.interface";
import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { toast } from "sonner";
import AdminBlogConfirmModal from "./components/AdminBlogConfirmModal";
import AdminBlogCreateModal from "./components/AdminBlogCreateModal";
import AdminBlogEditModal from "./components/AdminBlogEditModal";
import AdminBlogFilters from "./components/AdminBlogFilters";
import AdminBlogTable from "./components/AdminBlogTable";

interface Props {
  blogs: IBlog[];
  meta: IBlogMeta;
}

export default function AdminBlogList({ blogs: initialBlogs, meta }: Props) {
  const router = useRouter();
  const [isActionPending, startActionTransition] = useTransition();
  const [isFilterPending, setIsFilterPending] = useState(false);
  const [localBlogs, setLocalBlogs] = useState<IBlog[]>(initialBlogs);
  const [deleteTarget, setDeleteTarget] = useState<IBlog | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // ── Server theke notun blogs prop asle sync — render-time adjustment ────
  const [prevInitialBlogs, setPrevInitialBlogs] = useState(initialBlogs);
  if (initialBlogs !== prevInitialBlogs) {
    setPrevInitialBlogs(initialBlogs);
    setLocalBlogs(initialBlogs);
  }

  const handleFilterPending = useCallback((pending: boolean) => {
    setIsFilterPending(pending);
  }, []);

  // ── Quick publish/unpublish toggle ────────────────────────────────────────
  const togglePublish = (blog: IBlog) => {
    const newStatus = blog.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

    setLocalBlogs((prev) =>
      prev.map((b) => (b.id === blog.id ? { ...b, status: newStatus } : b)),
    );

    startActionTransition(async () => {
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
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const blog = deleteTarget;
    setDeletingId(blog.id);
    setDeleteTarget(null);
    try {
      await deleteBlog(blog.id);
      setLocalBlogs((prev) => prev.filter((b) => b.id !== blog.id));
      toast.success(`"${blog.title || "Blog"}" deleted successfully`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete blog",
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ── Create / Edit success ────────────────────────────────────────────────
  const handleCreated = () => {
    setCreateOpen(false);
    router.refresh();
  };

  const handleUpdated = () => {
    setEditId(null);
    router.refresh();
  };

  return (
    <>
      <AdminBlogFilters
        onPendingChange={handleFilterPending}
        onCreate={() => setCreateOpen(true)}
      />

      <AdminBlogTable
        blogs={localBlogs}
        meta={meta}
        isPending={isFilterPending || isActionPending}
        deletingId={deletingId}
        onTogglePublish={togglePublish}
        onEdit={(blog) => setEditId(blog.id)}
        onDelete={setDeleteTarget}
      />

      <AdminBlogCreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={handleCreated}
      />

      <AdminBlogEditModal
        blogId={editId}
        onClose={() => setEditId(null)}
        onUpdated={handleUpdated}
      />

      {deleteTarget && (
        <AdminBlogConfirmModal
          message={
            <>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-orange-500">
                {deleteTarget.title}
              </span>
              ? This action cannot be undone.
            </>
          }
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}
