// import { INovel } from "@/services/book/novel.service";
// import TiptapRenderer from "@/shared/tiptapEditor/TiptapRenderer";
// import { ArrowLeft, BookOpen, CalendarDays, Eye, Library } from "lucide-react";
// import Link from "next/link";
// import TrackNovelView from "./components/TrackNovelView";
// import { NOVEL_PAGE_COPY } from "./constants/novel.constants";

// const BASE_PATH = "/books/novel";

// const formatDate = (date: string) => {
//   return new Intl.DateTimeFormat("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   }).format(new Date(date));
// };

// interface Props {
//   novel: INovel;
// }

// export default function PublicNovelDetail({ novel }: Props) {
//   const copy = NOVEL_PAGE_COPY;

//   // File-based novel content is plain extracted text.
//   // Editor-created novel content is HTML from TipTap.
//   const isPlainTextContent = Boolean(novel.fileType);

//   return (
//     <main className="min-h-screen bg-[#f7f3eb] text-[#241f20]">
//       {/* ───────────────── Top Navigation ───────────────── */}
//       <nav className="sticky top-0 z-40 border-b border-white/10 bg-[#0a1220]/95 text-white shadow-sm backdrop-blur-md">
//         <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
//           <Link
//             href={BASE_PATH}
//             className="group inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
//           >
//             <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
//             {copy.back}
//           </Link>

//           <div className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 sm:flex">
//             <BookOpen className="h-4 w-4 text-orange-500" />
//             {copy.label}
//           </div>

//           <div className="h-8 w-8 rounded-full border border-orange-500/20 bg-orange-500/10 sm:hidden" />
//         </div>
//       </nav>

//       {/* ───────────────── Hero / Novel Header ───────────────── */}
//       <section className="relative overflow-hidden bg-[#0a1220] text-white">
//         {/* Background decoration */}
//         <div className="pointer-events-none absolute inset-0">
//           <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl sm:h-96 sm:w-96" />

//           <div className="absolute -right-32 top-10 h-80 w-80 rounded-full bg-amber-500/5 blur-3xl sm:h-[500px] sm:w-[500px]" />

//           <div
//             className="absolute inset-0 opacity-[0.035]"
//             style={{
//               backgroundImage:
//                 "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
//               backgroundSize: "48px 48px",
//             }}
//           />

//           <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/[0.03] blur-3xl sm:h-96 sm:w-96" />
//         </div>

//         <div className="relative mx-auto max-w-5xl px-4 pb-14 pt-14 text-center sm:px-6 sm:pb-20 sm:pt-20 lg:pb-24">
//           {/* Badge */}
//           <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-orange-400">
//             <Library className="h-3.5 w-3.5" />
//             {copy.label}
//           </div>

//           {/* Title */}
//           <h1 className="mx-auto max-w-4xl font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
//             {novel.title}
//           </h1>

//           {/* Description / Meta */}
//           <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-slate-400">
//             <div className="flex items-center gap-2">
//               <CalendarDays className="h-4 w-4 text-orange-500" />
//               <span>{formatDate(novel.createdAt)}</span>
//             </div>

//             <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:block" />

//             <div className="flex items-center gap-2">
//               <Eye className="h-4 w-4 text-orange-500" />
//               <TrackNovelView views={Number(novel.views ?? 0)} />
//             </div>
//           </div>

//           {/* Decorative divider */}
//           <div className="mx-auto mt-10 flex items-center justify-center gap-3">
//             <span className="h-px w-12 bg-white/10 sm:w-20" />

//             <span className="h-2 w-2 rotate-45 bg-orange-500 shadow-lg shadow-orange-500/30" />

//             <span className="h-px w-12 bg-white/10 sm:w-20" />
//           </div>

//           {/* Small reading info */}
//           <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
//             <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
//               {isPlainTextContent ? "Document" : "Online Reading"}
//             </span>

//             <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
//               {copy.label}
//             </span>
//           </div>
//         </div>

//         {/* Bottom fade */}
//         <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#f7f3eb] to-transparent" />
//       </section>

//       {/* ───────────────── Reading Content ───────────────── */}
//       <article className="relative mx-auto max-w-4xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12 lg:pb-24">
//         {/* Reading paper */}
//         <div className="relative rounded-2xl border border-[#e8ddd5] bg-white px-5 py-8 shadow-[0_10px_40px_rgba(36,31,32,0.05)] sm:px-8 sm:py-12 lg:px-14 lg:py-16">
//           {/* Top accent */}
//           <div className="absolute left-1/2 top-0 h-1 w-20 -translate-x-1/2 rounded-b-full bg-orange-500" />

//           {isPlainTextContent ? (
//             <div className="whitespace-pre-wrap font-serif text-[17px] leading-[1.95] text-[#332c2b] sm:text-lg sm:leading-[2]">
//               {novel.content || ""}
//             </div>
//           ) : (
//             <div className="novel-content">
//               <TiptapRenderer html={novel.content || ""} />
//             </div>
//           )}

