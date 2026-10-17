import PublicBlogCategoryTabs from "@/modules/PublicBlog/components/PublicBlogCategoryTabs";
import PublicBlogPagination from "@/modules/PublicBlog/components/PublicBlogPagination";
import PublicBlogSearchBar from "@/modules/PublicBlog/components/PublicBlogSearchBar";
import { getPublishedBlogs } from "@/services/blog/blog.service";
import Image from "next/image";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    search?: string;
  }>;
}

export default async function BlogListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params.page ? Number(params.page) : 1;

  const { data: blogs, meta } = await getPublishedBlogs({
    page,
    category: params.category,
    search: params.search,
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-slate-800">Blog</h1>
        <p className="mt-2 text-slate-500">
          Tips, guides and updates from our team.
        </p>
      </div>

      <div className="mx-auto mb-6 max-w-xl">
        <PublicBlogSearchBar currentSearch={params.search} />
      </div>

      <PublicBlogCategoryTabs currentCategory={params.category} />

      {blogs.length === 0 ? (
        <div className="py-24 text-center text-slate-400">
          No blog posts found.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.slug}`}
              className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative h-44 w-full bg-slate-100">
                {blog.thumbnail ? (
                  <Image
                    src={blog.thumbnail}
                    alt={blog.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : null}
              </div>
              <div className="p-5">
                {blog.category && (
                  <span className="text-xs font-medium uppercase tracking-wide text-orange-500">
                    {blog.category}
                  </span>
                )}
                <h2 className="mt-1 line-clamp-2 text-lg font-semibold text-slate-800">
                  {blog.title}
                </h2>
                {blog.excerpt && (
                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                    {blog.excerpt}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      <PublicBlogPagination
        currentPage={meta.page}
        totalPages={meta.totalPages}
      />
    </main>
  );
}
