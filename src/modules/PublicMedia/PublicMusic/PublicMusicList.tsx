import { ArrowRight, CalendarDays, Library, Music, Play } from "lucide-react";
import Link from "next/link";

import { IMediaMeta } from "@/services/mediaContentManagement/audio.service";
import { IMusic } from "@/services/mediaContentManagement/music.service";

const BASE_PATH = "/media/music";

interface Props {
  items: IMusic[];
  meta: IMediaMeta;
}

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

function getYouTubeVideoId(url: string) {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes("youtube.com")) {
      return parsedUrl.searchParams.get("v") || "";
    }
    if (parsedUrl.hostname.includes("youtu.be")) {
      return parsedUrl.pathname.slice(1);
    }
    return "";
  } catch {
    return "";
  }
}

export default function PublicMusicList({ items, meta }: Props) {
  return (
    <main className="min-h-screen bg-[#faf9f7]">
      <section className="border-b border-[#eadfd9] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d8b8aa] bg-[#fff8f5] px-4 py-2 text-sm font-medium text-[#7d1f2a]">
              <Library className="h-4 w-4" />
              Music Collection
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-[#241f20] sm:text-5xl">
              Listen & Watch
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#766c6b] sm:text-lg">
              A mix of music videos and audio tracks from our collection.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#241f20]">All Music</h2>
          <p className="mt-1 text-sm text-[#817776]">
            {meta.total} {meta.total === 1 ? "track" : "tracks"} available
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#d9cbc6] bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f7ece8]">
              <Music className="h-7 w-7 text-[#7d1f2a]" />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-[#241f20]">
              No music found
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#817776]">
              There are currently no published music tracks.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => {
                const videoId =
                  item.type === "VIDEO" && item.youtubeUrl
                    ? getYouTubeVideoId(item.youtubeUrl)
                    : "";

                return (
                  <article
                    key={item.id}
                    className="group overflow-hidden rounded-2xl border border-[#e8ddd8] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#cda69a] hover:shadow-lg"
                  >
                    <Link href={`${BASE_PATH}/${item.id}`} className="block">
                      <div className="relative aspect-video overflow-hidden bg-[#241f20]">
                        {item.type === "VIDEO" && videoId ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                            alt={item.title || "Music video"}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : item.type === "AUDIO" && item.thumbnailUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.thumbnailUrl}
                            alt={item.title || "Audio"}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(125,31,42,0.4),transparent_55%)]" />
                        )}

                        <div className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-black/30" />

                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-[#7d1f2a] shadow-xl transition-all duration-300 group-hover:scale-110">
                            <Play className="ml-1 h-6 w-6 fill-current" />
                          </div>
                        </div>

                        <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-white backdrop-blur">
                          {item.type === "VIDEO" ? "Video" : "Audio"}
                        </span>
                      </div>
                    </Link>

                    <div className="p-5">
                      <Link href={`${BASE_PATH}/${item.id}`}>
                        <h2 className="line-clamp-2 text-lg font-semibold leading-snug text-[#241f20] transition-colors group-hover:text-[#7d1f2a]">
                          {item.title || "Untitled track"}
                        </h2>
                      </Link>

                      {item.description ? (
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#817776]">
                          {item.description
                            .replace(/<[^>]*>/g, " ")
                            .replace(/\s+/g, " ")
                            .trim()}
                        </p>
                      ) : null}

                      <div className="mt-5 flex items-center text-xs text-[#857876]">
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5" />
                          <span>{formatDate(item.createdAt)}</span>
                        </div>
                      </div>

                      <div className="mt-5">
                        <Link
                          href={`${BASE_PATH}/${item.id}`}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-[#7d1f2a] transition-colors hover:text-[#5f1720]"
                        >
                          {item.type === "VIDEO" ? "Watch Now" : "Listen Now"}
                          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

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
