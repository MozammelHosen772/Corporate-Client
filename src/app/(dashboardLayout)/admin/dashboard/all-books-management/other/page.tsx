import AdminOtherList from "@/modules/AdminDashboard/AdminBooksManagement/AdminOther/AdminPoemList";
import { AdminOtherTableSkeleton } from "@/modules/AdminDashboard/AdminBooksManagement/AdminOther/components/AdminOtherTableSkeleton";
import { OTHER_LIMIT } from "@/modules/AdminDashboard/AdminBooksManagement/AdminOther/constants/other.constants";
import { getAllOthers } from "@/services/book/other.service";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    publish?: string;
  }>;
};

async function OthersContent({
  page,
  search,
  publish,
}: {
  page: number;
  search?: string;
  publish?: string;
}) {
  const result = await getAllOthers(
    {
      page,
      limit: OTHER_LIMIT,
      search: search || undefined,
      isPublished:
        publish === "true" ? true : publish === "false" ? false : undefined,
    },
    { noStore: true },
  );

  return <AdminOtherList others={result.data} meta={result.meta} />;
}

export default async function AdminOthersPage({ searchParams }: Props) {
  const { page: pageStr, search, publish } = await searchParams;
  const page = Number(pageStr) || 1;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-slate-800">
          Other Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage all Others created on the platform
        </p>
      </div>

      <section id="others-table" aria-label="Others List">
        <Suspense fallback={<AdminOtherTableSkeleton />}>
          <OthersContent page={page} search={search} publish={publish} />
        </Suspense>
      </section>
    </div>
  );
}
