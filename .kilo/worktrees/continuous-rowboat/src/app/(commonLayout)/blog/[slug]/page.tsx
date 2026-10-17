import ShareButtons from "@/modules/ManageBlog/components/Sharebuttons";
import { getBlogBySlug, getPublishedBlogs } from "@/services/blog/blog.service";
import { ArrowLeft, Clock, Eye } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, "");
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr)
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    })
    .toUpperCase();
}

const SITE_URL = "https://yourdomain.com"; // ← actual domain বসাও

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return { title: "Blog Not Found" };

  const title = blog.metaTitle || blog.title;
  const description = blog.metaDescription || blog.excerpt || "";
  const url = `${SITE_URL}/blog/${blog.slug}`;

  return {
    title: `${title} | FixIt Blog`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: "FixIt Repair",
      publishedTime: blog.publishedAt ?? undefined,
      ...(blog.thumbnail
        ? {
            images: [
              {
                url: blog.thumbnail,
                width: 1200,
                height: 630,
                alt: blog.title,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(blog.thumbnail ? { images: [blog.thumbnail] } : {}),
    },
  };
}

// ─── Share Button ─────────────────────────────────────────────────────────────
// Server component — share via href (no JS needed for basic share)

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) notFound();

  const minutes = readingTime(blog.content);
  const pageUrl = `${SITE_URL}/blog/${blog.slug}`;

  const { data: related } = await getPublishedBlogs({
    category: blog.category ?? undefined,
    limit: 4,
  });
  const relatedBlogs = related.filter((b) => b.id !== blog.id).slice(0, 3);

  // ✅ JSON-LD — full BlogPosting schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt ?? undefined,
    ...(blog.thumbnail ? { image: blog.thumbnail } : {}),
    datePublished: blog.publishedAt ?? undefined,
    dateModified: blog.updatedAt,
    url: pageUrl,
    author: { "@type": "Organization", name: "FixIt", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "FixIt Repair",
      url: SITE_URL,
    },
    ...(blog.tags?.length > 0 ? { keywords: blog.tags.join(", ") } : {}),
  };

  return (
    <main className="bg-[#ffffff] text-[#14181C]">
      {/* ── JSON-LD ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-[1400px] px-2  py-5">
        {/* ── Back ── */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#5B6B73] transition-colors hover:text-[#C9742C]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All articles
        </Link>

        {/* ── Meta strip ── */}
        <div className="mt-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-[#5B6B73]">
          <span className="text-[#C9742C]">{blog.category ?? "General"}</span>
          <span className="h-px flex-1 bg-[#14181C]/10" aria-hidden />
          <span>#{String(blog.id).padStart(3, "0")}</span>
        </div>

        {/* ── Title ── */}
        <h1 className="mt-4 text-base font-semibold leading-[1.1] tracking-tight ">
          {blog.title}
        </h1>

        {/* ── By-line ── */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 font-mono text-xs text-[#5B6B73]">
            {blog.publishedAt && (
              <time dateTime={blog.publishedAt}>
                {formatDate(blog.publishedAt)}
              </time>
            )}
            <span aria-hidden>·</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" aria-hidden />
              {minutes} min read
            </span>
            <span aria-hidden>·</span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" aria-hidden />
              {blog.views.toLocaleString()} reads
            </span>
          </div>

          {/* ── Share ── */}
          <ShareButtons url={pageUrl} title={blog.title} />
        </div>

        {blog.thumbnail && (
          <div className="relative mt-8 w-full flex justify-center overflow-hidden rounded-sm bg-muted">
            <Image
              src={blog.thumbnail}
              alt={blog.title}
              width={1200}
              height={675}
              priority
              sizes="(max-width: 768px) 100vw, 800px"
              className="h-auto w-full max-h-[440px] object-contain"
            />
          </div>
        )}
        {/* ── Excerpt ── */}
        {blog.excerpt && (
          <p className="mt-8 border-l-2 border-[#C9742C] pl-4 text-[15px] leading-relaxed text-[#5B6B73] italic">
            {blog.excerpt}
          </p>
        )}

        {/* ── Content ── */}
        <article
          className="prose prose-neutral mt-10 max-w-none
            prose-headings:font-semibold prose-headings:tracking-tight
            prose-p:leading-relaxed prose-p:text-[#33393D]
            prose-a:text-[#C9742C] prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-sm prose-img:shadow-sm
            prose-strong:text-[#14181C]
            prose-blockquote:border-[#C9742C] prose-blockquote:text-[#5B6B73]
            prose-code:rounded prose-code:bg-[#14181C]/5 prose-code:px-1 prose-code:text-[#C9742C]"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* ── Tags ── */}
        {blog.tags?.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-x-4 gap-y-2 border-t border-[#14181C]/10 pt-6 font-mono text-xs uppercase tracking-wider">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-sm border border-[#14181C]/15 px-2 py-0.5 text-[#5B6B73] transition-colors hover:border-[#C9742C] hover:text-[#C9742C]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* ── Bottom share ── */}
        <div className="mt-8 flex items-center gap-3 border-t border-[#14181C]/10 pt-6">
          <span className="flex-1 font-mono text-xs uppercase tracking-wider text-[#5B6B73]">
            Found this helpful? Share it.
          </span>
          <ShareButtons url={pageUrl} title={blog.title} />
        </div>
      </div>

      {/* ── Related ── */}
      {relatedBlogs.length > 0 && (
        <section
          aria-label="Related articles"
          className="border-t border-[#14181C]/10"
        >
          <div className="mx-auto max-w-2xl px-6 py-14">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#C9742C]">
              Continue reading
            </p>
            <div className="mt-6 divide-y divide-[#14181C]/10">
              {relatedBlogs.map((rb) => (
                <Link
                  key={rb.id}
                  href={`/blog/${rb.slug}`}
                  className="group flex items-center justify-between gap-4 py-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {rb.thumbnail && (
                      <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-sm bg-[#14181C]/5">
                        <Image
                          src={rb.thumbnail}
                          alt={rb.title}
                          fill
                          sizes="64px"
                          className="object-cover grayscale transition-all group-hover:grayscale-0"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-base font-medium leading-snug transition-colors group-hover:text-[#C9742C]">
                        {rb.title}
                      </p>
                      {rb.publishedAt && (
                        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-[#5B6B73]">
                          {formatDate(rb.publishedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                  <ArrowLeft
                    className="h-4 w-4 shrink-0 rotate-180 text-[#5B6B73] transition-transform group-hover:translate-x-1 group-hover:text-[#C9742C]"
                    aria-hidden
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
