"use client";
import { Badge } from "@/components/ui/badge";
import {
  PAYMENT_STATUS_CONFIG,
  PaymentStatus,
} from "../constants/order.constants";

export default function PaymentStatusBadge({
  status,
}: {
  status: PaymentStatus;
}) {
  const config = PAYMENT_STATUS_CONFIG[status];

  return (
    <Badge
      variant="outline"
      className={`gap-1.5 text-[11px] font-medium ${config.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dotClassName}`} />
      {config.label}
    </Badge>
  );
}
