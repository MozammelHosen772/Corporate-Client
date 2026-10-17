import { IOtherMedia } from "@/services/mediaContentManagement/other.service";
import TiptapRenderer from "@/shared/tiptapEditor/TiptapRenderer";
import { ArrowLeft, BookOpen, CalendarDays, Library } from "lucide-react";
import Link from "next/link";

const BASE_PATH = "/media/other";

interface Props {
  item: IOtherMedia;
}

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

export default function PublicOtherDetail({ item }: Props) {
  const isPlainText = Boolean(item.fileType);

  return (
    <main className="min-h-screen bg-[#faf9f7]">
      <div className="border-b border-[#e9ddd8] bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href={BASE_PATH}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#665b59] transition-colors hover:text-[#7d1f2a]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Other Writings
          </Link>
          <div className="hidden items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-[#9b8d89] sm:flex">
            <BookOpen className="h-4 w-4" />
            Other
          </div>
        </div>
      </div>

      <header className="mx-auto max-w-4xl px-4 pb-10 pt-14 text-center sm:px-6 sm:pt-20">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dcc0b7] bg-[#fff8f5] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#7d1f2a]">
          <Library className="h-3.5 w-3.5" />
          Other
        </div>
        <h1 className="mx-auto max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-[#241f20] sm:text-5xl">
          {item.title || "Untitled Entry"}
        </h1>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2 text-sm text-[#827673]">
          <CalendarDays className="h-4 w-4" />
          <span>{formatDate(item.createdAt)}</span>
        </div>
        <div className="mx-auto mt-10 flex items-center justify-center gap-3">
          <span className="h-px w-16 bg-[#dccdc7]" />
          <span className="h-2 w-2 rotate-45 bg-[#7d1f2a]" />
          <span className="h-px w-16 bg-[#dccdc7]" />
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:pb-24">
        <div className="rounded-2xl border border-[#e8ddd5] bg-white px-5 py-8 shadow-[0_10px_40px_rgba(36,31,32,0.05)] sm:px-8 sm:py-12">
          {item.content ? (
            isPlainText ? (
              <div className="whitespace-pre-wrap font-serif text-[17px] leading-[1.95] text-[#332c2b] sm:text-lg sm:leading-[2]">
                {item.content}
              </div>
            ) : (
              <TiptapRenderer html={item.content} />
            )
          ) : (
            <p className="text-sm text-[#817776]">
              No content available for this entry.
            </p>
          )}
        </div>
      </article>

      <section className="border-t border-[#e6ddd5] bg-white">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-16">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#7d1f2a]/20 bg-[#f7ece8]">
            <BookOpen className="h-6 w-6 text-[#7d1f2a]" />
          </div>
          <h2 className="mt-6 text-2xl font-semibold text-[#241f20] sm:text-3xl">
            Continue Exploring
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#817572]">
            Discover more writings from our collection.
          </p>
          <Link
            href={BASE_PATH}
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#7d1f2a] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#651923]"
          >
            <ArrowLeft className="h-4 w-4" />
            Browse Other Writings
          </Link>
        </div>
      </section>
    </main>
  );
}
