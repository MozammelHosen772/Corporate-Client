import AdminMusicList from "@/modules/AdminDashboard/AdminMediaManagement/AdminMusic/AdminMusicList";
import { getAllMusic } from "@/services/mediaContentManagement/music.service";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    publish?: string;
  }>;
}

export default async function AdminMusicPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const page = params.page ? Number(params.page) : 1;
  const search = params.search;

  const isPublished =
    params.publish === "true"
      ? true
      : params.publish === "false"
        ? false
        : undefined;

  const { data, meta } = await getAllMusic({
    page,
    limit: 10,
    search,
    isPublished,
  });

  return (
    <div className="p-4 md:p-6">
      <h1 className="mb-4 text-xl font-semibold text-slate-800">
        Music Management
      </h1>

      <AdminMusicList items={data} meta={meta} />
    </div>
  );
}
