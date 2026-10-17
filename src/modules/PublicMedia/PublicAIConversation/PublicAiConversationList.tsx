import { ArrowRight, BookOpen, CalendarDays, Library } from "lucide-react";
import Link from "next/link";

import { IAiConversation } from "@/services/mediaContentManagement/aiConversation.service";
import { IMediaMeta } from "@/services/mediaContentManagement/audio.service";

const BASE_PATH = "/media/ai-conversation";

interface Props {
  items: IAiConversation[];
  meta: IMediaMeta;
}

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

export default function PublicAiConversationList({ items, meta }: Props) {
  return (
    <main className="min-h-screen bg-[#faf9f7]">
      <section className="border-b border-[#eadfd9] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d8b8aa] bg-[#fff8f5] px-4 py-2 text-sm font-medium text-[#7d1f2a]">
              <Library className="h-4 w-4" />
              AI Conversations
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-[#241f20] sm:text-5xl">
              Conversations Worth Reading
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#766c6b] sm:text-lg">
              Explore recorded AI conversations shared by our contributors.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#241f20]">
            All Conversations
          </h2>
          <p className="mt-1 text-sm text-[#817776]">
            {meta.total} {meta.total === 1 ? "conversation" : "conversations"}{" "}
            available
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#d9cbc6] bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f7ece8]">
              <BookOpen className="h-7 w-7 text-[#7d1f2a]" />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-[#241f20]">
              No AI conversations found
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#817776]">
              There are currently no published conversations to read.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-2xl border border-[#e8ddd8] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#cda69a]"
                >
                  <Link href={`${BASE_PATH}/${item.id}`} className="block">
                    <div className="relative h-48 overflow-hidden bg-[#241f20]">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(125,31,42,0.5),transparent_45%)]" />
                      <div className="absolute inset-y-0 left-0 w-2 bg-[#7d1f2a]" />
                      <div className="relative flex h-full flex-col justify-between p-6">
                        <span className="w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/80 backdrop-blur">
                          AI Conversation
                        </span>
                        <h2 className="line-clamp-3 text-xl font-semibold leading-tight text-white">
                          {item.title || "Untitled conversation"}
                        </h2>
                      </div>
                    </div>
                  </Link>

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-4 text-xs text-[#857876]">
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
                        Read Conversation
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
