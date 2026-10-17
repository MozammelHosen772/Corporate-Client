import { TAdminDashboardStats } from "@/types/AdminDashboard/adminDashboard.interface";
import { Package, ShieldCheck, Tag, Users, Zap } from "lucide-react";
import { StatCard } from "./StatCard";

interface Props {
  stats: TAdminDashboardStats;
}

export function StatsGrid({ stats }: Props) {
  const items = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      accent: "info" as const,
    },
    {
      label: "Moderator",
      value: stats.totalModerators,
      icon: ShieldCheck,
      accent: "info" as const,
    },
    {
      label: "Active Products",
      value: stats.totalActiveProducts,
      icon: Package,
      accent: "gold" as const,
    },
    {
      label: "Offer Products",
      value: stats.totalOfferProducts,
      icon: Tag,
      accent: "gold" as const,
    },
    {
      label: "Flash Sale Products",
      value: stats.totalFlashSaleProducts,
      icon: Zap,
      accent: "gold" as const,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {items.map((item) => (
        <StatCard key={item.label} {...item} />
      ))}
    </div>
  );
}
