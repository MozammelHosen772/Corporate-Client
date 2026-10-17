"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { IProduct } from "@/types/AdminProducts/AdminProducts.interface";
import { Eye, Loader2, Package, Pencil, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { IProductMeta } from "../AdminProductsList";

// ─── Page Numbers Helper ───────────────────────────────────────────────────────

const getPageNumbers = (current: number, total: number) => {
  if (total <= 3) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 2) return [1, 2, "...", total];
  if (current >= total - 1) return [1, "...", total - 1, total];
  return [1, "...", current, "...", total];
};

// ─── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  products: IProduct[];
  meta: IProductMeta;
  isPending: boolean;
  deletingProductId: string | null;
  onDelete: (product: IProduct) => void;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function ProductTable({
  products,
  meta,
  isPending,
  deletingProductId,
  onDelete,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [activePage, setActivePage] = useState<number | null>(null);
  const [navigatingId, setNavigatingId] = useState<string | null>(null);

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    setActivePage(page);
    startTransition(() => {
      router.push(`?${params.toString()}`);
      setActivePage(null);
    });
  };

  const handleNavigate = (product: IProduct, action: "view" | "edit") => {
    setNavigatingId(product.id);
    const path =
      action === "view"
        ? `/admin/dashboard/products/${product.id}/view`
        : `/admin/dashboard/products/${product.id}/edit`;
    startTransition(() => router.push(path));
  };

  const isTableLoading = isPending || !!navigatingId || activePage !== null;

  return (
    <Card className="relative overflow-hidden">
      {/* ─── Loading Overlay ───────────────────────────────────────────────── */}
      {isTableLoading && (
        <div
          role="status"
          aria-live="polite"
          aria-busy="true"
          className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/60 backdrop-blur-[2px]"
        >
          <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 shadow-md ring-1 ring-slate-200">
            <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
            <span className="text-sm font-medium text-slate-600">
              Loading...
            </span>
          </div>
        </div>
      )}

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold text-slate-600 text-xs tracking-wide uppercase">
                Product
              </TableHead>
              <TableHead className="font-semibold text-slate-600 text-xs tracking-wide uppercase">
                SKU
              </TableHead>
              <TableHead className="font-semibold text-slate-600 text-xs tracking-wide uppercase">
                Buying Price
              </TableHead>
              <TableHead className="font-semibold text-slate-600 text-xs tracking-wide uppercase">
                MRP Price
              </TableHead>
              <TableHead className="font-semibold text-slate-600 text-xs tracking-wide uppercase">
                Selling Price
              </TableHead>
              <TableHead className="font-semibold text-slate-600 text-xs tracking-wide uppercase">
                Status
              </TableHead>
              <TableHead className="font-semibold text-slate-600 text-xs tracking-wide uppercase text-right">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-16 text-slate-400"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="rounded-full bg-slate-100 p-4">
                      <Package className="h-8 w-8 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        No products found
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const isDeleting = deletingProductId === product.id;

                return (
                  <TableRow
                    key={product.id}
                    className={`transition-colors ${
                      isDeleting
                        ? "bg-red-50/60 opacity-60"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    {/* Name */}
                    <TableCell className="max-w-[220px]">
                      <p className="font-medium text-slate-700 line-clamp-2 break-words whitespace-normal">
                        {product.name}
                      </p>
                    </TableCell>

                    {/* SKU */}
                    <TableCell className="text-slate-500 text-sm font-mono">
                      {product.sku}
                    </TableCell>

                    {/* Buying Price */}
                    <TableCell className="text-slate-700 text-sm">
                      ৳ {product.buyingPrice.toFixed(2)}
                    </TableCell>

                    {/* Selling Price */}
                    <TableCell className="text-slate-800 text-sm font-medium">
                      ৳{" "}
                      {product.mrpPrice != null
                        ? product.mrpPrice.toFixed(2)
                        : "—"}
                    </TableCell>
                    {/* Selling Price */}
                    <TableCell className="text-slate-800 text-sm font-medium">
                      ৳{" "}
                      {product.sellingPrice != null
                        ? product.sellingPrice.toFixed(2)
                        : "—"}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge
                        className={
                          product.status === "ACTIVE"
                            ? "bg-green-100 text-green-700 hover:bg-green-100 rounded-full text-xs"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-100 rounded-full text-xs"
                        }
                      >
                        <span
                          aria-hidden="true"
                          className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${
                            product.status === "ACTIVE"
                              ? "bg-green-500"
                              : "bg-slate-400"
                          }`}
                        />
                        {product.status === "ACTIVE" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* View */}
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`View ${product.name}`}
                          className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                          disabled={isTableLoading || isDeleting}
                          onClick={() => handleNavigate(product, "view")}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {/* Edit */}
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Edit ${product.name}`}
                          className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-50"
                          disabled={isTableLoading || isDeleting}
                          onClick={() => handleNavigate(product, "edit")}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        {/* Delete */}
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Delete ${product.name}`}
                          disabled={isDeleting || isTableLoading}
                          onClick={() => onDelete(product)}
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {isDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin text-red-400" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* ─── Pagination ────────────────────────────────────────────────── */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Showing {(meta.page - 1) * meta.limit + 1}–
              {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
              products
            </p>

            <div className="flex items-center gap-1">
              {/* Prev */}
              <Button
                variant="outline"
                size="sm"
                aria-label="Previous page"
                className="h-8 w-8 p-0"
                onClick={() => goToPage(meta.page - 1)}
                disabled={meta.page === 1 || activePage !== null}
              >
                ‹
              </Button>

              {/* Page Numbers */}
              {getPageNumbers(meta.page, meta.totalPages).map((page, idx) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-${idx}`}
                    aria-hidden="true"
                    className="text-slate-400 text-sm px-1 select-none"
                  >
                    …
                  </span>
                ) : (
                  <Button
                    key={page}
                    variant={page === meta.page ? "default" : "outline"}
                    size="sm"
                    aria-label={`Page ${page}`}
                    aria-current={page === meta.page ? "page" : undefined}
                    disabled={activePage !== null}
                    onClick={() => goToPage(page as number)}
                    className={
                      page === meta.page
                        ? "h-8 min-w-[32px] bg-orange-500 hover:bg-orange-600 text-white border-0"
                        : "h-8 min-w-[32px]"
                    }
                  >
                    {page}
                  </Button>
                ),
              )}

              {/* Next */}
              <Button
                variant="outline"
                size="sm"
                aria-label="Next page"
                className="h-8 w-8 p-0"
                onClick={() => goToPage(meta.page + 1)}
                disabled={meta.page === meta.totalPages || activePage !== null}
              >
                ›
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
