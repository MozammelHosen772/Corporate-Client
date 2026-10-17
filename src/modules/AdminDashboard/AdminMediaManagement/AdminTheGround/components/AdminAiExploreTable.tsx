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

import { IMediaMeta } from "@/services/mediaContentManagement/image.service";
import { ITheGround } from "@/services/mediaContentManagement/theGround.service";

import {
  FileQuestion,
  ImageIcon,
  Loader2,
  MoreVertical,
  Pencil,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

interface Props {
  items: ITheGround[];
  meta: IMediaMeta;
  isPending: boolean;
  deletingId: string | null;
  onEdit: (item: ITheGround) => void;
  onDelete: (item: ITheGround) => void;
  onPublish: (item: ITheGround) => void;
}

const getPageNumbers = (current: number, total: number) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3)
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
};

export default function AdminAiExploreTable({
  items,
  meta,
  isPending,
  deletingId,
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
      {isTableLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/60 backdrop-blur-[2px]">
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
              <TableHead>Thumbnail</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Created by</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="px-4 py-16">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                      <FileQuestion className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700">
                      No AI Explore items found
                    </h3>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => {
                const isDeleting = deletingId === item.id;
                return (
                  <TableRow
                    key={item.id}
                    className={
                      isDeleting ? "bg-red-50/60 opacity-60" : undefined
                    }
                  >
                    <TableCell>
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.imageUrl}
                          alt={item.title || "AI Explore"}
                          className="h-12 w-20 rounded-md object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-20 items-center justify-center rounded-md bg-slate-100">
                          <ImageIcon className="h-5 w-5 text-slate-400" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-slate-700">
                      <span className="line-clamp-2 max-w-[220px]">
                        {item.title || (
                          <span className="text-slate-400">Untitled</span>
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      <span className="line-clamp-2 max-w-[160px]">
                        {item.creator?.name || "NA"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={item.isPublished ? "default" : "outline"}
                        className={
                          item.isPublished
                            ? "bg-emerald-500 hover:bg-emerald-500"
                            : "text-slate-500"
                        }
                      >
                        {item.isPublished ? "Published" : "Unpublished"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </TableCell>
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
                          <DropdownMenuItem onClick={() => onEdit(item)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onPublish(item)}>
                            <UploadCloud
                              className={`mr-2 h-4 w-4 ${item.isPublished ? "rotate-180" : ""}`}
                            />
                            {item.isPublished ? "Unpublish" : "Publish"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => onDelete(item)}
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

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
          <span className="text-xs text-slate-400">
            Page {meta.page} of {meta.totalPages} ({meta.total} total)
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={meta.page <= 1 || activePage !== null}
              onClick={() => goToPage(meta.page - 1)}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ‹
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
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
