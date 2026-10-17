"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  createAboutLeader,
  deleteAboutLeader,
  IAboutLeader,
  IAboutLeaderPayload,
  togglePublishAboutLeader,
  updateAboutLeader,
} from "@/services/mediaContentManagement/aboutLeader.service";
import { IMediaMeta } from "@/services/mediaContentManagement/audio.service";
import AdminAiExploreConfirmModal from "./components/AdminAiExploreConfirmModal";
import AdminAiExploreFilter from "./components/AdminAiExploreFilter";
import AdminAiExploreFormModal from "./components/AdminAiExploreFormModal";
import AdminAiExploreTable from "./components/AdminAiExploreTable";

interface Props {
  items: IAboutLeader[];
  meta: IMediaMeta;
}

export default function AdminAboutLeaderList({ items, meta }: Props) {
  const [isFilterPending, setIsFilterPending] = useState(false);
  const [isActionPending, startActionTransition] = useTransition();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IAboutLeader | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<IAboutLeader | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: IAboutLeader) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleFormSubmit = async (payload: IAboutLeaderPayload) => {
    try {
      if (editingItem) {
        await updateAboutLeader(editingItem.id, payload);
        toast.success("AI Explore item updated successfully");
      } else {
        await createAboutLeader(payload);
        toast.success("AI Explore item added successfully");
      }
      closeForm();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  };

  const handlePublishToggle = (item: IAboutLeader) => {
    startActionTransition(async () => {
      try {
        await togglePublishAboutLeader(item.id, !item.isPublished);
        toast.success(item.isPublished ? "Unpublished" : "Published");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to update status",
        );
      }
    });
  };

  const handleDeleteRequest = (item: IAboutLeader) => {
    setDeleteTarget(item);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    const title = deleteTarget.title;
    setDeletingId(id);
    setDeleteTarget(null);
    try {
      await deleteAboutLeader(id);
      toast.success(`"${title || "Item"}" deleted successfully`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <AdminAiExploreFilter
        onPendingChange={setIsFilterPending}
        onCreate={handleCreate}
      />

      <AdminAiExploreTable
        items={items}
        meta={meta}
        isPending={isFilterPending || isActionPending}
        deletingId={deletingId}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
        onPublish={handlePublishToggle}
      />

      {isFormOpen && (
        <AdminAiExploreFormModal
          initialData={editingItem}
          onClose={closeForm}
          onSubmit={handleFormSubmit}
        />
      )}

      {deleteTarget && (
        <AdminAiExploreConfirmModal
          message={`Are you sure you want to delete "${
            deleteTarget.title || "this item"
          }"? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
