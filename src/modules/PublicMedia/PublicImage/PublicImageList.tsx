import { ArrowRight, CalendarDays, ImageIcon, Library } from "lucide-react";
import Link from "next/link";

import {
  IImage,
  IMediaMeta,
} from "@/services/mediaContentManagement/image.service";

const BASE_PATH = "/media/image";

interface Props {
  images: IImage[];
  meta: IMediaMeta;
}

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

export default function PublicImageList({ images, meta }: Props) {
  return (
    <main className="min-h-screen bg-[#faf9f7]">
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="border-b border-[#eadfd9] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d8b8aa] bg-[#fff8f5] px-4 py-2 text-sm font-medium text-[#7d1f2a]">
              <Library className="h-4 w-4" />
              Image Collection
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-[#241f20] sm:text-5xl">
              Visual Stories
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#766c6b] sm:text-lg">
              Explore our collection of images and visual moments.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Grid ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#241f20]">All Images</h2>
          <p className="mt-1 text-sm text-[#817776]">
            {meta.total} {meta.total === 1 ? "image" : "images"} available
          </p>
        </div>

        {/* ─── Empty State ───────────────────────────────────── */}
        {images.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#d9cbc6] bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f7ece8]">
              <ImageIcon className="h-7 w-7 text-[#7d1f2a]" />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-[#241f20]">
              No images found
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#817776]">
              There are currently no published images to view.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((image) => (
                <article
                  key={image.id}
                  className="group overflow-hidden rounded-2xl border border-[#e8ddd8] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#cda69a] hover:shadow-lg"
                >
                  <Link href={`${BASE_PATH}/${image.id}`} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#241f20]">
                      {image.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={image.imageUrl}
                          alt={image.title || "Image"}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ImageIcon className="h-10 w-10 text-white/30" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />

                      <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-white backdrop-blur">
                        Image
                      </span>
                    </div>
                  </Link>

                  <div className="p-5">
                    <Link href={`${BASE_PATH}/${image.id}`}>
                      <h2 className="line-clamp-2 text-lg font-semibold leading-snug text-[#241f20] transition-colors group-hover:text-[#7d1f2a]">
                        {image.title || "Untitled image"}
                      </h2>
                    </Link>

                    {image.description ? (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#817776]">
                        {image.description
                          .replace(/<[^>]*>/g, " ")
                          .replace(/\s+/g, " ")
                          .trim()}
                      </p>
                    ) : null}

                    <div className="mt-5 flex items-center text-xs text-[#857876]">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        <span>{formatDate(image.createdAt)}</span>
                      </div>
                    </div>

                    <div className="mt-5">
                      <Link
                        href={`${BASE_PATH}/${image.id}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#7d1f2a] transition-colors hover:text-[#5f1720]"
                      >
                        View Image
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
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
