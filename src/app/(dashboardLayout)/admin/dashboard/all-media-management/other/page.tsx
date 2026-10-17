import AdminOtherList from "@/modules/AdminDashboard/AdminMediaManagement/AdminOther/AdminOtherList";
import { getAllOtherMedia } from "@/services/mediaContentManagement/other.service";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    publish?: string;
  }>;
}

export default async function AdminOtherPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const page = params.page ? Number(params.page) : 1;
  const search = params.search;

  const isPublished =
    params.publish === "true"
      ? true
      : params.publish === "false"
        ? false
        : undefined;

  const { data, meta } = await getAllOtherMedia({
    page,
    limit: 10,
    search,
    isPublished,
  });

  return (
    <div className="p-4 md:p-6">
      <h1 className="mb-4 text-xl font-semibold text-slate-800">
        Other Media Management
      </h1>

      <AdminOtherList items={data} meta={meta} />
    </div>
  );
}
