"use client";

import { clientActionErrorModal } from "@/lib/clientActionErrorModal";
import {
  createPoem,
  deletePoem,
  IPoem,
  IPoemMeta,
  togglePublishPoem,
  updatePoem,
} from "@/services/book/poem.service";

import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { toast } from "sonner";
import AdminCreatePoemModal, {
  CreatePoemPayload,
} from "./components/AdminCreatePoemModal";
import AdminEditPoemModal, {
  EditPoemPayload,
} from "./components/AdminEditPoemModal";
import AdminPoemConfirmModal from "./components/AdminPoemConfirmModal";
import AdminPoemFilters from "./components/AdminPoemFilters";
import AdminPoemTable from "./components/AdminPoemTable";

interface Props {
  poems: IPoem[];
  meta: IPoemMeta;
}

export default function AdminPoemList({ poems, meta }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [filterPending, setFilterPending] = useState(false);
  const isTableLoading = isPending || filterPending;

  const [deletingPoemId, setDeletingPoemId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<IPoem | null>(null);
  const [confirmPublish, setConfirmPublish] = useState<IPoem | null>(null);

  // ─── Create / Edit state ────────────────────────────────────────────────
  const [createOpen, setCreateOpen] = useState(false);
  const [editingPoem, setEditingPoem] = useState<IPoem | null>(null);
  const [saving, setSaving] = useState(false);

  const handleFilterPending = useCallback((pending: boolean) => {
    setFilterPending(pending);
  }, []);

  // ─── Create ─────────────────────────────────────────────────────────────
  const handleCreateSubmit = async (payload: CreatePoemPayload) => {
    setSaving(true);
    try {
      await createPoem(
        { title: payload.title, content: payload.content },
        payload.file,
      );
      toast.success("Poem created successfully");
      setCreateOpen(false);
      router.refresh();
    } catch (error) {
      if (clientActionErrorModal(error)) return;
      toast.error(
        error instanceof Error ? error.message : "Failed to create Poem",
      );
    } finally {
      setSaving(false);
    }
  };

  // ─── Edit ───────────────────────────────────────────────────────────────
  const handleEditSubmit = async (payload: EditPoemPayload) => {
    if (!editingPoem) return;
    setSaving(true);
    try {
      await updatePoem(
        editingPoem.id,
        { title: payload.title, content: payload.content },
        payload.file,
      );
      toast.success("Poem updated successfully");
      setEditingPoem(null);
      router.refresh();
    } catch (error) {
      if (clientActionErrorModal(error)) return;
      toast.error(
        error instanceof Error ? error.message : "Failed to save Poem",
      );
    } finally {
      setSaving(false);
    }
  };

  // ─── Publish ────────────────────────────────────────────────────────────
  const confirmPublishAction = () => {
    if (!confirmPublish) return;
    const poem = confirmPublish;
    const nextState = !poem.isPublished;
    setConfirmPublish(null);
    startTransition(async () => {
      try {
        await togglePublishPoem(poem.id, nextState);
        toast.success(nextState ? "Poem published" : "Poem unpublished");
        router.refresh();
      } catch (error) {
        if (clientActionErrorModal(error)) return;
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to update publish status",
        );
      }
    });
  };

  // ─── Delete ─────────────────────────────────────────────────────────────
  const confirmDeleteAction = () => {
    if (!confirmDelete) return;
    const poem = confirmDelete;
    setConfirmDelete(null);
    setDeletingPoemId(poem.id);
    startTransition(async () => {
      try {
        await deletePoem(poem.id);
        toast.success("Poem deleted successfully");
        router.refresh();
      } catch (error) {
        if (clientActionErrorModal(error)) return;
        toast.error(
          error instanceof Error ? error.message : "Failed to delete Poem",
        );
      } finally {
        setDeletingPoemId(null);
      }
    });
  };

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    <>
      {confirmDelete && (
        <AdminPoemConfirmModal
          message={
            <>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-orange-500">
                {confirmDelete.title || "this Poem"}
              </span>
              ?
            </>
          }
          onConfirm={confirmDeleteAction}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {confirmPublish && (
        <AdminPoemConfirmModal
          message={
            <>
              Are you sure you want to{" "}
              <span className="font-semibold text-orange-500">
                {confirmPublish.isPublished ? "unpublish" : "publish"}
              </span>{" "}
              <span className="font-semibold text-orange-500">
                {confirmPublish.title || "this Poem"}
              </span>
              ?
            </>
          }
          onConfirm={confirmPublishAction}
          onCancel={() => setConfirmPublish(null)}
        />
      )}

      <AdminCreatePoemModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreateSubmit}
        saving={saving}
      />

      {editingPoem && (
        <AdminEditPoemModal
          poem={editingPoem}
          onSubmit={handleEditSubmit}
          onClose={() => setEditingPoem(null)}
          saving={saving}
        />
      )}

      <AdminPoemFilters
        onPendingChange={handleFilterPending}
        onCreate={() => setCreateOpen(true)}
      />

      <AdminPoemTable
        poems={poems}
        meta={meta}
        isPending={isTableLoading}
        deletingPoemId={deletingPoemId}
        onEdit={setEditingPoem}
        onDelete={setConfirmDelete}
        onPublish={setConfirmPublish}
      />
    </>
  );
}
