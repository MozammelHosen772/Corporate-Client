"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { IMediaMeta } from "@/services/mediaContentManagement/audio.service";
import {
  IMusicalInstrument,
  IMusicalInstrumentPayload,
  createMusicalInstrument,
  deleteMusicalInstrument,
  togglePublishMusicalInstrument,
  updateMusicalInstrument,
} from "@/services/mediaContentManagement/musicalInstrument.service";
import AdminMusicalInstrumentConfirmModal from "./components/AdminMusicalInstrumentConfirmModal";
import AdminMusicalInstrumentFilter from "./components/AdminMusicalInstrumentFilter";
import AdminMusicalInstrumentFormModal from "./components/AdminMusicalInstrumentFormModal";
import AdminMusicalInstrumentTable from "./components/AdminMusicalInstrumentTable";

interface Props {
  items: IMusicalInstrument[];
  meta: IMediaMeta;
}

export default function AdminMusicalInstrumentList({ items, meta }: Props) {
  const [isFilterPending, setIsFilterPending] = useState(false);
  const [isActionPending, startActionTransition] = useTransition();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IMusicalInstrument | null>(
    null,
  );

  const [deleteTarget, setDeleteTarget] = useState<IMusicalInstrument | null>(
    null,
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: IMusicalInstrument) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleFormSubmit = async (payload: IMusicalInstrumentPayload) => {
    try {
      if (editingItem) {
        await updateMusicalInstrument(editingItem.id, payload);
        toast.success("Musical instrument updated successfully");
      } else {
        await createMusicalInstrument(payload);
        toast.success("Musical instrument added successfully");
      }
      closeForm();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  };

  const handlePublishToggle = (item: IMusicalInstrument) => {
    startActionTransition(async () => {
      try {
        await togglePublishMusicalInstrument(item.id, !item.isPublished);
        toast.success(item.isPublished ? "Unpublished" : "Published");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to update status",
        );
      }
    });
  };

  const handleDeleteRequest = (item: IMusicalInstrument) => {
    setDeleteTarget(item);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    const title = deleteTarget.title;
    setDeletingId(id);
    setDeleteTarget(null);
    try {
      await deleteMusicalInstrument(id);
      toast.success(`"${title || "Instrument"}" deleted successfully`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <AdminMusicalInstrumentFilter
        onPendingChange={setIsFilterPending}
        onCreate={handleCreate}
      />

      <AdminMusicalInstrumentTable
        items={items}
        meta={meta}
        isPending={isFilterPending || isActionPending}
        deletingId={deletingId}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
        onPublish={handlePublishToggle}
      />

      {isFormOpen && (
        <AdminMusicalInstrumentFormModal
          initialData={editingItem}
          onClose={closeForm}
          onSubmit={handleFormSubmit}
        />
      )}

      {deleteTarget && (
        <AdminMusicalInstrumentConfirmModal
          message={`Are you sure you want to delete "${
            deleteTarget.title || "this instrument"
          }"? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
