"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  IAiConversation,
  createAiConversation,
  deleteAiConversation,
  togglePublishAiConversation,
  updateAiConversation,
} from "@/services/mediaContentManagement/aiConversation.service";
import { IMediaMeta } from "@/services/mediaContentManagement/audio.service";
import AdminAiConversationConfirmModal from "./components/AdminAiConversationConfirmModal";
import AdminAiConversationFilter from "./components/AdminAiConversationFilter";
import AdminAiConversationFormModal, {
  AiConversationFormPayload,
} from "./components/AdminAiConversationFormModal";
import AdminAiConversationTable from "./components/AdminAiConversationTable";

interface Props {
  items: IAiConversation[];
  meta: IMediaMeta;
}

export default function AdminAiConversationList({ items, meta }: Props) {
  const [isFilterPending, setIsFilterPending] = useState(false);
  const [isActionPending, startActionTransition] = useTransition();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IAiConversation | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<IAiConversation | null>(
    null,
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: IAiConversation) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleFormSubmit = async (payload: AiConversationFormPayload) => {
    try {
      if (editingItem) {
        await updateAiConversation(
          editingItem.id,
          { title: payload.title, content: payload.content },
          payload.file,
        );
        toast.success("AI Conversation updated successfully");
      } else {
        await createAiConversation(
          { title: payload.title, content: payload.content },
          payload.file,
        );
        toast.success("AI Conversation added successfully");
      }
      closeForm();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  };

  const handlePublishToggle = (item: IAiConversation) => {
    startActionTransition(async () => {
      try {
        await togglePublishAiConversation(item.id, !item.isPublished);
        toast.success(item.isPublished ? "Unpublished" : "Published");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to update status",
        );
      }
    });
  };

  const handleDeleteRequest = (item: IAiConversation) => {
    setDeleteTarget(item);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    const title = deleteTarget.title;
    setDeletingId(id);
    setDeleteTarget(null);
    try {
      await deleteAiConversation(id);
      toast.success(`"${title || "Conversation"}" deleted successfully`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <AdminAiConversationFilter
        onPendingChange={setIsFilterPending}
        onCreate={handleCreate}
      />

      <AdminAiConversationTable
        items={items}
        meta={meta}
        isPending={isFilterPending || isActionPending}
        deletingId={deletingId}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
        onPublish={handlePublishToggle}
      />

      {isFormOpen && (
        <AdminAiConversationFormModal
          initialData={editingItem}
          onClose={closeForm}
          onSubmit={handleFormSubmit}
        />
      )}

      {deleteTarget && (
        <AdminAiConversationConfirmModal
          message={`Are you sure you want to delete "${
            deleteTarget.title || "this conversation"
          }"? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
