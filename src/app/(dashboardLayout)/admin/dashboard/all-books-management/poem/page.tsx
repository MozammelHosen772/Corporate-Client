import AdminPoemList from "@/modules/AdminDashboard/AdminBooksManagement/AdminPoem/AdminPoemList";
import { AdminPoemTableSkeleton } from "@/modules/AdminDashboard/AdminBooksManagement/AdminPoem/components/AdminPoemTableSkeleton";
import { POEM_LIMIT } from "@/modules/AdminDashboard/AdminBooksManagement/AdminPoem/constants/poem.constants";
import { getAllPoems } from "@/services/book/poem.service";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    publish?: string;
  }>;
};

async function PoemsContent({
  page,
  search,
  publish,
}: {
  page: number;
  search?: string;
  publish?: string;
}) {
  const result = await getAllPoems(
    {
      page,
      limit: POEM_LIMIT,
      search: search || undefined,
      isPublished:
        publish === "true" ? true : publish === "false" ? false : undefined,
    },
    { noStore: true },
  );

  return <AdminPoemList poems={result.data} meta={result.meta} />;
}

export default async function AdminPoemsPage({ searchParams }: Props) {
  const { page: pageStr, search, publish } = await searchParams;
  const page = Number(pageStr) || 1;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-slate-800">
          Poem Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage all Poems created on the platform
        </p>
      </div>

      <section id="poems-table" aria-label="Poems List">
        <Suspense fallback={<AdminPoemTableSkeleton />}>
          <PoemsContent page={page} search={search} publish={publish} />
        </Suspense>
      </section>
    </div>
  );
}
