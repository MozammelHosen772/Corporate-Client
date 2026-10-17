import { formatNumber } from "@/lib/formatters";
import { TOrderStatusCounts } from "@/types/AdminDashboard/adminDashboard.interface";
import { CheckCircle2, XCircle } from "lucide-react";

interface Props {
  statusCounts: TOrderStatusCounts;
  totalDelivered: number;
  totalCancelled: number;
}

const STATUS_META: Record<
  keyof TOrderStatusCounts,
  { label: string; color: string }
> = {
  PENDING: { label: "Pending", color: "#F0B429" },
  CONFIRMED: { label: "Confirmed", color: "#5B63D3" },
  PROCESSING: { label: "Processing", color: "#8B5CF6" },
  SHIPPED: { label: "Shipped", color: "#0EA5E9" },
  DELIVERED: { label: "Delivered", color: "#1F9D6C" },
  CANCELLED: { label: "Cancelled", color: "#D6465F" },
};

export function OrderStatusCard({
  statusCounts,
  totalDelivered,
  totalCancelled,
}: Props) {
  const total = Object.values(statusCounts).reduce((a, b) => a + b, 0) || 1;
  const keys = Object.keys(statusCounts) as Array<keyof TOrderStatusCounts>;

  return (
    <div className="rounded-2xl border border-[#E7E8EC] bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#12141A]">Order Status</h2>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5 text-[#1F9D6C]">
            <CheckCircle2 className="h-4 w-4" /> {formatNumber(totalDelivered)}
          </span>
          <span className="flex items-center gap-1.5 text-[#D6465F]">
            <XCircle className="h-4 w-4" /> {formatNumber(totalCancelled)}
          </span>
        </div>
      </div>

      <div className="mt-5 flex h-3 w-full overflow-hidden rounded-full bg-[#F3F4F7]">
        {keys.map((key) => {
          const pct = (statusCounts[key] / total) * 100;
          if (pct <= 0) return null;
          return (
            <div
              key={key}
              style={{
                width: `${pct}%`,
                backgroundColor: STATUS_META[key].color,
              }}
              className="h-full first:rounded-l-full last:rounded-r-full"
            />
          );
        })}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {keys.map((key) => (
          <div key={key} className="flex items-center gap-2 text-sm">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: STATUS_META[key].color }}
            />
            <span className="text-[#6B7280]">{STATUS_META[key].label}</span>
            <span className="ml-auto font-mono text-[#12141A]">
              {formatNumber(statusCounts[key])}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
