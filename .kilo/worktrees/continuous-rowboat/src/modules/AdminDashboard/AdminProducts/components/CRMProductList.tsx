"use client";

import { TCRMMeta, TCRMProduct } from "@/services/products/crm.service";
import { Package, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

interface Props {
  products: TCRMProduct[];
  meta: TCRMMeta;
}

const STOCK_STATUS = (stock: number) => {
  if (stock === 0)
    return {
      label: "Out of Stock",
      color: "text-rose-600 bg-rose-50 ring-rose-200",
    };
  if (stock <= 5)
    return {
      label: "Low Stock",
      color: "text-amber-600 bg-amber-50 ring-amber-200",
    };
  return {
    label: "In Stock",
    color: "text-emerald-600 bg-emerald-50 ring-emerald-200",
  };
};

export default function CRMProductList({ products, meta }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
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

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center">
        <p className="text-sm font-medium text-slate-500">No products found</p>
      </div>
    );
  }

  return (
    <div>
      <div
        className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${
          isPending ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        {products.map((product) => {
          const stockStatus = STOCK_STATUS(product.stock);
          return (
            <Link
              key={product.id}
              href={`/admin/dashboard/all-crm-management/crm-products/${product.id}`}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/60"
            >
              <div className="relative h-36 w-full bg-slate-50">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Package className="h-8 w-8 text-slate-300" />
                  </div>
                )}
              </div>

              <div className="p-4">
                <p className="line-clamp-1 text-sm font-semibold text-slate-800">
                  {product.name}
                </p>
                <p className="mt-0.5 font-mono text-[10px] text-slate-400">
                  {product.sku}
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${stockStatus.color}`}
                  >
                    {stockStatus.label} · {product.stock}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-medium text-orange-600">
                    <TrendingUp className="h-3 w-3" />
                    {product.totalSold} sold
                  </span>
                </div>

                <div className="mt-3 border-t border-slate-100 pt-2">
                  <p className="text-[10px] text-slate-400">Revenue</p>
                  <p className="text-sm font-bold text-slate-900">
                    ৳ {product.revenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {meta.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-1.5">
          <button
            disabled={meta.page <= 1 || activePage !== null}
            onClick={() => goToPage(meta.page - 1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
          >
            ←
          </button>
          <span className="px-3 text-xs text-slate-500">
            {activePage ?? meta.page} / {meta.totalPages}
          </span>
          <button
            disabled={meta.page >= meta.totalPages || activePage !== null}
            onClick={() => goToPage(meta.page + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
