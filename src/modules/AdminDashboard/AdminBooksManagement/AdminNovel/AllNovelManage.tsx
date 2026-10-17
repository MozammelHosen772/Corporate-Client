// "use client";

// import { clientActionErrorModal } from "@/lib/clientActionErrorModal";
// import {
//   createNovel,
//   deleteNovel,
//   INovel,
//   INovelMeta,
//   togglePublishNovel,
//   updateNovel,
// } from "@/services/book/novel.service";
// import { useRouter } from "next/navigation";
// import { useCallback, useState, useTransition } from "react";
// import { toast } from "sonner";
// import ConfirmModal from "./components/ConfirmModal";
// import NovelFilters from "./components/NovelFilters";
// import NovelFormModal, { NovelFormPayload } from "./components/NovelFormModal";
// import NovelTable from "./components/NovelTable";

// interface Props {
//   novels: INovel[];
//   meta: INovelMeta;
// }

// export default function AdminAllNovelManage({ novels, meta }: Props) {
//   const router = useRouter();
//   const [isPending, startTransition] = useTransition();
//   const [filterPending, setFilterPending] = useState(false);
//   const isTableLoading = isPending || filterPending;

//   const [deletingNovelId, setDeletingNovelId] = useState<string | null>(null);
//   const [confirmDelete, setConfirmDelete] = useState<INovel | null>(null);
//   const [confirmPublish, setConfirmPublish] = useState<INovel | null>(null);

//   // ─── Modal State ────────────────────────────────────────────────────────
//   const [formOpen, setFormOpen] = useState(false);
//   const [editingNovel, setEditingNovel] = useState<INovel | null>(null);
//   const [saving, setSaving] = useState(false);

//   const handleFilterPending = useCallback((pending: boolean) => {
//     setFilterPending(pending);
//   }, []);

//   const handleOpenCreate = () => {
//     setEditingNovel(null);
//     setFormOpen(true);
//   };

//   const handleOpenEdit = (novel: INovel) => {
//     setEditingNovel(novel);
//     setFormOpen(true);
//   };

//   // ─── Create / Update ────────────────────────────────────────────────────
//   const handleFormSubmit = async (payload: NovelFormPayload) => {
//     setSaving(true);
//     try {
//       if (editingNovel) {
//         await updateNovel(
//           editingNovel.id,
//           { title: payload.title, content: payload.content },
//           payload.file,
//         );
//         toast.success("Novel updated successfully");
//       } else {
//         await createNovel(
//           { title: payload.title, content: payload.content },
//           payload.file,
//         );
//         toast.success("Novel created successfully");
//       }
//       setFormOpen(false);
//       setEditingNovel(null);
//       router.refresh();
//     } catch (error) {
//       if (clientActionErrorModal(error)) return;
//       toast.error(
//         error instanceof Error ? error.message : "Failed to save novel",
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ─── Publish ────────────────────────────────────────────────────────────
//   const confirmPublishAction = () => {
//     if (!confirmPublish) return;
//     const novel = confirmPublish;
//     const nextState = !novel.isPublished;
//     setConfirmPublish(null);
//     startTransition(async () => {
//       try {
//         await togglePublishNovel(novel.id, nextState);
//         toast.success(nextState ? "Novel published" : "Novel unpublished");
//         router.refresh();
//       } catch (error) {
//         if (clientActionErrorModal(error)) return;
//         toast.error(
//           error instanceof Error
//             ? error.message
//             : "Failed to update publish status",
//         );
//       }
//     });
//   };

//   // ─── Delete ─────────────────────────────────────────────────────────────
//   const confirmDeleteAction = () => {
//     if (!confirmDelete) return;
//     const novel = confirmDelete;
//     setConfirmDelete(null);
//     setDeletingNovelId(novel.id);
//     startTransition(async () => {
//       try {
//         await deleteNovel(novel.id);
//         toast.success("Novel deleted successfully");
//         router.refresh();
//       } catch (error) {
//         if (clientActionErrorModal(error)) return;
//         toast.error(
//           error instanceof Error ? error.message : "Failed to delete novel",
//         );
//       } finally {
//         setDeletingNovelId(null);
//       }
//     });
//   };

//   // ─── Render ─────────────────────────────────────────────────────────────
//   return (
//     <>
//       {confirmDelete && (
//         <ConfirmModal
//           message={
//             <>
//               Are you sure you want to delete{" "}
//               <span className="font-semibold text-orange-500">
//                 {confirmDelete.title || "this novel"}
//               </span>
//               ?
//             </>
//           }
//           onConfirm={confirmDeleteAction}
//           onCancel={() => setConfirmDelete(null)}
//         />
//       )}

//       {confirmPublish && (
//         <ConfirmModal
//           message={
//             <>
//               Are you sure you want to{" "}
//               <span className="font-semibold text-orange-500">
//                 {confirmPublish.isPublished ? "unpublish" : "publish"}
//               </span>{" "}
//               <span className="font-semibold text-orange-500">
//                 {confirmPublish.title || "this novel"}
//               </span>
//               ?
//             </>
//           }
//           onConfirm={confirmPublishAction}
//           onCancel={() => setConfirmPublish(null)}
//         />
//       )}

//       <NovelFormModal
//         open={formOpen}
//         onOpenChange={setFormOpen}
//         initialData={editingNovel}
//         onSubmit={handleFormSubmit}
//         saving={saving}
//       />

