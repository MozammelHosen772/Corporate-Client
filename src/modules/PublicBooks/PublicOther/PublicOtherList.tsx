import { IOther, IOtherMeta } from "@/services/book/other.service";
import { ArrowRight, BookOpen, CalendarDays, Eye, Library } from "lucide-react";
import Link from "next/link";
import { OTHER_PAGE_COPY } from "./constants/other.constants";

const BASE_PATH = "/books/other";

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

interface Props {
  others: IOther[];
  meta: IOtherMeta;
}

export default function PublicOtherList({ others, meta }: Props) {
  const copy = OTHER_PAGE_COPY;

  return (
    <main className="min-h-screen bg-[#faf9f7]">
      {/* ─── Hero ───────────────────────────────────────────────────────── */}
      <section className="border-b border-[#eadfd9] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d8b8aa] bg-[#fff8f5] px-4 py-2 text-sm font-medium text-[#7d1f2a]">
              <Library className="h-4 w-4" />
              {copy.collection}
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-[#241f20] sm:text-5xl">
              {copy.headline}
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#766c6b] sm:text-lg">
              {copy.description}
            </p>
          </div>
        </div>
      </section>

      {/* ─── Grid ───────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#241f20]">
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

        {others.length === 0 ? (
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
              {others.map((other) => (
                <article
                  key={other.id}
                  className="group overflow-hidden rounded-2xl border border-[#e8ddd8] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#cda69a]"
                >
                  <Link href={`${BASE_PATH}/${other.id}`} className="block">
                    <div className="relative h-64 overflow-hidden bg-[#241f20]">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(125,31,42,0.5),transparent_45%)]" />
                      <div className="absolute inset-y-0 left-0 w-2 bg-[#7d1f2a]" />
                      <div className="relative flex h-full flex-col justify-between p-7">
                        <div className="flex items-center justify-between">
                          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/80 backdrop-blur">
                            {copy.label}
                          </span>
                          <BookOpen className="h-5 w-5 text-white/60" />
                        </div>
                        <div>
                          <div className="mb-4 h-px w-12 bg-[#c99b8c]" />
                          <h2 className="line-clamp-3 font-serif text-2xl font-semibold leading-tight text-white sm:text-3xl">
                            {other.title}
                          </h2>
                          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-white/50">
                            {copy.coverLine}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-4 text-xs text-[#857876]">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        <span>{formatDate(other.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Eye className="h-3.5 w-3.5" />
                        <span>
                          {Number(other.views ?? 0).toLocaleString()} views
                        </span>
                      </div>
                    </div>

                    <div className="mt-5">
                      <Link
                        href={`${BASE_PATH}/${other.id}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#7d1f2a] transition-colors hover:text-[#5f1720]"
                      >
                        {copy.readCta}
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* ─── Pagination ───────────────────────────────────────────── */}
            {meta.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
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
