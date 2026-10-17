"use client";

import { Badge } from "@/components/ui/badge";
import { clientActionErrorModal } from "@/lib/clientActionErrorModal";

import {
  deletePaymentMethod,
  getAllPaymentMethods,
  TPaymentMethod,
} from "@/services/paymentMethod/paymentmethods.service";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import DeleteConfirmModal from "./components/Deleteconfirmmodal";
import PaymentMethodForm from "./components/Paymentmethodform";
import PaymentMethodTable from "./components/Paymentmethodtable";

type Props = {
  initialPaymentMethods: TPaymentMethod[];
};

export default function AdminPaymentMethod({ initialPaymentMethods }: Props) {
  const [paymentMethods, setPaymentMethods] = useState<TPaymentMethod[]>(
    initialPaymentMethods,
  );
  const [refreshing, setRefreshing] = useState(false); // initial load নেই, শুধু re-fetch

  const [confirmDelete, setConfirmDelete] = useState<TPaymentMethod | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);

  // ─── Single reusable refresh (useEffect নেই, duplicate নেই) ──────────────

  const refreshPaymentMethods = useCallback(async () => {
    try {
      setRefreshing(true);
      const { data } = await getAllPaymentMethods();
      setPaymentMethods(data);
    } catch (error) {
      if (clientActionErrorModal(error)) return;
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to fetch payment methods",
      );
    } finally {
      setRefreshing(false);
    }
  }, []);

  // ─── Delete ───────────────────────────────────────────────────────────────

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    const method = confirmDelete;
    setDeleting(true);
    const toastId = toast.loading(`Deleting "${method.provider}"...`);
    try {
      await deletePaymentMethod(method.id);
      toast.success(`"${method.provider}" deleted successfully`, {
        id: toastId,
      });
      setConfirmDelete(null);
      await refreshPaymentMethods();
    } catch (error) {
      if (clientActionErrorModal(error)) return;
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete payment method",
        { id: toastId },
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {confirmDelete && (
        <DeleteConfirmModal
          method={confirmDelete}
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
              Payment Method Management
            </h2>
            <p className="text-sm text-muted-foreground">
              Add or manage payout accounts (Mobile Wallet / Bank)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="gap-1.5 border-slate-200 bg-slate-50 text-slate-600"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              {paymentMethods.filter((m) => m.isActive).length} active
            </Badge>
            <Badge
              variant="outline"
              className="border-slate-200 bg-slate-50 text-slate-400"
            >
              {paymentMethods.length} total
            </Badge>
          </div>
        </div>

        <div className="mx-auto max-w-2xl">
          <PaymentMethodForm onSuccess={refreshPaymentMethods} />
        </div>

        <PaymentMethodTable
          paymentMethods={paymentMethods}
          fetching={refreshing}
          onDelete={setConfirmDelete}
        />
      </div>
    </>
  );
}