//       <NovelFilters
//         onPendingChange={handleFilterPending}
//         onCreate={handleOpenCreate}
//       />

//       <NovelTable
//         novels={novels}
//         meta={meta}
//         isPending={isTableLoading}
//         deletingNovelId={deletingNovelId}
//         onEdit={handleOpenEdit}
//         onDelete={setConfirmDelete}
//         onPublish={setConfirmPublish}
//       />
//     </>
//   );
// }
"use client";

import { clientActionErrorModal } from "@/lib/clientActionErrorModal";
import {
  createNovel,
  deleteNovel,
  INovel,
  INovelMeta,
  togglePublishNovel,
  updateNovel,
} from "@/services/book/novel.service";
import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { toast } from "sonner";
import ConfirmModal from "./components/ConfirmModal";
import CreateNovelModal, {
  CreateNovelPayload,
} from "./components/CreateNovelModal";
import EditNovelModal, { EditNovelPayload } from "./components/EditNovelModal";
import NovelFilters from "./components/NovelFilters";
import NovelTable from "./components/NovelTable";

interface Props {
  novels: INovel[];
  meta: INovelMeta;
}

export default function AdminAllNovelManage({ novels, meta }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [filterPending, setFilterPending] = useState(false);
  const isTableLoading = isPending || filterPending;

  const [deletingNovelId, setDeletingNovelId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<INovel | null>(null);
  const [confirmPublish, setConfirmPublish] = useState<INovel | null>(null);

  // ─── Create / Edit state ────────────────────────────────────────────────
  const [createOpen, setCreateOpen] = useState(false);
  const [editingNovel, setEditingNovel] = useState<INovel | null>(null);
  const [saving, setSaving] = useState(false);

  const handleFilterPending = useCallback((pending: boolean) => {
    setFilterPending(pending);
  }, []);

  // ─── Create ─────────────────────────────────────────────────────────────
  const handleCreateSubmit = async (payload: CreateNovelPayload) => {
    setSaving(true);
    try {
      await createNovel(
        { title: payload.title, content: payload.content },
        payload.file,
      );
      toast.success("Novel created successfully");
      setCreateOpen(false);
      router.refresh();
    } catch (error) {
      if (clientActionErrorModal(error)) return;
      toast.error(
        error instanceof Error ? error.message : "Failed to create novel",
      );
    } finally {
      setSaving(false);
    }
  };

  // ─── Edit ───────────────────────────────────────────────────────────────
  const handleEditSubmit = async (payload: EditNovelPayload) => {
    if (!editingNovel) return;
    setSaving(true);
    try {
      await updateNovel(
        editingNovel.id,
        { title: payload.title, content: payload.content },
        payload.file,
      );
      toast.success("Novel updated successfully");
      setEditingNovel(null);
      router.refresh();
    } catch (error) {
      if (clientActionErrorModal(error)) return;
      toast.error(
        error instanceof Error ? error.message : "Failed to save novel",
      );
    } finally {
      setSaving(false);
    }
  };

  // ─── Publish ────────────────────────────────────────────────────────────
  const confirmPublishAction = () => {
    if (!confirmPublish) return;
    const novel = confirmPublish;
    const nextState = !novel.isPublished;
    setConfirmPublish(null);
    startTransition(async () => {
      try {
        await togglePublishNovel(novel.id, nextState);
        toast.success(nextState ? "Novel published" : "Novel unpublished");
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
    const novel = confirmDelete;
    setConfirmDelete(null);
    setDeletingNovelId(novel.id);
    startTransition(async () => {
      try {
        await deleteNovel(novel.id);
        toast.success("Novel deleted successfully");
        router.refresh();
      } catch (error) {
        if (clientActionErrorModal(error)) return;
        toast.error(
          error instanceof Error ? error.message : "Failed to delete novel",
        );
      } finally {
        setDeletingNovelId(null);
      }
    });
  };

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    <>
      {confirmDelete && (
        <ConfirmModal
          message={
            <>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-orange-500">
                {confirmDelete.title || "this novel"}
              </span>
              ?
            </>
          }
          onConfirm={confirmDeleteAction}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {confirmPublish && (
        <ConfirmModal
          message={
            <>
              Are you sure you want to{" "}
              <span className="font-semibold text-orange-500">
                {confirmPublish.isPublished ? "unpublish" : "publish"}
              </span>{" "}
              <span className="font-semibold text-orange-500">
                {confirmPublish.title || "this novel"}
              </span>
              ?
            </>
          }
          onConfirm={confirmPublishAction}
          onCancel={() => setConfirmPublish(null)}
        />
      )}

      <CreateNovelModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreateSubmit}
        saving={saving}
      />

      {editingNovel && (
        <EditNovelModal
          novel={editingNovel}
          onSubmit={handleEditSubmit}
          onClose={() => setEditingNovel(null)}
          saving={saving}
        />
      )}

      <NovelFilters
        onPendingChange={handleFilterPending}
        onCreate={() => setCreateOpen(true)}
      />

      <NovelTable
        novels={novels}
        meta={meta}
        isPending={isTableLoading}
        deletingNovelId={deletingNovelId}
        onEdit={setEditingNovel}
        onDelete={setConfirmDelete}
        onPublish={setConfirmPublish}
      />
    </>
  );
}
