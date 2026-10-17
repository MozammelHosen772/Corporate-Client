import { INovel, INovelMeta } from "@/services/book/novel.service";
import { ArrowRight, BookOpen, CalendarDays, Eye, Library } from "lucide-react";
import Link from "next/link";
import { NOVEL_PAGE_COPY } from "./constants/novel.constants";

const BASE_PATH = "/books/novel";

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

interface Props {
  novels: INovel[];
  meta: INovelMeta;
}

export default function PublicNovelList({ novels, meta }: Props) {
  const copy = NOVEL_PAGE_COPY;

  return (
    <main className="min-h-screen bg-[#f7f3eb]">
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0a1220] text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl sm:h-96 sm:w-96" />
          <div className="absolute -right-32 top-20 h-80 w-80 rounded-full bg-amber-500/5 blur-3xl sm:h-[500px] sm:w-[500px]" />
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 backdrop-blur-sm">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500/10">
                <Library className="h-3.5 w-3.5 text-orange-400" />
              </span>
              <span>{copy.collection}</span>
            </div>

            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              {copy.headline}
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
              {copy.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-slate-500">
              <span>Stories</span>
              <span className="h-1 w-1 rounded-full bg-orange-500" />
              <span>Chapters</span>
              <span className="h-1 w-1 rounded-full bg-orange-500" />
              <span>Writers</span>
              <span className="h-1 w-1 rounded-full bg-orange-500" />
              <span>Creative works</span>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-[#f7f3eb]/20 to-transparent" />
      </section>

      {/* ─── Grid ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#241f20] sm:text-2xl">
            All {copy.plural}
          </h2>
          <p className="mt-1 text-sm text-[#817776]">
            {meta.total}{" "}
            {meta.total === 1
              ? copy.label.toLowerCase()
              : copy.plural.toLowerCase()}{" "}
            available
          </p>
        </div>

        {novels.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#d9cbc6] bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f7ece8]">
              <BookOpen className="h-7 w-7 text-[#7d1f2a]" />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-[#241f20]">
              {copy.empty}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#817776]">
              {copy.emptyHint}
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {novels.map((novel) => (
                <article
                  key={novel.id}
                  className="group overflow-hidden rounded-2xl border border-[#e4d8ce] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg hover:shadow-[#241f20]/5"
                >
                  {/* Cover — tilted 3D book */}
                  <Link href={`${BASE_PATH}/${novel.id}`} className="block">
                    <div className="relative flex h-64 items-center justify-center overflow-hidden bg-[#0a1220]">
                      {/* ambient glow behind the book */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.12),transparent_60%)]" />

                      {/* ─── The book itself ─────────────────────────── */}
                      <div className="relative aspect-[3/4] w-[150px] -rotate-6 rounded-lg bg-gradient-to-br from-[#1c2740] to-[#0f1728] shadow-[8px_16px_32px_-8px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-105">
                        {/* spine */}
                        <div className="absolute inset-y-0 left-0 w-[10px] rounded-l-lg bg-orange-500" />
                        {/* sheen */}
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />
                        {/* page edge on the right */}
                        <div className="absolute inset-y-1 right-0 w-[3px] rounded-r-sm bg-white/10" />

                        <div className="relative flex h-full flex-col justify-between p-4 pl-5">
                          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-orange-400">
                            {copy.label}
                          </span>

                          <div>
                            <div className="mb-2.5 h-px w-8 bg-white/15" />
                            <h2 className="line-clamp-4 text-[15px] font-bold leading-snug text-white">
                              {novel.title}
                            </h2>
                            <p className="mt-2 text-[9px] uppercase tracking-wide text-white/40">
                              {copy.coverLine}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Card content */}
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-4 text-xs text-[#857876]">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        <span>{formatDate(novel.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Eye className="h-3.5 w-3.5" />
                        <span>
                          {Number(novel.views ?? 0).toLocaleString()} views
                        </span>
                      </div>
                    </div>

                    <div className="mt-5">
                      <Link
                        href={`${BASE_PATH}/${novel.id}`}
                        className="group/read inline-flex items-center gap-2 text-sm font-semibold text-[#7d1f2a] transition-colors hover:text-orange-600"
                      >
                        {copy.readCta}
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/read:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
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
                    className={`flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-all ${
                      page === meta.page
                        ? "border-orange-500 bg-orange-500 text-white shadow-sm shadow-orange-500/20"
                        : "border-[#ded1cc] bg-white text-[#625957] hover:border-orange-300 hover:text-orange-600"
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
