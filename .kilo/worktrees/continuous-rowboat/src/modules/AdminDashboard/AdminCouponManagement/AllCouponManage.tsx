"use client";

import { clientActionErrorModal } from "@/lib/clientActionErrorModal";
import {
  deleteCoupon,
  TCoupon,
  TCouponMeta,
  toggleCouponStatus,
} from "@/services/coupon/coupon.service";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import ConfirmModal from "./components/ConfirmModal";
import CouponFilters from "./components/CouponFilters";
import CouponTable from "./components/CouponTable";

interface Props {
  coupons: TCoupon[];
  meta: TCouponMeta;
}

export default function AllCouponManage({ coupons, meta }: Props) {
  const [isPending, startTransition] = useTransition();
  const [filterPending, setFilterPending] = useState(false);

  const isTableLoading = isPending || filterPending;

  const [deletingCouponId, setDeletingCouponId] = useState<string | null>(null);
  const [togglingCouponId, setTogglingCouponId] = useState<string | null>(null);

  const [confirmDelete, setConfirmDelete] = useState<TCoupon | null>(null);
  const [confirmStatusChange, setConfirmStatusChange] =
    useState<TCoupon | null>(null);

  // ─── Status Toggle ──────────────────────────────────────────────────────────

  const confirmStatusChangeAction = () => {
    if (!confirmStatusChange) return;
    const coupon = confirmStatusChange;
    setConfirmStatusChange(null);
    setTogglingCouponId(coupon.id);

    startTransition(async () => {
      try {
        await toggleCouponStatus(coupon.id, coupon.isActive);
        toast.success(
          `Coupon "${coupon.code}" is now ${coupon.isActive ? "inactive" : "active"}`,
        );
      } catch (error) {
        if (clientActionErrorModal(error)) return;
        toast.error(
          error instanceof Error ? error.message : "Failed to update status",
        );
      } finally {
        setTogglingCouponId(null);
      }
    });
  };

  // ─── Delete ─────────────────────────────────────────────────────────────────

  const confirmDeleteAction = () => {
    if (!confirmDelete) return;
    const coupon = confirmDelete;
    setConfirmDelete(null);
    setDeletingCouponId(coupon.id);

    startTransition(async () => {
      try {
        await deleteCoupon(coupon.id);
        toast.success("Coupon deleted successfully");
      } catch (error) {
        if (clientActionErrorModal(error)) return;
        toast.error(
          error instanceof Error ? error.message : "Failed to delete coupon",
        );
      } finally {
        setDeletingCouponId(null);
      }
    });
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {confirmStatusChange && (
        <ConfirmModal
          message={
            <>
              Are you sure you want to mark{" "}
              <span className="font-semibold text-orange-500">
                {confirmStatusChange.code}
              </span>{" "}
              as{" "}
              <span className="font-semibold text-orange-600">
                {confirmStatusChange.isActive ? "Inactive" : "Active"}
              </span>
              ?
            </>
          }
          onConfirm={confirmStatusChangeAction}
          onCancel={() => setConfirmStatusChange(null)}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          message={
            <>
              Are you sure you want to delete coupon{" "}
              <span className="font-semibold text-orange-500">
                {confirmDelete.code}
              </span>
              ? This action cannot be undone.
            </>
          }
          onConfirm={confirmDeleteAction}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      <CouponFilters onPendingChange={setFilterPending} />

      <CouponTable
        coupons={coupons}
        meta={meta}
        isPending={isTableLoading}
        deletingCouponId={deletingCouponId}
        togglingCouponId={togglingCouponId}
        onToggleStatus={setConfirmStatusChange}
        onDelete={setConfirmDelete}
      />
    </>
  );
}
