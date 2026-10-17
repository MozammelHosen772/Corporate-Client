"use client";

import { clientActionErrorModal } from "@/lib/clientActionErrorModal";
import {
  createLyrics,
  deleteLyrics,
  ILyrics,
  ILyricsMeta,
  togglePublishLyrics,
  updateLyrics,
} from "@/services/book/lyrics.service";

import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { toast } from "sonner";
import AdminCreateLyricsModal, {
  CreateLyricsPayload,
} from "./components/AdminCreateLyricsModal";
import AdminEditLyricsModal, {
  EditLyricsPayload,
} from "./components/AdminEditLyricsModal";
import AdminLyricsConfirmModal from "./components/AdminLyricsConfirmModal";
import AdminLyricsFilters from "./components/AdminLyricsFilters";
import AdminLyricsTable from "./components/AdminLyricsTable";

interface Props {
  lyricss: ILyrics[];
  meta: ILyricsMeta;
}

export default function AdminLyricsList({ lyricss, meta }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [filterPending, setFilterPending] = useState(false);
  const isTableLoading = isPending || filterPending;

  const [deletingLyricsId, setDeletingLyricsId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ILyrics | null>(null);
  const [confirmPublish, setConfirmPublish] = useState<ILyrics | null>(null);

  // ─── Create / Edit state ────────────────────────────────────────────────
  const [createOpen, setCreateOpen] = useState(false);
  const [editingLyrics, setEditingLyrics] = useState<ILyrics | null>(null);
  const [saving, setSaving] = useState(false);

  const handleFilterPending = useCallback((pending: boolean) => {
    setFilterPending(pending);
  }, []);

  // ─── Create ─────────────────────────────────────────────────────────────
  const handleCreateSubmit = async (payload: CreateLyricsPayload) => {
    setSaving(true);
    try {
      await createLyrics(
        { title: payload.title, content: payload.content },
        payload.file,
      );
      toast.success("Lyrics created successfully");
      setCreateOpen(false);
      router.refresh();
    } catch (error) {
      if (clientActionErrorModal(error)) return;
      toast.error(
        error instanceof Error ? error.message : "Failed to create Lyrics",
      );
    } finally {
      setSaving(false);
    }
  };

  // ─── Edit ───────────────────────────────────────────────────────────────
  const handleEditSubmit = async (payload: EditLyricsPayload) => {
    if (!editingLyrics) return;
    setSaving(true);
    try {
      await updateLyrics(
        editingLyrics.id,
        { title: payload.title, content: payload.content },
        payload.file,
      );
      toast.success("Lyrics updated successfully");
      setEditingLyrics(null);
      router.refresh();
    } catch (error) {
      if (clientActionErrorModal(error)) return;
      toast.error(
        error instanceof Error ? error.message : "Failed to save Lyrics",
      );
    } finally {
      setSaving(false);
    }
  };

  // ─── Publish ────────────────────────────────────────────────────────────
  const confirmPublishAction = () => {
    if (!confirmPublish) return;
    const lyrics = confirmPublish;
    const nextState = !lyrics.isPublished;
    setConfirmPublish(null);
    startTransition(async () => {
      try {
        await togglePublishLyrics(lyrics.id, nextState);
        toast.success(nextState ? "Lyrics published" : "Lyrics unpublished");
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
    const lyrics = confirmDelete;
    setConfirmDelete(null);
    setDeletingLyricsId(lyrics.id);
    startTransition(async () => {
      try {
        await deleteLyrics(lyrics.id);
        toast.success("Lyrics deleted successfully");
        router.refresh();
      } catch (error) {
        if (clientActionErrorModal(error)) return;
        toast.error(
          error instanceof Error ? error.message : "Failed to delete Lyrics",
        );
      } finally {
        setDeletingLyricsId(null);
      }
    });
  };

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    <>
      {confirmDelete && (
        <AdminLyricsConfirmModal
          message={
            <>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-orange-500">
                {confirmDelete.title || "this Lyrics"}
              </span>
              ?
            </>
          }
          onConfirm={confirmDeleteAction}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {confirmPublish && (
        <AdminLyricsConfirmModal
          message={
            <>
              Are you sure you want to{" "}
              <span className="font-semibold text-orange-500">
                {confirmPublish.isPublished ? "unpublish" : "publish"}
              </span>{" "}
              <span className="font-semibold text-orange-500">
                {confirmPublish.title || "this Lyrics"}
              </span>
              ?
            </>
          }
          onConfirm={confirmPublishAction}
          onCancel={() => setConfirmPublish(null)}
        />
      )}

      <AdminCreateLyricsModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreateSubmit}
        saving={saving}
      />

      {editingLyrics && (
        <AdminEditLyricsModal
          lyrics={editingLyrics}
          onSubmit={handleEditSubmit}
          onClose={() => setEditingLyrics(null)}
          saving={saving}
        />
      )}

      <AdminLyricsFilters
        onPendingChange={handleFilterPending}
        onCreate={() => setCreateOpen(true)}
      />

      <AdminLyricsTable
        lyricss={lyricss}
        meta={meta}
        isPending={isTableLoading}
        deletingLyricsId={deletingLyricsId}
        onEdit={setEditingLyrics}
        onDelete={setConfirmDelete}
        onPublish={setConfirmPublish}
      />
    </>
  );
}
