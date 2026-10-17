import { formatNumber } from "@/lib/formatters";
import { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: number;
  icon: LucideIcon;
  accent?: "gold" | "info" | "success" | "danger";
}

const accentMap = {
  gold: "text-[#C9972E] bg-[#C9972E]/10",
  info: "text-[#5B63D3] bg-[#5B63D3]/10",
  success: "text-[#1F9D6C] bg-[#1F9D6C]/10",
  danger: "text-[#D6465F] bg-[#D6465F]/10",
};

export function StatCard({ label, value, icon: Icon, accent = "info" }: Props) {
  return (
    <div className="rounded-2xl border border-[#E7E8EC] bg-white p-5 transition-shadow hover:shadow-sm">
      <div
        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${accentMap[accent]}`}
      >
        <Icon className="h-4.5 w-4.5" />
      </div>
      <p className="mt-4 font-mono text-2xl font-medium text-[#12141A]">
        {formatNumber(value)}
      </p>
      <p className="mt-1 text-sm text-[#6B7280]">{label}</p>
    </div>
  );
}
