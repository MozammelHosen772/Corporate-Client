import AdminblogsList from "@/modules/ManageBlog/adminblogslist";
import { getAllBlogs } from "@/services/blog/blog.service";

interface PageProps {
  searchParams: Promise<{ page?: string; status?: string; search?: string }>;
}

export default async function AllBlogManagementPage({
  searchParams,
}: PageProps) {
  const { page, status, search } = await searchParams;

  const { data: blogs, meta } = await getAllBlogs({
    page: page ? Number(page) : 1,
    status,
    search,
  });

  return (
    <main>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-800 md:text-2xl">
          Blog Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {meta.total} post{meta.total !== 1 && "s"} total
        </p>
      </div>

      <AdminblogsList blogs={blogs} meta={meta} />
    </main>
  );
}
