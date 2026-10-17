"use client";

import {
  createVideo,
  deleteVideo,
  IMediaMeta,
  IVideo,
  IVideoPayload,
  togglePublishVideo,
  updateVideo,
} from "@/services/mediaContentManagement/video.service";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import AdminVideoConfirmModal from "./components/AdminVideoConfirmModal";
import AdminVideoFilter from "./components/AdminVideoFilter";
import AdminVideoFormModal from "./components/AdminVideoFormModal";
import AdminVideoTable from "./components/AdminVideoTable";

interface Props {
  videos: IVideo[];
  meta: IMediaMeta;
}

export default function AdminVideoList({ videos, meta }: Props) {
  const [isFilterPending, setIsFilterPending] = useState(false);
  const [isActionPending, startActionTransition] = useTransition();

  // Add/Edit modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<IVideo | null>(null);

  // Delete confirm modal
  const [deleteTarget, setDeleteTarget] = useState<IVideo | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = () => {
    setEditingVideo(null);
    setIsFormOpen(true);
  };

  const handleEdit = (video: IVideo) => {
    setEditingVideo(video);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingVideo(null);
  };

  const handleFormSubmit = async (payload: IVideoPayload) => {
    try {
      if (editingVideo) {
        await updateVideo(editingVideo.id, payload);
        toast.success("Video updated successfully");
      } else {
        await createVideo(payload);
        toast.success("Video added successfully");
      }
      closeForm();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  };

  const handlePublishToggle = (video: IVideo) => {
    startActionTransition(async () => {
      try {
        await togglePublishVideo(video.id, !video.isPublished);
        toast.success(
          video.isPublished ? "Video unpublished" : "Video published",
        );
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to update status",
        );
      }
    });
  };

  const handleDeleteRequest = (video: IVideo) => {
    setDeleteTarget(video);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    const title = deleteTarget.title;
    setDeletingId(id);
    setDeleteTarget(null);
    try {
      await deleteVideo(id);
      toast.success(`"${title || "Video"}" deleted successfully`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete video",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <AdminVideoFilter
        onPendingChange={setIsFilterPending}
        onCreate={handleCreate}
      />

      <AdminVideoTable
        items={videos}
        meta={meta}
        isPending={isFilterPending || isActionPending}
        deletingId={deletingId}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
        onPublish={handlePublishToggle}
      />

      {isFormOpen && (
        <AdminVideoFormModal
          initialData={editingVideo}
          onClose={closeForm}
          onSubmit={handleFormSubmit}
        />
      )}

      {deleteTarget && (
        <AdminVideoConfirmModal
          message={`Are you sure you want to delete "${
            deleteTarget.title || "this video"
          }"? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
