import { DashboardStatsSkeleton } from "@/modules/UserDashboard/UserDashboard/components/DashboardStatsSkeleton";
import { UserDashboardStats } from "@/modules/UserDashboard/UserDashboard/UserDashboardStats";
import { Suspense } from "react";

export default function UserDashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your orders and repair bookings
        </p>
      </div>

      <Suspense fallback={<DashboardStatsSkeleton />}>
        <UserDashboardStats />
      </Suspense>
    </div>
  );
}
