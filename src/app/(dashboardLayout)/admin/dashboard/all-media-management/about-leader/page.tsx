import AdminAboutLeaderList from "@/modules/AdminDashboard/AdminMediaManagement/AdminAboutLeader/AdminAboutLeaderList";
import { getAllAboutLeaders } from "@/services/mediaContentManagement/aboutLeader.service";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    publish?: string;
  }>;
}

export default async function AdminAboutLeaderage({ searchParams }: PageProps) {
  const params = await searchParams;

  const page = params.page ? Number(params.page) : 1;
  const search = params.search;

  const isPublished =
    params.publish === "true"
      ? true
      : params.publish === "false"
        ? false
        : undefined;

  const { data, meta } = await getAllAboutLeaders({
    page,
    limit: 10,
    search,
    isPublished,
  });

  return (
    <div className="p-4 md:p-6">
      <h1 className="mb-4 text-xl font-semibold text-slate-800">
        AI Explore Management
      </h1>

      <AdminAboutLeaderList items={data} meta={meta} />
    </div>
  );
}
