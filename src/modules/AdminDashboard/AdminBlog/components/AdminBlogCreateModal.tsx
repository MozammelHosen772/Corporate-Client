"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createBlog } from "@/services/blog/blog.service";
import { ICreateBlogPayload } from "@/types/adminBlog.interface";
import { useState } from "react";
import { toast } from "sonner";
import BlogForm from "./BlogForm";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function AdminBlogCreateModal({
  open,
  onClose,
  onCreated,
}: Props) {
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (payload: ICreateBlogPayload) => {
    setSaving(true);
    try {
      await createBlog(payload);
      toast.success(
        payload.status === "PUBLISHED" ? "Blog published" : "Draft created",
      );
      onCreated();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create blog",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && !saving && onClose()}>
      <DialogContent className="w-[95vw] !max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Blog</DialogTitle>
        </DialogHeader>
        <BlogForm onSubmit={handleSubmit} saving={saving} />
      </DialogContent>
    </Dialog>
  );
}
