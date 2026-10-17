"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllProducts } from "@/services/products/products.service";
import {
  getRelatedProducts,
  updateRelatedProducts,
} from "@/services/products/relatedProducts.service";
import { ISelectOption } from "@/types/AdminProducts/AdminProducts.interface";
import { ChevronRight, Loader2, Save, Search, X } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function RelatedProductsSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-36" />
        <Separator className="mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-80 max-w-full" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[0, 1].map((col) => (
            <div
              key={col}
              className="border border-slate-200 rounded-lg flex flex-col h-[420px] overflow-hidden"
            >
              {/* Panel header */}
              <div className="p-3 border-b border-slate-100 space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-8 w-full rounded-md" />
              </div>

              {/* Rows */}
              <div className="flex-1 px-3 py-2 space-y-1 overflow-hidden">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2"
                  >
                    <Skeleton
                      className="h-3.5 rounded"
                      style={{ width: `${55 + (i % 4) * 10}%` }}
                    />
                    <Skeleton className="h-3.5 w-3.5 rounded-full shrink-0 ml-2" />
                  </div>
                ))}
              </div>

              {/* Panel footer */}
              <div className="px-3 py-2 border-t border-slate-100 flex items-center justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── RelatedProductsInput ─────────────────────────────────────────────────────

function RelatedProductsInput({
  allProducts,
  selected,
  onChange,
}: {
  allProducts: ISelectOption[];
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  const [leftSearch, setLeftSearch] = useState("");
  const [rightSearch, setRightSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const available = allProducts.filter(
    (p) =>
      !selected.includes(p.value) &&
      p.label.toLowerCase().includes(leftSearch.toLowerCase()),
  );

  const selectedProducts = allProducts.filter(
    (p) =>
      selected.includes(p.value) &&
      p.label.toLowerCase().includes(rightSearch.toLowerCase()),
  );

  const add = (id: string) => onChange([...selected, id]);
  const remove = (id: string) => onChange(selected.filter((s) => s !== id));
  const addAllFiltered = () =>
    onChange([...new Set([...selected, ...available.map((p) => p.value)])]);
  const removeAll = () =>
    onChange(
      selected.filter((id) => !selectedProducts.find((p) => p.value === id)),
    );

  return (
    <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* ── Left Panel ── */}
      <div className="border border-slate-200 rounded-lg flex flex-col h-[420px] overflow-hidden">
        <div className="p-3 border-b border-slate-100 space-y-2">
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            All Products
          </p>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <Input
              placeholder="Search products..."
              className="pl-8 h-8 text-sm"
              value={leftSearch}
              onChange={(e) => setLeftSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {available.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">
              {leftSearch ? "No results found" : "All products selected"}
            </p>
          ) : (
            available.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => add(p.value)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 group transition-colors"
              >
                <span className="truncate text-left">{p.label}</span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-orange-400 shrink-0 ml-2 transition-colors" />
              </button>
            ))
          )}
        </div>

        <div className="px-3 py-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {allProducts.length - selected.length} available
          </span>
          <button
            type="button"
            onClick={addAllFiltered}
            className="text-[11px] text-orange-500 hover:text-orange-600 underline transition-colors"
          >
            Add all filtered
          </button>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="border border-slate-200 rounded-lg flex flex-col h-[420px] overflow-hidden">
        <div className="p-3 border-b border-slate-100 space-y-2">
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Related Products
          </p>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <Input
              placeholder="Search selected..."
              className="pl-8 h-8 text-sm"
              value={rightSearch}
              onChange={(e) => setRightSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {selectedProducts.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">
              {rightSearch ? "No results found" : "No products selected yet"}
            </p>
          ) : (
            selectedProducts.map((p) => (
              <div
                key={p.value}
                className="flex items-center justify-between px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 group transition-colors"
              >
                <span className="truncate">{p.label}</span>
                <button
                  type="button"
                  onClick={() => remove(p.value)}
                  className="h-5 w-5 rounded-full flex items-center justify-center text-slate-300 hover:text-red-400 hover:bg-red-50 shrink-0 ml-2 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="px-3 py-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {selected.length} selected
          </span>
          {selected.length > 0 && (
            <button
              type="button"
              onClick={removeAll}
              className="text-[11px] text-red-400 hover:text-red-500 underline transition-colors"
            >
              Remove all
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── RelatedProductsTab ───────────────────────────────────────────────────────

export default function RelatedProductsTab({
  productId,
}: {
  productId: string;
}) {
  const [allProducts, setAllProducts] = useState<ISelectOption[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: all }, related] = await Promise.all([
          getAllProducts({ limit: 1000 }),
          getRelatedProducts(productId),
        ]);
        setAllProducts(all.map((p) => ({ value: p.id, label: p.name })));
        setSelectedIds(related.map((r) => r.id));
      } catch {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [productId]);

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateRelatedProducts(productId, selectedIds);
        toast.success("Related products updated");
      } catch {
        toast.error("Failed to save");
      }
    });
  };

  if (loading) return <RelatedProductsSkeleton />;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium text-slate-700">
          Related Products
        </CardTitle>
        <Separator />
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-slate-500">
          Search and select products to show as related on this product page.
        </p>

        <RelatedProductsInput
          allProducts={allProducts}
          selected={selectedIds}
          onChange={setSelectedIds}
        />

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-slate-400">
            {selectedIds.length} product
            {selectedIds.length !== 1 ? "s" : ""} selected
          </span>
          <Button
            disabled={isPending}
            onClick={handleSave}
            className="min-w-[120px]"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
