"use client";
import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS_CONFIG, OrderStatus } from "../constants/order.constants";

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = ORDER_STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`gap-1 text-[11px] font-medium ${config.className}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
