import AdminDashboardOverview from "@/modules/AdminDashboard/Dashboard/AdminDashboardOverview";
import { DashboardSkeleton } from "@/modules/AdminDashboard/Dashboard/components/DashboardSkeleton";
import { getAdminDashboardStats } from "@/services/adminDashboard/adminDashboard.service";
import { Suspense } from "react";

async function DashboardContent() {
  const stats = await getAdminDashboardStats();

  return <AdminDashboardOverview stats={stats} />;
}

export default function AdminDashboardPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-slate-800">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Store এর overall performance এক নজরে
        </p>
      </div>

      <section id="dashboard-overview" aria-label="Dashboard Overview">
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent />
        </Suspense>
      </section>
    </div>
  );
}
