"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  IAudio,
  IMediaMeta,
  createAudio,
  deleteAudio,
  togglePublishAudio,
  updateAudio,
} from "@/services/mediaContentManagement/audio.service";
import AdminAudioConfirmModal from "./components/AdminAudioConfirmModal";
import AdminAudioFilters from "./components/AdminAudioFilters";
import AdminAudioFormModal, {
  AudioFormPayload,
} from "./components/AdminAudioFormModal";
import AdminAudioTable from "./components/AdminAudioTable";

interface Props {
  audios: IAudio[];
  meta: IMediaMeta;
}

export default function AdminAudioList({ audios, meta }: Props) {
  const [isFilterPending, setIsFilterPending] = useState(false);
  const [isActionPending, startActionTransition] = useTransition();

  // Add/Edit modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAudio, setEditingAudio] = useState<IAudio | null>(null);

  // Delete confirm modal
  const [deleteTarget, setDeleteTarget] = useState<IAudio | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = () => {
    setEditingAudio(null);
    setIsFormOpen(true);
  };

  const handleEdit = (audio: IAudio) => {
    setEditingAudio(audio);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingAudio(null);
  };

  const handleFormSubmit = async (
    payload: AudioFormPayload,
    file: File | null,
  ) => {
    try {
      if (editingAudio) {
        await updateAudio(
          editingAudio.id,
          { title: payload.title, description: payload.description },
          file,
        );
        toast.success("Audio updated successfully");
      } else {
        if (!file) {
          toast.error("Please choose an audio file");
          return;
        }
        await createAudio(
          { title: payload.title, description: payload.description },
          file,
        );
        toast.success("Audio added successfully");
      }
      closeForm();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  };

  const handlePublishToggle = (audio: IAudio) => {
    startActionTransition(async () => {
      try {
        await togglePublishAudio(audio.id, !audio.isPublished);
        toast.success(
          audio.isPublished ? "Audio unpublished" : "Audio published",
        );
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to update status",
        );
      }
    });
  };

  const handleDeleteRequest = (audio: IAudio) => {
    setDeleteTarget(audio);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    const title = deleteTarget.title;
    setDeletingId(id);
    setDeleteTarget(null);
    try {
      await deleteAudio(id);
      toast.success(`"${title || "Audio"}" deleted successfully`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete audio",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <AdminAudioFilters
        onPendingChange={setIsFilterPending}
        onCreate={handleCreate}
      />

      <AdminAudioTable
        items={audios}
        meta={meta}
        isPending={isFilterPending || isActionPending}
        deletingId={deletingId}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
        onPublish={handlePublishToggle}
      />

      {isFormOpen && (
        <AdminAudioFormModal
          initialData={editingAudio}
          onClose={closeForm}
          onSubmit={handleFormSubmit}
        />
      )}

      {deleteTarget && (
        <AdminAudioConfirmModal
          message={`Are you sure you want to delete "${
            deleteTarget.title || "this audio"
          }"? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
