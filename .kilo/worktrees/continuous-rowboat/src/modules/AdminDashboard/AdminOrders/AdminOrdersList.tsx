"use client";

import { clientActionErrorModal } from "@/lib/clientActionErrorModal";
import { useCallback, useState, useTransition } from "react";
import { toast } from "sonner";
import { OrderStatus } from "./constants/order.constants";

import {
  deleteOrder,
  TOrder,
  updateOrderStatus,
  updatePaymentStatus,
} from "@/services/orders/orders.service";
import OrderFilters from "./components/OrderFilters";
import OrderStatusModal from "./components/OrderStatusModal";

import OrderConfirmModal from "./components/Orderconfirmmodal";
import OrderDetailModal from "./components/Orderdetailmodal";
import OrderTable from "./components/OrderTable";
import PaymentDetailModal from "./components/PaymentDetailModal";

export interface IOrderMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Props {
  orders: TOrder[];
  meta: IOrderMeta;
}

export default function AdminOrdersList({ orders, meta }: Props) {
  const [isPending, startTransition] = useTransition();
  const [filterPending, setFilterPending] = useState(false);

  const isTableLoading = isPending || filterPending;

  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);

  const [viewTarget, setViewTarget] = useState<TOrder | null>(null);
  const [statusTarget, setStatusTarget] = useState<TOrder | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TOrder | null>(null);

  const [paymentViewTarget, setPaymentViewTarget] = useState<TOrder | null>(
    null,
  );

  const handleFilterPending = useCallback((pending: boolean) => {
    setFilterPending(pending);
  }, []);

  // ─── Status ────────────────────────────────────────────────────────────────

  const confirmStatusUpdate = (newStatus: OrderStatus) => {
    if (!statusTarget) return;
    const order = statusTarget;
    setStatusTarget(null);

    startTransition(async () => {
      try {
        await updateOrderStatus(order.id, newStatus);
        toast.success(`Status updated to "${newStatus.toLowerCase()}"`);
      } catch (error) {
        if (clientActionErrorModal(error)) return;
        toast.error(
          error instanceof Error ? error.message : "Failed to update status",
        );
      }
    });
  };

  // ─── Payment — এখন সরাসরি action, আলাদা confirm modal নেই ──────────────────

  const handlePaymentDecision = (
    order: TOrder,
    decision: "PAID" | "FAILED",
  ) => {
    setPaymentViewTarget(null);

    startTransition(async () => {
      try {
        await updatePaymentStatus(order.id, decision);
        toast.success(
          decision === "PAID" ? "Payment accepted" : "Payment rejected",
        );
      } catch (error) {
        if (clientActionErrorModal(error)) return;
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to update payment status",
        );
      }
    });
  };

  // ─── Delete ────────────────────────────────────────────────────────────────

  const confirmDeleteAction = () => {
    if (!deleteTarget) return;
    const order = deleteTarget;
    setDeleteTarget(null);
    setDeletingOrderId(order.id);

    startTransition(async () => {
      try {
        await deleteOrder(order.id);
        toast.success("Order deleted successfully");
      } catch (error) {
        if (clientActionErrorModal(error)) return;
        toast.error(
          error instanceof Error ? error.message : "Failed to delete order",
        );
      } finally {
        setDeletingOrderId(null);
      }
    });
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {viewTarget && (
        <OrderDetailModal
          order={viewTarget}
          onClose={() => setViewTarget(null)}
        />
      )}

      {statusTarget && (
        <OrderStatusModal
          order={statusTarget}
          onConfirm={confirmStatusUpdate}
          onCancel={() => setStatusTarget(null)}
        />
      )}

      {deleteTarget && (
        <OrderConfirmModal
          message={
            <>
              Are you sure you want to delete the order from{" "}
              <span className="font-semibold text-orange-500">
                {deleteTarget.customerName}
              </span>
              ? This action cannot be undone.
            </>
          }
          confirmLabel="Delete"
          confirmVariant="destructive"
          onConfirm={confirmDeleteAction}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {paymentViewTarget && (
        <PaymentDetailModal
          order={paymentViewTarget}
          onClose={() => setPaymentViewTarget(null)}
          onAccept={(order) => handlePaymentDecision(order, "PAID")}
          onReject={(order) => handlePaymentDecision(order, "FAILED")}
        />
      )}

      <OrderFilters onPendingChange={handleFilterPending} />

      <OrderTable
        orders={orders}
        meta={meta}
        isPending={isTableLoading}
        deletingOrderId={deletingOrderId}
        onView={setViewTarget}
        onStatusChange={setStatusTarget}
        onDelete={setDeleteTarget}
        onViewPayment={setPaymentViewTarget}
      />
    </>
  );
}