//           {/* Bottom ornament */}
//           <div className="mt-14 flex items-center justify-center gap-3">
//             <span className="h-px w-16 bg-[#e8ddd5]" />
//             <span className="h-2 w-2 rotate-45 bg-orange-500" />
//             <span className="h-px w-16 bg-[#e8ddd5]" />
//           </div>
//         </div>
//       </article>

//       {/* ───────────────── End Section ───────────────── */}
//       <section className="border-t border-[#e6ddd5] bg-white">
//         <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-16">
//           {/* Icon */}
//           <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-orange-500/20 bg-orange-500/10">
//             <BookOpen className="h-6 w-6 text-orange-500" />
//           </div>

//           <h2 className="mt-6 font-serif text-2xl font-semibold text-[#241f20] sm:text-3xl">
//             {copy.endTitle}
//           </h2>

//           <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#817572]">
//             {copy.endHint}
//           </p>

//           <Link
//             href={BASE_PATH}
//             className="group mt-7 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-orange-500/20"
//           >
//             <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
//             {copy.browse}
//           </Link>
//         </div>
//       </section>
//     </main>
//   );
// }
import { INovel } from "@/services/book/novel.service";
import { ArrowLeft, BookOpen, CalendarDays, Eye, Library } from "lucide-react";
import Link from "next/link";
import NovelReader from "./components/NovelReader";
import TrackNovelView from "./components/TrackNovelView";
import { NOVEL_PAGE_COPY } from "./constants/novel.constants";

const BASE_PATH = "/books/novel";

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

interface Props {
  novel: INovel;
}

export default function PublicNovelDetail({ novel }: Props) {
  const copy = NOVEL_PAGE_COPY;

  // File-based novel content is plain extracted text.
  // Editor-created novel content is HTML from TipTap.
  const isPlainTextContent = Boolean(novel.fileType);

  return (
    <main className="min-h-screen bg-[#f7f3eb] text-[#241f20]">
      {/* ───────────────── Top Navigation ───────────────── */}
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white text-slate-900 shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href={BASE_PATH}
            className="group inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            {copy.back}
          </Link>
          <div className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 sm:flex">
            <BookOpen className="h-4 w-4 text-[#f97316]" />
            {copy.label}
          </div>
          <div className="h-8 w-8 rounded-full border border-[#f97316]/20 bg-[#fff1e6] sm:hidden" />
        </div>
      </nav>

      {/* ───────────────── Hero / Novel Header ───────────────── */}
      <section className="relative overflow-hidden bg-white text-slate-900">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-[#f97316]/10 blur-3xl sm:h-96 sm:w-96" />
          <div className="absolute -right-32 top-10 h-80 w-80 rounded-full bg-[#f97316]/5 blur-3xl sm:h-[500px] sm:w-[500px]" />
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(10,18,32,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(10,18,32,0.5) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f97316]/[0.04] blur-3xl sm:h-96 sm:w-96" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 pb-14 pt-14 text-center sm:px-6 sm:pb-20 sm:pt-20 lg:pb-24">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f97316]/20 bg-[#fff1e6] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#ea6c0b]">
            <Library className="h-3.5 w-3.5" />
            {copy.label}
          </div>

          <h1 className="mx-auto max-w-4xl font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            {novel.title}
          </h1>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-[#f97316]" />
              <span>{formatDate(novel.createdAt)}</span>
            </div>
            <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-[#f97316]" />
              <TrackNovelView views={Number(novel.views ?? 0)} />
            </div>
          </div>

          <div className="mx-auto mt-10 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-slate-200 sm:w-20" />
            <span className="h-2 w-2 rotate-45 bg-[#f97316] shadow-lg shadow-orange-500/30" />
            <span className="h-px w-12 bg-slate-200 sm:w-20" />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
              {isPlainTextContent ? "Document" : "Online Reading"}
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
              {copy.label}
            </span>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#f7f3eb] to-transparent" />
      </section>

      {/* ───────────────── Reading Content ───────────────── */}
      <article className="relative mx-auto max-w-4xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12 lg:pb-24">
        <NovelReader
          content={novel.content || ""}
          isPlainText={isPlainTextContent}
        />
      </article>

      {/* ───────────────── End Section ───────────────── */}
      <section className="border-t border-[#e6ddd5] bg-white">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-16">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#f97316]/20 bg-[#f97316]/10">
            <BookOpen className="h-6 w-6 text-[#f97316]" />
          </div>
          <h2 className="mt-6 font-serif text-2xl font-semibold text-[#241f20] sm:text-3xl">
            {copy.endTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#817572]">
            {copy.endHint}
          </p>
          <Link
            href={BASE_PATH}
            className="group mt-7 inline-flex items-center gap-2 rounded-lg bg-[#f97316] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ea6c0b] hover:shadow-orange-500/20"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            {copy.browse}
          </Link>
        </div>
      </section>
    </main>
  );
}
