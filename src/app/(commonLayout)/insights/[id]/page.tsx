import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getPublicIdeaBrighterById } from "@/services/mediaContentManagement/ideaBrighter.service";
import TiptapRenderer from "@/shared/tiptapEditor/TiptapRenderer";

interface PageProps {
  params: Promise<{ id: string }>;
}

const stripHtml = (html?: string | null) =>
  (html ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

async function loadItem(id: string) {
  try {
    const item = await getPublicIdeaBrighterById(id);
    // Draft hole public a dekhabo na
    if (!item || !item.isPublished) return null;
    return item;
  } catch (error) {
    console.error("[InsightDetails] failed to load item:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const item = await loadItem(id);
  if (!item) return { title: "Insight not found" };

  return {
    title: item.title?.trim() || "Insight",
    description: stripHtml(item.description).slice(0, 160),
    openGraph: item.imageUrl ? { images: [item.imageUrl] } : undefined,
  };
}

export default async function InsightDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const item = await loadItem(id);

  if (!item) notFound();

  const title = item.title?.trim() || "Untitled";
  const image = item.imageUrl?.trim();
  const date = new Date(item.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0c0a08] to-[#12100c] pb-20 pt-28 text-[#d8d2c8] sm:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-40 h-[420px] w-[420px] rounded-full bg-[#c8a15a]/10 blur-[130px]"
      />

      <article className="relative mx-auto max-w-[1200px] px-5 sm:px-7">
        {/* Header: text 860px er moddhe */}
        <div className="mx-auto max-w-[860px]">
          <Link
            href="/#insights"
            className="group inline-flex items-center gap-2 text-sm text-[#e0c28a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e0c28a]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to insights
          </Link>

          <header className="mt-8">
            <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-[#c8a15a]">
              <span className="h-px w-8 bg-[#c8a15a]" />
              Insight
            </span>
            <h1 className="mt-4 font-serif text-4xl font-medium leading-[1.15] text-white sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 text-sm text-[#968f83]">{date}</p>
          </header>
        </div>

        {/* Image: 1200px porjonto */}
        {image && (
          <div className="relative mt-8 aspect-[16/9] w-full max-w-[1200px] overflow-hidden border border-[#c8a15a]/25 bg-[#1a160f]">
            <Image
              src={image}
              alt={title}
              fill
              sizes="(min-width: 1200px) 1200px, 100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a08]/50 via-transparent to-transparent" />
          </div>
        )}

        {/* Description: text 860px er moddhe */}
        <div className="mx-auto mt-10 max-w-[860px] border-l-2 border-[#c8a15a]/60 pl-5 text-[16px] leading-[1.9] text-[#d8d2c8]/90 sm:pl-7 [&_a]:text-[#e0c28a] [&_a]:underline [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-white [&_h3]:mt-6 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:text-white [&_li]:ml-5 [&_ol]:list-decimal [&_p+p]:mt-4 [&_ul]:list-disc">
          <TiptapRenderer html={item.description ?? ""} />
        </div>
      </article>
    </main>
  );
}
