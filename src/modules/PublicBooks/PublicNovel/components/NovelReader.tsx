"use client";

import TiptapRenderer from "@/shared/tiptapEditor/TiptapRenderer";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

const WORDS_PER_PAGE = 550;

interface Props {
  content: string;
  isPlainText: boolean;
}

// ─── Split into pages by paragraph, never breaking a word ─────────────────
function splitIntoPages(text: string): string[] {
  const paragraphs = text.split(/\n{2,}/).filter((p) => p.trim() !== "");
  const pages: string[] = [];
  let current: string[] = [];
  let currentWordCount = 0;

  const pushCurrent = () => {
    if (current.length > 0) {
      pages.push(current.join("\n\n"));
      current = [];
      currentWordCount = 0;
    }
  };

  for (const paragraph of paragraphs) {
    const words = paragraph.split(/\s+/).filter(Boolean);

    if (words.length > WORDS_PER_PAGE) {
      // Single paragraph too long for one page — split by words, whole
      // words only, never mid-word.
      let chunk: string[] = [];
      for (const word of words) {
        if (currentWordCount + chunk.length + 1 > WORDS_PER_PAGE) {
          current.push(chunk.join(" "));
          pushCurrent();
          chunk = [];
        }
        chunk.push(word);
      }
      if (chunk.length > 0) {
        current.push(chunk.join(" "));
        currentWordCount += chunk.length;
      }
      continue;
    }

    if (
      currentWordCount + words.length > WORDS_PER_PAGE &&
      current.length > 0
    ) {
      pushCurrent();
    }

    current.push(paragraph);
    currentWordCount += words.length;
  }

  pushCurrent();

  return pages.length > 0 ? pages : [""];
}

export default function NovelReader({ content, isPlainText }: Props) {
  const pages = useMemo(
    () => (isPlainText ? splitIntoPages(content) : [content]),
    [content, isPlainText],
  );

  const [pageIndex, setPageIndex] = useState(0);
  const totalPages = pages.length;
  const showPager = isPlainText && totalPages > 1;

  const goToPage = (next: number) => {
    if (next < 0 || next >= totalPages) return;
    setPageIndex(next);
    // reading paper-এর top-এ স্ক্রল করে নিয়ে যাওয়া, পেজ বদলালে
    const el = document.getElementById("reading-paper");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      <div
        id="reading-paper"
        className="relative overflow-hidden rounded-2xl border border-[#e8ddd5] bg-white px-5 py-8 shadow-[0_10px_40px_rgba(36,31,32,0.05)] sm:px-8 sm:py-12 lg:px-14 lg:py-16"
      >
        {/* ─── Top accent ─────────────────────────────────────────────── */}
        <div className="absolute left-1/2 top-0 h-1 w-20 -translate-x-1/2 rounded-b-full bg-[#f97316]" />

        {/* ─── Watermark + decorative glow ───────────────────────────── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[#f97316]/[0.06] blur-3xl" />
          <div className="absolute -bottom-20 -right-16 h-64 w-64 rounded-full bg-[#f97316]/[0.05] blur-3xl" />
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[13vw] font-bold uppercase tracking-widest text-[#0a1220]/[0.025] sm:text-[7rem]"
            style={{ transform: "translate(-50%, -50%) rotate(-28deg)" }}
          >
            ContentCreate
          </div>
        </div>

        {/* ─── Content ────────────────────────────────────────────────── */}
        <div className="relative">
          {isPlainText ? (
            <div className="whitespace-pre-wrap font-serif text-[17px] leading-[1.95] text-[#332c2b] sm:text-lg sm:leading-[2]">
              {pages[pageIndex]}
            </div>
          ) : (
            <div className="novel-content">
              <TiptapRenderer html={content || ""} />
            </div>
          )}
        </div>

        {/* ─── Bottom ornament ────────────────────────────────────────── */}
        <div className="relative mt-14 flex items-center justify-center gap-3">
          <span className="h-px w-16 bg-[#e8ddd5]" />
          <span className="h-2 w-2 rotate-45 bg-[#f97316]" />
          <span className="h-px w-16 bg-[#e8ddd5]" />
        </div>
      </div>

      {/* ─── Pager ────────────────────────────────────────────────────── */}
      {showPager && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => goToPage(pageIndex - 1)}
            disabled={pageIndex === 0}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-[#f97316]/40 hover:text-[#f97316] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span className="min-w-[80px] text-center text-sm font-medium text-slate-600">
            Page {pageIndex + 1} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() => goToPage(pageIndex + 1)}
            disabled={pageIndex === totalPages - 1}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-[#f97316]/40 hover:text-[#f97316] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
