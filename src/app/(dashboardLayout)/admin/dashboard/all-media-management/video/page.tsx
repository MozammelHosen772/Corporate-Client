import AdminVideoList from "@/modules/AdminDashboard/AdminMediaManagement/AdminVideo/AdminVideoList";
import { getAllVideos } from "@/services/mediaContentManagement/video.service";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    publish?: string;
  }>;
}

export default async function AdminVideoPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params.page ? Number(params.page) : 1;
  const search = params.search;
  const isPublished =
    params.publish === "true"
      ? true
      : params.publish === "false"
        ? false
        : undefined;

  const { data, meta } = await getAllVideos({
    page,
    limit: 10,
    search,
    isPublished,
  });

  return (
    <div className="p-4 md:p-6">
      <h1 className="mb-4 text-xl font-semibold text-slate-800">
        Video Management
      </h1>
      <AdminVideoList videos={data} meta={meta} />
    </div>
  );
}
