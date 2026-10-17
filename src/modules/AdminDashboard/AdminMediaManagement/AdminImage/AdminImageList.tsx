"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  IImage,
  IMediaMeta,
  createImage,
  deleteImage,
  togglePublishImage,
  updateImage,
} from "@/services/mediaContentManagement/image.service";
import AdminImageConfirmModal from "./components/AdminImageConfirmModal";
import AdminImageFilter from "./components/AdminImageFilter";
import AdminImageFormModal, {
  ImageFormSubmitPayload,
} from "./components/AdminImageFormModal";
import AdminImageTable from "./components/AdminImageTable";

interface Props {
  images: IImage[];
  meta: IMediaMeta;
}

export default function AdminImageList({ images, meta }: Props) {
  const [isFilterPending, setIsFilterPending] = useState(false);
  const [isActionPending, startActionTransition] = useTransition();

  // Add/Edit modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<IImage | null>(null);

  // Delete confirm modal
  const [deleteTarget, setDeleteTarget] = useState<IImage | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = () => {
    setEditingImage(null);
    setIsFormOpen(true);
  };

  const handleEdit = (image: IImage) => {
    setEditingImage(image);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingImage(null);
  };

  const handleFormSubmit = async (payload: ImageFormSubmitPayload) => {
    try {
      if (editingImage) {
        await updateImage(editingImage.id, payload);
        toast.success("Image updated successfully");
      } else {
        if (!payload.imageUrl || !payload.publicId) {
          toast.error("Image upload failed, please try again");
          return;
        }
        await createImage({
          title: payload.title,
          description: payload.description,
          imageUrl: payload.imageUrl,
          publicId: payload.publicId,
        });
        toast.success("Image added successfully");
      }
      closeForm();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  };

  const handlePublishToggle = (image: IImage) => {
    startActionTransition(async () => {
      try {
        await togglePublishImage(image.id, !image.isPublished);
        toast.success(
          image.isPublished ? "Image unpublished" : "Image published",
        );
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to update status",
        );
      }
    });
  };

  const handleDeleteRequest = (image: IImage) => {
    setDeleteTarget(image);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    const title = deleteTarget.title;
    setDeletingId(id);
    setDeleteTarget(null);
    try {
      await deleteImage(id);
      toast.success(`"${title || "Image"}" deleted successfully`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete image",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <AdminImageFilter
        onPendingChange={setIsFilterPending}
        onCreate={handleCreate}
      />

      <AdminImageTable
        items={images}
        meta={meta}
        isPending={isFilterPending || isActionPending}
        deletingId={deletingId}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
        onPublish={handlePublishToggle}
      />

      {isFormOpen && (
        <AdminImageFormModal
          initialData={editingImage}
          onClose={closeForm}
          onSubmit={handleFormSubmit}
        />
      )}

      {deleteTarget && (
        <AdminImageConfirmModal
          message={`Are you sure you want to delete "${
            deleteTarget.title || "this image"
          }"? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
