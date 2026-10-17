"use client";

import { clientActionErrorModal } from "@/lib/clientActionErrorModal";

import {
  deleteSlider,
  getAllSliders,
  toggleSliderStatus,
  TSliderItem,
} from "@/services/settings/bannerSlider.service";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import SliderForm from "./components/SliderForm";
import SliderTable from "./components/SliderTable";
import ToggleConfirmModal from "./components/ToggleConfirmModal";

type Props = {
  initialSliders: TSliderItem[];
};

export default function AdminSlider({ initialSliders }: Props) {
  const [sliders, setSliders] = useState<TSliderItem[]>(initialSliders);
  const [refreshing, setRefreshing] = useState(false); // initial load নেই, শুধু re-fetch

  const [confirmToggle, setConfirmToggle] = useState<TSliderItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<TSliderItem | null>(null);
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ─── Single reusable refresh (useEffect নেই, duplicate নেই) ──────────────

  const refreshSliders = useCallback(async () => {
    try {
      setRefreshing(true);
      const data = await getAllSliders();
      setSliders(data);
    } catch (error) {
      if (clientActionErrorModal(error)) return;
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch sliders",
      );
    } finally {
      setRefreshing(false);
    }
  }, []);

  // ─── Toggle ───────────────────────────────────────────────────────────────

  const handleToggleConfirm = async () => {
    if (!confirmToggle) return;
    const slider = confirmToggle;
    setToggling(true);
    try {
      await toggleSliderStatus(slider.id);
      toast.success(
        `"${slider.title}" ${slider.isActive ? "deactivated" : "activated"} successfully`,
      );
      setConfirmToggle(null);
      await refreshSliders();
    } catch (error) {
      if (clientActionErrorModal(error)) return;
      toast.error(
        error instanceof Error ? error.message : "Failed to update slider",
      );
    } finally {
      setToggling(false);
    }
  };

  // ─── Delete ───────────────────────────────────────────────────────────────

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    const slider = confirmDelete;
    setDeleting(true);
    const toastId = toast.loading(`Deleting "${slider.title}"...`);
    try {
      await deleteSlider(slider.id);
      toast.success(`"${slider.title}" deleted successfully`, { id: toastId });
      setConfirmDelete(null);
      await refreshSliders();
    } catch (error) {
      if (clientActionErrorModal(error)) return;
      toast.error(
        error instanceof Error ? error.message : "Failed to delete slider",
        { id: toastId },
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {confirmToggle && (
        <ToggleConfirmModal
          slider={confirmToggle}
          onConfirm={handleToggleConfirm}
          onCancel={() => setConfirmToggle(null)}
          loading={toggling}
        />
      )}
      {confirmDelete && (
        <DeleteConfirmModal
          slider={confirmDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setConfirmDelete(null)}
          loading={deleting}
        />
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-800">
              Slider Management
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage homepage banner sliders
            </p>
          </div>
          <div className="flex items-center gap-0.5 md:gap-3 rounded-full border border-slate-200 bg-slate-50 px-1 md:px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-medium text-slate-600">
              {sliders.filter((s) => s.isActive).length} active
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-400">
              {sliders.length} total
            </span>
          </div>
        </div>

        <SliderForm onSuccess={refreshSliders} />

        <SliderTable
          sliders={sliders}
          fetching={refreshing}
          onToggle={setConfirmToggle}
          onDelete={setConfirmDelete}
        />
      </div>
    </>
  );
}
