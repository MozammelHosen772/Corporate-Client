"use client";

import { clientActionErrorModal } from "@/lib/clientActionErrorModal";
import {
  createOther,
  deleteOther,
  IOther,
  IOtherMeta,
  togglePublishOther,
  updateOther,
} from "@/services/book/other.service";

import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { toast } from "sonner";
import AdminCreateOtherModal, {
  CreateOtherPayload,
} from "./components/AdminCreateOtherModal";
import AdminEditOtherModal, {
  EditOtherPayload,
} from "./components/AdminEditOtherModal";
import AdminOtherConfirmModal from "./components/AdminOtherConfirmModal";
import AdminOtherFilters from "./components/AdminOtherFilters";
import AdminOtherTable from "./components/AdminOtherTable";

interface Props {
  others: IOther[];
  meta: IOtherMeta;
}

export default function AdminOtherList({ others, meta }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [filterPending, setFilterPending] = useState(false);
  const isTableLoading = isPending || filterPending;

  const [deletingOtherId, setDeletingOtherId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<IOther | null>(null);
  const [confirmPublish, setConfirmPublish] = useState<IOther | null>(null);

  // ─── Create / Edit state ────────────────────────────────────────────────
  const [createOpen, setCreateOpen] = useState(false);
  const [editingOther, setEditingOther] = useState<IOther | null>(null);
  const [saving, setSaving] = useState(false);

  const handleFilterPending = useCallback((pending: boolean) => {
    setFilterPending(pending);
  }, []);

  // ─── Create ─────────────────────────────────────────────────────────────
  const handleCreateSubmit = async (payload: CreateOtherPayload) => {
    setSaving(true);
    try {
      await createOther(
        { title: payload.title, content: payload.content },
        payload.file,
      );
      toast.success("Other created successfully");
      setCreateOpen(false);
      router.refresh();
    } catch (error) {
      if (clientActionErrorModal(error)) return;
      toast.error(
        error instanceof Error ? error.message : "Failed to create Other",
      );
    } finally {
      setSaving(false);
    }
  };

  // ─── Edit ───────────────────────────────────────────────────────────────
  const handleEditSubmit = async (payload: EditOtherPayload) => {
    if (!editingOther) return;
    setSaving(true);
    try {
      await updateOther(
        editingOther.id,
        { title: payload.title, content: payload.content },
        payload.file,
      );
      toast.success("Other updated successfully");
      setEditingOther(null);
      router.refresh();
    } catch (error) {
      if (clientActionErrorModal(error)) return;
      toast.error(
        error instanceof Error ? error.message : "Failed to save Other",
      );
    } finally {
      setSaving(false);
    }
  };

  // ─── Publish ────────────────────────────────────────────────────────────
  const confirmPublishAction = () => {
    if (!confirmPublish) return;
    const other = confirmPublish;
    const nextState = !other.isPublished;
    setConfirmPublish(null);
    startTransition(async () => {
      try {
        await togglePublishOther(other.id, nextState);
        toast.success(nextState ? "Other published" : "Other unpublished");
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
    const other = confirmDelete;
    setConfirmDelete(null);
    setDeletingOtherId(other.id);
    startTransition(async () => {
      try {
        await deleteOther(other.id);
        toast.success("Other deleted successfully");
        router.refresh();
      } catch (error) {
        if (clientActionErrorModal(error)) return;
        toast.error(
          error instanceof Error ? error.message : "Failed to delete Other",
        );
      } finally {
        setDeletingOtherId(null);
      }
    });
  };

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    <>
      {confirmDelete && (
        <AdminOtherConfirmModal
          message={
            <>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-orange-500">
                {confirmDelete.title || "this Other"}
              </span>
              ?
            </>
          }
          onConfirm={confirmDeleteAction}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {confirmPublish && (
        <AdminOtherConfirmModal
          message={
            <>
              Are you sure you want to{" "}
              <span className="font-semibold text-orange-500">
                {confirmPublish.isPublished ? "unpublish" : "publish"}
              </span>{" "}
              <span className="font-semibold text-orange-500">
                {confirmPublish.title || "this Other"}
              </span>
              ?
            </>
          }
          onConfirm={confirmPublishAction}
          onCancel={() => setConfirmPublish(null)}
        />
      )}

      <AdminCreateOtherModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreateSubmit}
        saving={saving}
      />

      {editingOther && (
        <AdminEditOtherModal
          other={editingOther}
          onSubmit={handleEditSubmit}
          onClose={() => setEditingOther(null)}
          saving={saving}
        />
      )}

      <AdminOtherFilters
        onPendingChange={handleFilterPending}
        onCreate={() => setCreateOpen(true)}
      />

      <AdminOtherTable
        others={others}
        meta={meta}
        isPending={isTableLoading}
        deletingOtherId={deletingOtherId}
        onEdit={setEditingOther}
        onDelete={setConfirmDelete}
        onPublish={setConfirmPublish}
      />
    </>
  );
}
