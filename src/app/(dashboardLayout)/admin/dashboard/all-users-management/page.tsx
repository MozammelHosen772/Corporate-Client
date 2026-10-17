import AdminAllUserManage from "@/modules/AdminDashboard/AdminUserManagement/AllUserManage";
import { UserTableSkeleton } from "@/modules/AdminDashboard/AdminUserManagement/components/UserTableSkeleton";
import { USER_LIMIT } from "@/modules/AdminDashboard/AdminUserManagement/constants/adminUserManagement.constants";
import { fetchAllUsers } from "@/services/adminUserManagement/adminUserManagement.service";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    role?: string;
    status?: string;
  }>;
};

async function UsersContent({
  page,
  search,
  role,
  status,
}: {
  page: number;
  search?: string;
  role?: string;
  status?: string;
}) {
  const result = await fetchAllUsers({
    page,
    limit: USER_LIMIT,
    search: search || undefined,
    role: role || undefined,
    status: status || undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  return <AdminAllUserManage users={result.users} meta={result.meta} />;
}

export default async function AdminUsersPage({ searchParams }: Props) {
  const { page: pageStr, search, role, status } = await searchParams;
  const page = Number(pageStr) || 1;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-slate-800">
          User Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">Manage your users</p>
      </div>

      <section id="users-table" aria-label="Users List">
        <Suspense fallback={<UserTableSkeleton />}>
          <UsersContent
            page={page}
            search={search}
            role={role}
            status={status}
          />
        </Suspense>
      </section>
    </div>
  );
}
