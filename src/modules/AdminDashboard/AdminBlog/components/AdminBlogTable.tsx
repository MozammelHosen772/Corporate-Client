// "use client";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { IBlog, IBlogMeta } from "@/types/adminBlog.interface";
// import { Eye, MoreVertical, Pencil, Send, Trash2 } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import AdminBlogTablePagination from "./AdminBlogTablePagination";

// interface Props {
//   blogs: IBlog[];
//   meta: IBlogMeta;
//   isPending: boolean;
//   onTogglePublish: (blog: IBlog) => void;
//   onEdit: (blog: IBlog) => void;
//   onDelete: (blog: IBlog) => void;
// }

// export default function AdminBlogTable({
//   blogs,
//   meta,
//   isPending,
//   onTogglePublish,
//   onEdit,
//   onDelete,
// }: Props) {
//   return (
//     <div
//       className={`rounded-xl border bg-white overflow-hidden transition-opacity ${
//         isPending ? "opacity-50" : "opacity-100"
//       }`}
//     >
//       <Table>
//         <TableHeader>
//           <TableRow className="bg-slate-50">
//             <TableHead className="w-[80px]">Thumb</TableHead>
//             <TableHead>Title</TableHead>
//             <TableHead>Category</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Views</TableHead>
//             <TableHead>Published</TableHead>
//             <TableHead className="text-right">Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {blogs.length === 0 ? (
//             <TableRow>
//               <TableCell
//                 colSpan={7}
//                 className="h-32 text-center text-slate-400"
//               >
//                 No blog posts found.
//               </TableCell>
//             </TableRow>
//           ) : (
//             blogs.map((blog) => (
//               <TableRow key={blog.id}>
//                 <TableCell>
//                   {blog.thumbnail ? (
//                     <div className="relative h-10 w-14 overflow-hidden rounded-md">
//                       <Image
//                         src={blog.thumbnail}
//                         alt={blog.title}
//                         fill
//                         sizes="56px"
//                         className="object-cover"
//                       />
//                     </div>
//                   ) : (
//                     <div className="h-10 w-14 rounded-md bg-slate-100" />
//                   )}
//                 </TableCell>
//                 <TableCell className="max-w-[260px]">
//                   <p className="line-clamp-1 font-medium text-slate-800">
//                     {blog.title}
//                   </p>
//                   <p className="line-clamp-1 text-xs text-slate-400">
//                     /{blog.slug}
//                   </p>
//                 </TableCell>
//                 <TableCell>
//                   {blog.category ? (
//                     <Badge variant="secondary">{blog.category}</Badge>
//                   ) : (
//                     <span className="text-slate-300">—</span>
//                   )}
//                 </TableCell>
//                 <TableCell>
//                   <Badge
//                     variant={
//                       blog.status === "PUBLISHED" ? "default" : "outline"
//                     }
//                     className={
//                       blog.status === "PUBLISHED"
//                         ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
//                         : "text-slate-500"
//                     }
//                   >
//                     {blog.status === "PUBLISHED" ? "Published" : "Draft"}
//                   </Badge>
//                 </TableCell>
//                 <TableCell className="text-sm text-slate-500">
//                   {blog.views}
//                 </TableCell>
//                 <TableCell className="text-sm text-slate-500">
//                   {blog.publishedAt
//                     ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
//                         month: "short",
//                         day: "numeric",
//                         year: "numeric",
//                       })
//                     : "—"}
//                 </TableCell>
//                 <TableCell className="text-right">
//                   <div className="flex items-center justify-end gap-1">
//                     <Link href={`/blog/${blog.slug}`} target="_blank">
//                       <Button variant="ghost" size="icon" className="h-8 w-8">
//                         <Eye className="h-4 w-4" />
//                       </Button>
//                     </Link>

//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" size="icon" className="h-8 w-8">
//                           <MoreVertical className="h-4 w-4" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end">
//                         <DropdownMenuItem
//                           onClick={() => onEdit(blog)}
//                           className="gap-2"
//                         >
//                           <Pencil className="h-4 w-4" /> Edit
//                         </DropdownMenuItem>
//                         <DropdownMenuItem
//                           onClick={() => onTogglePublish(blog)}
//                           className="gap-2"
//                         >
//                           <Send className="h-4 w-4" />
//                           {blog.status === "PUBLISHED"
//                             ? "Move to Draft"
//                             : "Publish"}
//                         </DropdownMenuItem>
//                         <DropdownMenuItem
//                           onClick={() => onDelete(blog)}
//                           className="gap-2 text-destructive focus:text-destructive"
//                         >
//                           <Trash2 className="h-4 w-4" /> Delete
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))
//           )}
//         </TableBody>
//       </Table>

//       <AdminBlogTablePagination
//         currentPage={meta.page}
//         totalPages={meta.totalPages}
//       />
//     </div>
//   );
// }

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
import { IBlog, IBlogMeta } from "@/types/adminBlog.interface";
import {
  Eye,
  FileQuestion,
  Loader2,
  MoreVertical,
  Pencil,
  Send,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

interface Props {
  blogs: IBlog[];
  meta: IBlogMeta;
  isPending: boolean;
  deletingId: number | null;
  onTogglePublish: (blog: IBlog) => void;
  onEdit: (blog: IBlog) => void;
  onDelete: (blog: IBlog) => void;
}

const getPageNumbers = (current: number, total: number) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3)
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
};

export default function AdminBlogTable({
  blogs,
  meta,
  isPending,
  deletingId,
  onTogglePublish,
  onEdit,
  onDelete,
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
              <TableHead className="w-[80px]">Thumb</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="px-4 py-16">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                      <FileQuestion className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700">
                      No blog posts found
                    </h3>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              blogs.map((blog) => {
                const isDeleting = deletingId === blog.id;
                return (
                  <TableRow
                    key={blog.id}
                    className={
                      isDeleting ? "bg-red-50/60 opacity-60" : undefined
                    }
                  >
                    <TableCell>
                      {blog.thumbnail ? (
                        <div className="relative h-10 w-14 overflow-hidden rounded-md">
                          <Image
                            src={blog.thumbnail}
                            alt={blog.title}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-14 rounded-md bg-slate-100" />
                      )}
                    </TableCell>
                    <TableCell className="max-w-[260px]">
                      <p className="line-clamp-1 font-medium text-slate-800">
                        {blog.title}
                      </p>
                      <p className="line-clamp-1 text-xs text-slate-400">
                        /{blog.slug}
                      </p>
                    </TableCell>
                    <TableCell>
                      {blog.category ? (
                        <Badge variant="secondary">{blog.category}</Badge>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          blog.status === "PUBLISHED" ? "default" : "outline"
                        }
                        className={
                          blog.status === "PUBLISHED"
                            ? "bg-emerald-500 hover:bg-emerald-500"
                            : "text-slate-500"
                        }
                      >
                        {blog.status === "PUBLISHED" ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {blog.views}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {blog.publishedAt
                        ? new Date(blog.publishedAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/blog/${blog.slug}`} target="_blank">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            disabled={isDeleting || isTableLoading}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
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
                            <DropdownMenuItem
                              onClick={() => onEdit(blog)}
                              className="gap-2"
                            >
                              <Pencil className="h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onTogglePublish(blog)}
                              className="gap-2"
                            >
                              <Send className="h-4 w-4" />
                              {blog.status === "PUBLISHED"
                                ? "Move to Draft"
                                : "Publish"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onDelete(blog)}
                              className="gap-2 text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
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
