import AdminAllNovelManage from "@/modules/AdminDashboard/AdminBooksManagement/AdminNovel/AllNovelManage";
import { NovelTableSkeleton } from "@/modules/AdminDashboard/AdminBooksManagement/AdminNovel/components/NovelTableSkeleton";

import { NOVEL_LIMIT } from "@/modules/AdminDashboard/AdminBooksManagement/AdminNovel/constants/novel.constants";
import { getAllNovels } from "@/services/book/novel.service";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    publish?: string;
  }>;
};

async function NovelsContent({
  page,
  search,
  publish,
}: {
  page: number;
  search?: string;
  publish?: string;
}) {
  const result = await getAllNovels(
    {
      page,
      limit: NOVEL_LIMIT,
      search: search || undefined,
      isPublished:
        publish === "true" ? true : publish === "false" ? false : undefined,
    },
    { noStore: true },
  );

  return <AdminAllNovelManage novels={result.data} meta={result.meta} />;
}

export default async function AdminNovelsPage({ searchParams }: Props) {
  const { page: pageStr, search, publish } = await searchParams;
  const page = Number(pageStr) || 1;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-slate-800">
          Novel Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage all novels created on the platform
        </p>
      </div>

      <section id="novels-table" aria-label="Novels List">
        <Suspense fallback={<NovelTableSkeleton />}>
          <NovelsContent page={page} search={search} publish={publish} />
        </Suspense>
      </section>
    </div>
  );
}
