"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ILyrics, ILyricsMeta } from "@/services/book/lyrics.service";

import {
  BookOpen,
  Loader2,
  MoreVertical,
  Pencil,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

// ─── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  lyricss: ILyrics[];
  meta: ILyricsMeta;
  isPending: boolean;
  deletingLyricsId: string | null;
  onEdit: (lyrics: ILyrics) => void;
  onDelete: (lyrics: ILyrics) => void;
  onPublish: (lyrics: ILyrics) => void;
}

// ─── Page Numbers Helper ───────────────────────────────────────────────────────

const getPageNumbers = (current: number, total: number) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3)
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
};

// ─── Component ─────────────────────────────────────────────────────────────────

export default function AdminLyricsTable({
  lyricss,
  meta,
  isPending,
  deletingLyricsId,
  onEdit,
  onDelete,
  onPublish,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [activePage, setActivePage] = useState<number | null>(null);

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    setActivePage(page);
    startTransition(() => {
      router.push(`?${params.toString()}`);
      setActivePage(null);
    });
  };

  const isTableLoading = isPending || activePage !== null;

  return (
    <div className="relative overflow-hidden rounded-lg border bg-white">
      {/* ─── Loading Overlay ───────────────────────────────────────────────── */}
      {isTableLoading && (
        <div
          role="status"
          aria-live="polite"
          aria-busy="true"
          className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/60 backdrop-blur-[2px]"
        >
          <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 shadow-md ring-1 ring-slate-200">
            <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
            <span className="text-sm font-medium text-slate-600">
              Loading...
            </span>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Created by</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lyricss.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="px-4 py-16">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                      <BookOpen className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700">
                      No lyricss Found
                    </h3>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-400">
                      There are currently no lyricss available on the platform.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              lyricss.map((lyrics) => {
                const isDeleting = deletingLyricsId === lyrics.id;

                return (
                  <TableRow
                    key={lyrics.id}
                    className={
                      isDeleting ? "bg-red-50/60 opacity-60" : undefined
                    }
                  >
                    <TableCell className="font-medium text-slate-700">
                      {lyrics.title}
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {lyrics.creator?.name || "NA"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="uppercase">
                        {lyrics.fileType ?? "editor"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={lyrics.isPublished ? "default" : "outline"}
                        className={
                          lyrics.isPublished
                            ? "bg-emerald-500 hover:bg-emerald-500"
                            : "text-slate-500"
                        }
                      >
                        {lyrics.isPublished ? "Published" : "Unpublished"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {Number(lyrics.views ?? 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {new Date(lyrics.createdAt).toLocaleDateString()}
                    </TableCell>

                    {/* ─── Actions (···) ─────────────────────────────────── */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            disabled={isDeleting || isTableLoading}
                          >
                            {isDeleting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreVertical className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(lyrics)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onPublish(lyrics)}>
                            <UploadCloud
                              className={`mr-2 h-4 w-4 ${
                                lyrics.isPublished ? "rotate-180" : ""
                              }`}
                            />
                            {lyrics.isPublished ? "Unpublish" : "Publish"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => onDelete(lyrics)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* ─── Pagination ────────────────────────────────────────────────────── */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
          <span className="text-xs text-slate-400">
            Showing {(meta.page - 1) * 10 + 1}–
            {Math.min(meta.page * 10, meta.total)} of {meta.total} lyricss
          </span>

          <div className="flex items-center gap-1">
            <button
              disabled={meta.page <= 1 || activePage !== null}
              onClick={() => goToPage(meta.page - 1)}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {getPageNumbers(meta.page, meta.totalPages).map((page, idx) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="flex h-7 w-7 items-center justify-center text-xs text-slate-400"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  disabled={activePage !== null}
                  onClick={() => goToPage(page as number)}
                  className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-medium transition-colors disabled:cursor-not-allowed ${
                    page === meta.page
                      ? "bg-orange-500 text-white shadow-sm"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {activePage === page ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    page
                  )}
                </button>
              ),
            )}

            <button
              disabled={meta.page >= meta.totalPages || activePage !== null}
              onClick={() => goToPage(meta.page + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
