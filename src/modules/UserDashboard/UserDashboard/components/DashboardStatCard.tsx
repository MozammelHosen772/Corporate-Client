import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface DashboardStatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  colorClass: string;
}

export function DashboardStatCard({
  title,
  value,
  icon: Icon,
  colorClass,
}: DashboardStatCardProps) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full",
            colorClass,
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
