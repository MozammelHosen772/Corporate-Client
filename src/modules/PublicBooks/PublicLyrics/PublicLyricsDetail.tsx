import { ILyrics } from "@/services/book/lyrics.service";
import TiptapRenderer from "@/shared/tiptapEditor/TiptapRenderer";
import { ArrowLeft, BookOpen, CalendarDays, Library } from "lucide-react";
import Link from "next/link";
import TrackLyricsView from "./components/TrackLyricsView";
import { LYRICS_PAGE_COPY } from "./constants/lyrics.constants";

const BASE_PATH = "/books/lyrics";

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

interface Props {
  lyrics: ILyrics;
}

export default function PublicLyricsDetail({ lyrics }: Props) {
  const copy = LYRICS_PAGE_COPY;

  // ✅ file (txt/docx/pdf) থেকে আসা lyrics-এ content plain extracted text —
  // HTML না, তাই TiptapRenderer দেওয়া যাবে না। Editor থেকে লেখা lyrics-এই
  // content আসলে HTML (TipTap output)।
  const isPlainTextContent = Boolean(lyrics.fileType);

  return (
    <main className="min-h-screen bg-[#faf9f7]">
      {/* ─── Top Nav ────────────────────────────────────────────────────── */}
      <div className="border-b border-[#e9ddd8] bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href={BASE_PATH}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#665b59] transition-colors hover:text-[#7d1f2a]"
          >
            <ArrowLeft className="h-4 w-4" />
            {copy.back}
          </Link>

          <div className="hidden items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-[#9b8d89] sm:flex">
            <BookOpen className="h-4 w-4" />
            {copy.label}
          </div>
        </div>
      </div>

      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <header className="mx-auto max-w-4xl px-4 pb-10 pt-14 text-center sm:px-6 sm:pt-20">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dcc0b7] bg-[#fff8f5] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#7d1f2a]">
          <Library className="h-3.5 w-3.5" />
          {copy.label}
        </div>

        <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-[#241f20] sm:text-5xl lg:text-6xl">
          {lyrics.title}
        </h1>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-[#827673]">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>{formatDate(lyrics.createdAt)}</span>
          </div>

          <span className="hidden h-1 w-1 rounded-full bg-[#c8b8b2] sm:block" />

          <TrackLyricsView views={Number(lyrics.views ?? 0)} />
        </div>

        <div className="mx-auto mt-10 flex items-center justify-center gap-3">
          <span className="h-px w-16 bg-[#dccdc7]" />
          <span className="h-2 w-2 rotate-45 bg-[#7d1f2a]" />
          <span className="h-px w-16 bg-[#dccdc7]" />
        </div>
      </header>

      {/* ─── Content ────────────────────────────────────────────────────── */}
      <article className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:pb-24">
        {isPlainTextContent ? (
          <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-[#241f20]">
            {lyrics.content || ""}
          </div>
        ) : (
          <TiptapRenderer html={lyrics.content || ""} />
        )}
      </article>

      {/* ─── Footer / End of lyrics ──────────────────────────────────────── */}
      <section className="border-t border-[#e7dbd6] bg-white">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f7ece8]">
            <BookOpen className="h-5 w-5 text-[#7d1f2a]" />
          </div>

          <h2 className="mt-5 font-serif text-2xl font-semibold text-[#241f20]">
            {copy.endTitle}
          </h2>

          <p className="mt-2 text-sm text-[#817572]">{copy.endHint}</p>

          <Link
            href={BASE_PATH}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#7d1f2a] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#651923]"
          >
            <ArrowLeft className="h-4 w-4" />
            {copy.browse}
          </Link>
        </div>
      </section>
    </main>
  );
}
