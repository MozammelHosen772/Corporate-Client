import { TAdminDashboardStats } from "@/types/AdminDashboard/adminDashboard.interface";
import { OrderStatusCard } from "./components/OrderStatusCard";
import { RevenueHeroCard } from "./components/RevenueHeroCard";
import { SalesChart } from "./components/SalesChart";
import { SalesTrendCard } from "./components/SalesTrendCard";
import { StatsGrid } from "./components/StatsGrid";

interface Props {
  stats: TAdminDashboardStats;
}

export default function AdminDashboardOverview({ stats }: Props) {
  return (
    <div className="space-y-4">
      <RevenueHeroCard
        totalSaleAmount={stats.totalSaleAmount}
        totalSaleCount={stats.totalSaleCount}
      />

      <StatsGrid stats={stats} />

      <SalesChart trend={stats.salesTrend ?? { daily: [], monthly: [] }} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SalesTrendCard
          daily={stats.dailySale}
          monthly={stats.monthlySale}
          yearly={stats.yearlySale}
        />
        <OrderStatusCard
          statusCounts={stats.statusCounts}
          totalDelivered={stats.totalDeliveredOrders}
          totalCancelled={stats.totalCancelledOrders}
        />
      </div>
    </div>
  );
}
