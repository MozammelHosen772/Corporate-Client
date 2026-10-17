import BlogPublicPagination from "@/modules/ManageBlog/components/BlogPublicPagination";
import { getPublishedBlogs } from "@/services/blog/blog.service";
import { FileQuestion } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

// ─── SEO Metadata ─────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Blog | FixIt Repair — Mobile, Laptop & Desktop Repair Guides",
  description:
    "Repair guides, diagnostics, and field notes from FixIt technicians. Mobile, laptop & desktop repair tips plus charger and cable buying guides.",
  alternates: { canonical: "https://yourdomain.com/blog" },
  openGraph: {
    title: "Blog | FixIt Repair",
    description:
      "Repair guides, diagnostics, and field notes from FixIt technicians.",
    url: "https://yourdomain.com/blog",
    type: "website",
    siteName: "FixIt Repair",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | FixIt Repair",
    description:
      "Repair guides, diagnostics, and field notes from FixIt technicians.",
  },
  robots: { index: true, follow: true },
};

// ─── Page Props ───────────────────────────────────────────────────────────────

interface PageProps {
  searchParams: Promise<{ page?: string; category?: string; search?: string }>;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogListPage({ searchParams }: PageProps) {
  const { page, category, search } = await searchParams;

  const { data: blogs, meta } = await getPublishedBlogs({
    page: page ? Number(page) : 1,
    category,
    search,
  });

  // ✅ JSON-LD structured data — full absolute URLs for SEO crawlers
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "FixIt Repair Blog",
    url: "https://yourdomain.com/blog",
    blogPost: blogs.map((blog) => ({
      "@type": "BlogPosting",
      headline: blog.title,
      url: `https://yourdomain.com/blog/${blog.slug}`,
      datePublished: blog.publishedAt ?? undefined,
      ...(blog.thumbnail ? { image: blog.thumbnail } : {}),
    })),
  };

  return (
    <main className="bg-white text-slate-900">
      {/* ── JSON-LD ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ── */}
      <header className="mx-auto max-w-[1200px] px-4 pb-10 pt-16 text-center sm:px-6">
        <h1 className="text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-4xl lg:text-[42px]">
          <span className="text-orange-500">Apple</span> And{" "}
          <span className="text-orange-500">Android</span> Repair
          <br className="hidden sm:block" /> And Servicing Blog In Bangladesh
        </h1>
      </header>

      {/* ── Blog List ── */}
      <div className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-6">
        {blogs.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 py-24 text-center">
            <FileQuestion className="mb-2 h-8 w-8 text-slate-400" aria-hidden />
            <p className="text-lg font-bold text-slate-700">No blogs found</p>
            <p className="mt-1 text-xs text-slate-400">
              Try a different search
            </p>
          </div>
        ) : (
          <ul className="mt-10 grid list-none grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog, i) => (
              <li key={blog.id}>
                <Link
                  href={`/blog/${blog.slug}`}
                  className="group block h-full"
                >
                  <article className="flex h-full flex-col">
                    {/* ── Thumbnail ── */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100">
                      {blog.thumbnail ? (
                        <Image
                          src={blog.thumbnail}
                          alt={blog.title}
                          fill
                          priority={i < 3}
                          loading={i < 3 ? "eager" : "lazy"}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div
                          aria-hidden
                          className="flex h-full items-center justify-center text-xs text-slate-400"
                        >
                          No image
                        </div>
                      )}
                    </div>

                    {/* ── Content ── */}
                    <h2 className="mt-4 line-clamp-2 text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-orange-500">
                      {blog.title}
                    </h2>

                    {blog.excerpt && (
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
                        {blog.excerpt}
                      </p>
                    )}
                  </article>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <BlogPublicPagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
        />
      </div>
    </main>
  );
}
