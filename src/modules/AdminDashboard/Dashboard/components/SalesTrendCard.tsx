import { formatCurrency } from "@/lib/formatters";
import { TSalePeriod } from "@/types/AdminDashboard/adminDashboard.interface";
import { Calendar, CalendarDays, CalendarRange } from "lucide-react";

interface Props {
  daily: TSalePeriod;
  monthly: TSalePeriod;
  yearly: TSalePeriod;
}

export function SalesTrendCard({ daily, monthly, yearly }: Props) {
  const max = Math.max(daily.amount, monthly.amount, yearly.amount, 1);

  const rows = [
    { label: "Today", data: daily, icon: Calendar },
    { label: "This Month", data: monthly, icon: CalendarDays },
    { label: "This Year", data: yearly, icon: CalendarRange },
  ];

  return (
    <div className="rounded-2xl border border-[#E7E8EC] bg-white p-6">
      <h2 className="text-base font-semibold text-[#12141A]">Sales Trend</h2>
      <p className="mt-0.5 text-sm text-[#6B7280]">
        Daily, monthly, yearly revenue তুলনা
      </p>

      <div className="mt-6 space-y-5">
        {rows.map((row) => {
          const widthPct = Math.max(
            4,
            Math.round((row.data.amount / max) * 100),
          );
          return (
            <div key={row.label}>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-[#12141A]">
                  <row.icon className="h-3.5 w-3.5 text-[#6B7280]" />
                  {row.label}
                </span>
                <span className="font-mono text-[#12141A]">
                  {formatCurrency(row.data.amount)}
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#F3F4F7]">
                <div
                  className="h-full rounded-full bg-[#C9972E] transition-[width] duration-700 ease-out"
                  style={{ width: `${widthPct}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-[#6B7280]">
                {row.data.count} orders
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
