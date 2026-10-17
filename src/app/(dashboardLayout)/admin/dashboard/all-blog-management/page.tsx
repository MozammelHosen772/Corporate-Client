import AdminBlogList from "@/modules/AdminDashboard/AdminBlog/AdminBlogList";
import { getAllBlogs } from "@/services/blog/blog.service";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
    category?: string;
    search?: string;
  }>;
}

export default async function AllBlogManagementPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  const { data: blogs, meta } = await getAllBlogs({
    page: params.page ? Number(params.page) : undefined,
    status: params.status,
    category: params.category,
    search: params.search,
  });

  return (
    <main>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-800 md:text-2xl">
          Blog Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Create, edit, publish and manage all blog posts.
        </p>
      </div>

      <AdminBlogList blogs={blogs} meta={meta} />
    </main>
  );
}
