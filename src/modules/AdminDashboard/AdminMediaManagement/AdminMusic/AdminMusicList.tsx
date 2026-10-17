"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { IMediaMeta } from "@/services/mediaContentManagement/audio.service";
import {
  IMusic,
  IMusicPayload,
  createMusic,
  deleteMusic,
  togglePublishMusic,
  updateMusic,
} from "@/services/mediaContentManagement/music.service";
import AdminMusicConfirmModal from "./components/AdminMusicConfirmModal";
import AdminMusicFilter from "./components/AdminMusicFilter";
import AdminMusicFormModal from "./components/AdminMusicFormModal";
import AdminMusicTable from "./components/AdminMusicTable";

interface Props {
  items: IMusic[];
  meta: IMediaMeta;
}

export default function AdminMusicList({ items, meta }: Props) {
  const [isFilterPending, setIsFilterPending] = useState(false);
  const [isActionPending, startActionTransition] = useTransition();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IMusic | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<IMusic | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: IMusic) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleFormSubmit = async (payload: IMusicPayload) => {
    try {
      if (editingItem) {
        await updateMusic(editingItem.id, payload);
        toast.success("Music updated successfully");
      } else {
        await createMusic(payload);
        toast.success("Music added successfully");
      }
      closeForm();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  };

  const handlePublishToggle = (item: IMusic) => {
    startActionTransition(async () => {
      try {
        await togglePublishMusic(item.id, !item.isPublished);
        toast.success(item.isPublished ? "Unpublished" : "Published");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to update status",
        );
      }
    });
  };

  const handleDeleteRequest = (item: IMusic) => {
    setDeleteTarget(item);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    const title = deleteTarget.title;
    setDeletingId(id);
    setDeleteTarget(null);
    try {
      await deleteMusic(id);
      toast.success(`"${title || "Music"}" deleted successfully`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <AdminMusicFilter
        onPendingChange={setIsFilterPending}
        onCreate={handleCreate}
      />

      <AdminMusicTable
        items={items}
        meta={meta}
        isPending={isFilterPending || isActionPending}
        deletingId={deletingId}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
        onPublish={handlePublishToggle}
      />

      {isFormOpen && (
        <AdminMusicFormModal
          initialData={editingItem}
          onClose={closeForm}
          onSubmit={handleFormSubmit}
        />
      )}

      {deleteTarget && (
        <AdminMusicConfirmModal
          message={`Are you sure you want to delete "${
            deleteTarget.title || "this music"
          }"? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
