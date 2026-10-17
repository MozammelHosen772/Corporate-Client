"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TOrder } from "@/services/orders/orders.service";
import { Check, Copy, X } from "lucide-react";
import { toast } from "sonner";
import PaymentStatusBadge from "./PaymentStatusBadge";

interface Props {
  order: TOrder;
  onClose: () => void;
  onAccept: (order: TOrder) => void;
  onReject: (order: TOrder) => void;
}

export default function PaymentDetailModal({
  order,
  onClose,
  onAccept,
  onReject,
}: Props) {
  const isPending = order.paymentStatus === "PENDING";
  const isManual = order.paymentType === "manual";

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Payment Details
            <PaymentStatusBadge status={order.paymentStatus} />
          </DialogTitle>
          <DialogDescription>
            Order <span className="font-mono">#{order.orderNumber}</span> —{" "}
            {order.customerName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <Row label="Payment Type">
            <Badge variant="outline" className="text-xs">
              {isManual ? order.provider || "Manual" : "Cash on Delivery"}
            </Badge>
          </Row>

          <Row label="Amount">
            <span className="text-sm font-semibold">
              ৳{order.total.toLocaleString()}
            </span>
          </Row>

          {isManual && (
            <>
              <CopyRow
                label="Received On"
                value={order.receivingAccountNumber}
                onCopy={copy}
              />
              <CopyRow
                label="Sender Number"
                value={order.senderNumber}
                onCopy={copy}
              />
              <CopyRow
                label="Transaction ID"
                value={order.transactionId}
                onCopy={copy}
              />
            </>
          )}
        </div>

        {isManual && isPending && (
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50 py-2"
              onClick={() => onReject(order)}
            >
              <X className="mr-1.5 h-4 w-4" />
              Reject Payment
            </Button>
            <Button
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 py-2"
              onClick={() => onAccept(order)}
            >
              <Check className="mr-1.5 h-4 w-4" />
              Accept Payment
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-500">{label}</span>
      {children}
    </div>
  );
}

function CopyRow({
  label,
  value,
  onCopy,
}: {
  label: string;
  value: string | null;
  onCopy: (text: string, label: string) => void;
}) {
  return (
    <div className="space-y-1">
      <span className="text-xs text-slate-500">{label}</span>
      <div className="flex items-center justify-between gap-2 rounded-md border border-input bg-gray-50 px-3 h-10">
        <span className="text-sm font-mono font-semibold truncate">
          {value || "-"}
        </span>
        {value && (
          <button
            type="button"
            onClick={() => onCopy(value, label)}
            className="flex items-center gap-1 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 active:bg-teal-200 px-2 py-1.5 rounded transition-colors shrink-0"
          >
            <Copy className="w-3 h-3" />
            Copy
          </button>
        )}
      </div>
    </div>
  );
}
