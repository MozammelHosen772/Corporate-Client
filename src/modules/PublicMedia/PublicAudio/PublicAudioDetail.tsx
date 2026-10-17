import { IAudio } from "@/services/mediaContentManagement/audio.service";
import TiptapRenderer from "@/shared/tiptapEditor/TiptapRenderer";
import { ArrowLeft, CalendarDays, Library, Music, Play } from "lucide-react";
import Link from "next/link";

const BASE_PATH = "/media/audio";

interface Props {
  audio: IAudio;
}

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

export default function PublicAudioDetail({ audio }: Props) {
  return (
    <main className="min-h-screen bg-[#faf9f7]">
      {/* ─── Top Nav ─────────────────────────────────────────── */}
      <div className="border-b border-[#e9ddd8] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href={BASE_PATH}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#665b59] transition-colors hover:text-[#7d1f2a]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Audio
          </Link>
          <div className="hidden items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-[#9b8d89] sm:flex">
            <Music className="h-4 w-4" />
            Audio
          </div>
        </div>
      </div>

      {/* ─── Header ──────────────────────────────────────────── */}
      <header className="mx-auto max-w-4xl px-4 pb-10 pt-14 text-center sm:px-6 sm:pt-20">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dcc0b7] bg-[#fff8f5] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#7d1f2a]">
          <Library className="h-3.5 w-3.5" />
          Audio
        </div>

        <h1 className="text-4xl font-semibold leading-tight tracking-tight text-[#241f20] sm:text-5xl lg:text-6xl">
          {audio.title || "Untitled Track"}
        </h1>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2 text-sm text-[#827673]">
          <CalendarDays className="h-4 w-4" />
          <span>{formatDate(audio.createdAt)}</span>
        </div>

        <div className="mx-auto mt-10 flex items-center justify-center gap-3">
          <span className="h-px w-16 bg-[#dccdc7]" />
          <span className="h-2 w-2 rotate-45 bg-[#7d1f2a]" />
          <span className="h-px w-16 bg-[#dccdc7]" />
        </div>
      </header>

      {/* ─── Player ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 pb-12 sm:px-6">
        <div className="overflow-hidden rounded-2xl border border-[#e1d5d0] bg-[#241f20] p-8 shadow-xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
            <Play className="ml-1 h-6 w-6 fill-white text-white" />
          </div>
          {audio.audioUrl ? (
            <audio controls className="w-full" src={audio.audioUrl}>
              Your browser does not support the audio element.
            </audio>
          ) : (
            <p className="text-center text-sm text-white/60">
              Audio file not available.
            </p>
          )}
        </div>
      </section>

      {/* ─── Description ─────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:pb-24">
        <div className="rounded-2xl border border-[#e8ddd8] bg-white p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f7ece8]">
              <Music className="h-4 w-4 text-[#7d1f2a]" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#9b8d89]">
                About this track
              </p>
              <h2 className="mt-1 text-xl font-semibold text-[#241f20]">
                {audio.title || "Audio"}
              </h2>
            </div>
          </div>

          {audio.description ? (
            <div className="mt-6 border-t border-[#eee4df] pt-6">
              <TiptapRenderer html={audio.description} />
            </div>
          ) : (
            <p className="mt-6 border-t border-[#eee4df] pt-6 text-sm text-[#817776]">
              No description available for this track.
            </p>
          )}
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────── */}
      <section className="border-t border-[#e7dbd6] bg-white">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f7ece8]">
            <Music className="h-5 w-5 text-[#7d1f2a]" />
          </div>
          <h2 className="mt-5 text-2xl font-semibold text-[#241f20]">
            Continue Exploring
          </h2>
          <p className="mt-2 text-sm text-[#817572]">
            Discover more audio from our collection.
          </p>
          <Link
            href={BASE_PATH}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#7d1f2a] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#651923]"
          >
            <ArrowLeft className="h-4 w-4" />
            Browse Audio
          </Link>
        </div>
      </section>
    </main>
  );
}
