import AdminLyricsList from "@/modules/AdminDashboard/AdminBooksManagement/AdminLyrics/AdminLyricsList";
import { AdminLyricsTableSkeleton } from "@/modules/AdminDashboard/AdminBooksManagement/AdminLyrics/components/AdminLyricsTableSkeleton";
import { LYRICS_LIMIT } from "@/modules/AdminDashboard/AdminBooksManagement/AdminLyrics/constants/lyrics.constants";
import { getAllLyrics } from "@/services/book/lyrics.service";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    publish?: string;
  }>;
};

async function LyricssContent({
  page,
  search,
  publish,
}: {
  page: number;
  search?: string;
  publish?: string;
}) {
  const result = await getAllLyrics(
    {
      page,
      limit: LYRICS_LIMIT,
      search: search || undefined,
      isPublished:
        publish === "true" ? true : publish === "false" ? false : undefined,
    },
    { noStore: true },
  );

  return <AdminLyricsList lyricss={result.data} meta={result.meta} />;
}

export default async function AdminLyricssPage({ searchParams }: Props) {
  const { page: pageStr, search, publish } = await searchParams;
  const page = Number(pageStr) || 1;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-slate-800">
          Lyrics Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage all Lyricss created on the platform
        </p>
      </div>

      <section id="lyricss-table" aria-label="Lyricss List">
        <Suspense fallback={<AdminLyricsTableSkeleton />}>
          <LyricssContent page={page} search={search} publish={publish} />
        </Suspense>
      </section>
    </div>
  );
}
