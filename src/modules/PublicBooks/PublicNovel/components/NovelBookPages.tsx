"use client";

import { useMemo } from "react";

interface Props {
  content: string;
  title: string;
  isPlainText: boolean;
}

const WORDS_PER_PAGE = 650;

function splitIntoPages(text: string, wordsPerPage = WORDS_PER_PAGE) {
  const cleanText = text.trim();

  if (!cleanText) return [""];

  const words = cleanText.split(/\s+/);

  const pages: string[] = [];

  for (let i = 0; i < words.length; i += wordsPerPage) {
    pages.push(words.slice(i, i + wordsPerPage).join(" "));
  }

  return pages;
}

export default function NovelBookPages({ content, title, isPlainText }: Props) {
  const pages = useMemo(() => {
    if (!isPlainText) return [content || ""];

    return splitIntoPages(content);
  }, [content, isPlainText]);

  return (
    <div className="mx-auto w-full max-w-[850px]">
      {/* Book pages */}
      <div className="space-y-8 sm:space-y-10">
        {pages.map((page, index) => {
          const pageNumber = index + 1;
          const totalPages = pages.length;

          return (
            <article
              key={pageNumber}
              className="group relative mx-auto flex min-h-[900px] w-full flex-col overflow-hidden bg-white shadow-[0_8px_35px_rgba(36,31,32,0.10)] ring-1 ring-black/[0.04] sm:min-h-[1120px] lg:min-h-[1200px]"
            >
              {/* ───────── Page Background Decoration ───────── */}

              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {/* Top right shape */}
                <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-orange-500/[0.035] blur-2xl" />

                {/* Bottom left shape */}
                <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-orange-500/[0.035] blur-2xl" />

                {/* Center watermark */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="select-none whitespace-nowrap text-[55px] font-bold uppercase tracking-[0.35em] text-slate-900/[0.025] sm:text-[80px]">
                    {title}
                  </span>
                </div>

                {/* Subtle border */}
                <div className="absolute inset-5 border border-slate-900/[0.035] sm:inset-7" />
              </div>

              {/* ───────── Page Header ───────── */}

              <div className="relative z-10 px-7 pb-4 pt-8 sm:px-12 sm:pb-5 sm:pt-12 lg:px-16">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:text-[10px]">
                    {title}
                  </span>

                  <span className="text-[9px] uppercase tracking-[0.16em] text-slate-300 sm:text-[10px]">
                    {pageNumber} / {totalPages}
                  </span>
                </div>
              </div>

              {/* ───────── Page Content ───────── */}

              <div className="relative z-10 flex-1 px-7 pb-14 sm:px-12 lg:px-16">
                {isPlainText ? (
                  <div className="whitespace-pre-wrap break-words font-serif text-[15px] leading-[1.85] text-[#302b2a] sm:text-[16px] sm:leading-[1.9] lg:text-[17px]">
                    {page}
                  </div>
                ) : (
                  <div
                    className="novel-page-html font-serif text-[15px] leading-[1.85] text-[#302b2a] sm:text-[16px] sm:leading-[1.9] lg:text-[17px]"
                    dangerouslySetInnerHTML={{ __html: page }}
                  />
                )}
              </div>

              {/* ───────── Page Footer ───────── */}

              <div className="relative z-10 px-7 pb-7 pt-4 sm:px-12 sm:pb-10 lg:px-16">
                <div className="flex items-center justify-between border-t border-slate-200/80 pt-3">
                  <span className="text-[9px] text-slate-300 sm:text-[10px]">
                    {pageNumber === 1 ? "Beginning" : ""}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="h-px w-8 bg-slate-200" />

                    <span className="h-1.5 w-1.5 rotate-45 bg-orange-500/70" />

                    <span className="h-px w-8 bg-slate-200" />
                  </div>

                  <span className="text-[9px] font-medium text-slate-400 sm:text-[10px]">
                    {pageNumber} / {totalPages}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
