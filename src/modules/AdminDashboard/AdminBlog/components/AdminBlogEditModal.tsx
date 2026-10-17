"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getBlogById, updateBlog } from "@/services/blog/blog.service";
import { IBlog, ICreateBlogPayload } from "@/types/adminBlog.interface";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import BlogForm from "./BlogForm";

interface Props {
  blogId: number | null;
  onClose: () => void;
  onUpdated: () => void;
}

export default function AdminBlogEditModal({
  blogId,
  onClose,
  onUpdated,
}: Props) {
  const [blog, setBlog] = useState<IBlog | null>(null);
  const [saving, setSaving] = useState(false);

  // ── Effect e shudhu legit async fetch — setState kebol .then()/.catch()
  // callback er bhitor e, effect body te synchronous setState nei ────────
  useEffect(() => {
    if (!blogId) return;

    let active = true;

    getBlogById(blogId)
      .then((data) => {
        if (active) setBlog(data);
      })
      .catch((error) => {
        toast.error(
          error instanceof Error ? error.message : "Failed to load blog",
        );
        onClose();
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogId]);

  // ── loading ekhon alada state na, existing state theke derive kora —
  // blogId ache kintu still fetch hocche matching blog data, tokhon loading ──
  const currentBlog = blogId && blog?.id === blogId ? blog : null;
  const loading = !!blogId && !currentBlog;

  const handleSubmit = async (payload: ICreateBlogPayload) => {
    if (!currentBlog) return;
    setSaving(true);
    try {
      await updateBlog(currentBlog.id, payload);
      toast.success(
        payload.status === "PUBLISHED" ? "Blog published" : "Draft saved",
      );
      onUpdated();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update blog",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={!!blogId} onOpenChange={(o) => !o && !saving && onClose()}>
      <DialogContent className="w-[95vw] !max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Blog</DialogTitle>
        </DialogHeader>
        {loading || !currentBlog ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : (
          <BlogForm
            initialData={currentBlog}
            onSubmit={handleSubmit}
            saving={saving}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
