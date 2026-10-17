import { ArrowRight, CalendarDays, Library, Play, Video } from "lucide-react";
import Link from "next/link";

import {
  IMediaMeta,
  IVideo,
} from "@/services/mediaContentManagement/video.service";

const BASE_PATH = "/media/video";

interface Props {
  videos: IVideo[];
  meta: IMediaMeta;
}

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

export default function PublicVideoList({ videos, meta }: Props) {
  return (
    <main className="min-h-screen bg-[#faf9f7]">
      {/* ─── Hero ─────────────────────────────────────────────── */}

      <section className="border-b border-[#eadfd9] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d8b8aa] bg-[#fff8f5] px-4 py-2 text-sm font-medium text-[#7d1f2a]">
              <Library className="h-4 w-4" />
              Video Collection
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-[#241f20] sm:text-5xl">
              Watch & Learn
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#766c6b] sm:text-lg">
              Explore our collection of educational, inspiring, and informative
              videos.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Video Grid ──────────────────────────────────────── */}

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#241f20]">All Videos</h2>

          <p className="mt-1 text-sm text-[#817776]">
            {meta.total} {meta.total === 1 ? "video" : "videos"} available
          </p>
        </div>

        {/* ─── Empty State ─────────────────────────────────── */}

        {videos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#d9cbc6] bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f7ece8]">
              <Video className="h-7 w-7 text-[#7d1f2a]" />
            </div>

            <h3 className="mt-5 text-xl font-semibold text-[#241f20]">
              No videos available
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#817776]">
              There are currently no published videos to watch.
            </p>
          </div>
        ) : (
          <>
            {/* ─── Grid ─────────────────────────────────────── */}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <article
                  key={video.id}
                  className="group overflow-hidden rounded-2xl border border-[#e8ddd8] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#cda69a] hover:shadow-lg"
                >
                  {/* ─── YouTube Preview ──────────────────── */}

                  <Link href={`${BASE_PATH}/${video.id}`} className="block">
                    <div className="relative aspect-video overflow-hidden bg-[#241f20]">
                      {/* YouTube Thumbnail */}

                      <img
                        src={`https://img.youtube.com/vi/${getYouTubeVideoId(
                          video.youtubeUrl,
                        )}/maxresdefault.jpg`}
                        alt={video.title || "Video thumbnail"}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Overlay */}

                      <div className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-black/30" />

                      {/* Play Button */}

                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-[#7d1f2a] shadow-xl transition-all duration-300 group-hover:scale-110">
                          <Play className="ml-1 h-6 w-6 fill-current" />
                        </div>
                      </div>

                      {/* Video Label */}

                      <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-white backdrop-blur">
                        Video
                      </span>
                    </div>
                  </Link>

                  {/* ─── Content ──────────────────────────── */}

                  <div className="p-5">
                    <Link href={`${BASE_PATH}/${video.id}`}>
                      <h2 className="line-clamp-2 text-lg font-semibold leading-snug text-[#241f20] transition-colors group-hover:text-[#7d1f2a]">
                        {video.title}
                      </h2>
                    </Link>

                    {video.description ? (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#817776]">
                        {video.description
                          .replace(/<[^>]*>/g, " ")
                          .replace(/\s+/g, " ")
                          .trim()}
                      </p>
                    ) : null}

                    {/* ─── Date ───────────────────────────── */}

                    <div className="mt-5 flex items-center text-xs text-[#857876]">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />

                        <span>{formatDate(video.createdAt)}</span>
                      </div>
                    </div>

                    {/* ─── CTA ────────────────────────────── */}

                    <div className="mt-5">
                      <Link
                        href={`${BASE_PATH}/${video.id}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#7d1f2a] transition-colors hover:text-[#5f1720]"
                      >
                        Watch Video
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* ─── Pagination ──────────────────────────────── */}

            {meta.totalPages > 1 && (
              <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
                {Array.from(
                  { length: meta.totalPages },
                  (_, index) => index + 1,
                ).map((page) => (
                  <Link
                    key={page}
                    href={`${BASE_PATH}?page=${page}`}
                    className={`flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors ${
                      page === meta.page
                        ? "border-[#7d1f2a] bg-[#7d1f2a] text-white"
                        : "border-[#ded1cc] bg-white text-[#625957] hover:border-[#b98c80] hover:text-[#7d1f2a]"
                    }`}
                  >
                    {page}
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

/* ─── YouTube Video ID Helper ─────────────────────────────── */

function getYouTubeVideoId(url: string) {
  try {
    const parsedUrl = new URL(url);

    // youtube.com/watch?v=XXXXXXXXXXX
    if (parsedUrl.hostname.includes("youtube.com")) {
      return parsedUrl.searchParams.get("v") || "";
    }

    // youtu.be/XXXXXXXXXXX
    if (parsedUrl.hostname.includes("youtu.be")) {
      return parsedUrl.pathname.slice(1);
    }

    return "";
  } catch {
    return "";
  }
}
