"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { IMediaMeta } from "@/services/mediaContentManagement/audio.service";
import {
  IOtherMedia,
  createOtherMedia,
  deleteOtherMedia,
  togglePublishOtherMedia,
  updateOtherMedia,
} from "@/services/mediaContentManagement/other.service";
import AdminOtherConfirmModal from "./components/AdminOtherConfirmModal";
import AdminOtherFilter from "./components/AdminOtherFilter";
import AdminOtherFormModal, {
  OtherFormPayload,
} from "./components/AdminOtherFormModal";
import AdminOtherTable from "./components/AdminOtherTable";

interface Props {
  items: IOtherMedia[];
  meta: IMediaMeta;
}

export default function AdminOtherList({ items, meta }: Props) {
  const [isFilterPending, setIsFilterPending] = useState(false);
  const [isActionPending, startActionTransition] = useTransition();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IOtherMedia | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<IOtherMedia | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: IOtherMedia) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleFormSubmit = async (payload: OtherFormPayload) => {
    try {
      if (editingItem) {
        await updateOtherMedia(
          editingItem.id,
          { title: payload.title, content: payload.content },
          payload.file,
        );
        toast.success("Entry updated successfully");
      } else {
        await createOtherMedia(
          { title: payload.title, content: payload.content },
          payload.file,
        );
        toast.success("Entry added successfully");
      }
      closeForm();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  };

  const handlePublishToggle = (item: IOtherMedia) => {
    startActionTransition(async () => {
      try {
        await togglePublishOtherMedia(item.id, !item.isPublished);
        toast.success(item.isPublished ? "Unpublished" : "Published");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to update status",
        );
      }
    });
  };

  const handleDeleteRequest = (item: IOtherMedia) => {
    setDeleteTarget(item);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    const title = deleteTarget.title;
    setDeletingId(id);
    setDeleteTarget(null);
    try {
      await deleteOtherMedia(id);
      toast.success(`"${title || "Entry"}" deleted successfully`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <AdminOtherFilter
        onPendingChange={setIsFilterPending}
        onCreate={handleCreate}
      />

      <AdminOtherTable
        items={items}
        meta={meta}
        isPending={isFilterPending || isActionPending}
        deletingId={deletingId}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
        onPublish={handlePublishToggle}
      />

      {isFormOpen && (
        <AdminOtherFormModal
          initialData={editingItem}
          onClose={closeForm}
          onSubmit={handleFormSubmit}
        />
      )}

      {deleteTarget && (
        <AdminOtherConfirmModal
          message={`Are you sure you want to delete "${
            deleteTarget.title || "this entry"
          }"? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
