import { getUserDashboardStats } from "@/services/dashboard/dashboard.service";
import {
  CheckCircle2,
  Clock,
  ListTodo,
  Package,
  ShoppingBag,
} from "lucide-react";
import { DashboardStatCard } from "./components/DashboardStatCard";

export async function UserDashboardStats() {
  const stats = await getUserDashboardStats();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
      <DashboardStatCard
        title="Pending Repairs"
        value={stats.repairBookings.pending}
        icon={ListTodo}
        colorClass="bg-yellow-100 text-yellow-600"
      />
      <DashboardStatCard
        title="Accepted Repairs"
        value={stats.repairBookings.accepted}
        icon={Clock}
        colorClass="bg-blue-100 text-blue-600"
      />
      <DashboardStatCard
        title="Completed Repairs"
        value={stats.repairBookings.completed}
        icon={CheckCircle2}
        colorClass="bg-green-100 text-green-600"
      />
      <DashboardStatCard
        title="Total Orders"
        value={stats.orders.total}
        icon={Package}
        colorClass="bg-purple-100 text-purple-600"
      />
      <DashboardStatCard
        title="Pending Orders"
        value={stats.orders.pending}
        icon={ListTodo}
        colorClass="bg-orange-100 text-orange-600"
      />
      <DashboardStatCard
        title="Products Ordered"
        value={stats.orders.totalProductsOrdered}
        icon={ShoppingBag}
        colorClass="bg-pink-100 text-pink-600"
      />
    </div>
  );
}
