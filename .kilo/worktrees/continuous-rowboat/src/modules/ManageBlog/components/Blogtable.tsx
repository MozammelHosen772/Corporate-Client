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
import { TBlog, TBlogMeta } from "@/services/blog/blog.service";
import { Eye, MoreVertical, Pencil, Send, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import BlogTablePagination from "./BlogTablePagination";

interface Props {
  blogs: TBlog[];
  meta: TBlogMeta;
  isPending: boolean;
  onTogglePublish: (blog: TBlog) => void;
  onDelete: (blog: TBlog) => void;
}

export default function BlogTable({
  blogs,
  meta,
  isPending,
  onTogglePublish,
  onDelete,
}: Props) {
  return (
    <div
      className={`rounded-xl border bg-white overflow-hidden transition-opacity ${
        isPending ? "opacity-50" : "opacity-100"
      }`}
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
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
              <TableCell
                colSpan={7}
                className="h-32 text-center text-slate-400"
              >
                No blog posts found.
              </TableCell>
            </TableRow>
          ) : (
            blogs.map((blog) => (
              <TableRow key={blog.id}>
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
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
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
                    ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/blog/${blog.slug}`} target="_blank">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/admin/dashboard/all-blog-management/${blog.id}/edit`}
                            className="gap-2"
                          >
                            <Pencil className="h-4 w-4" /> Edit
                          </Link>
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
            ))
          )}
        </TableBody>
      </Table>

      <BlogTablePagination
        currentPage={meta.page}
        totalPages={meta.totalPages}
      />
    </div>
  );
}
