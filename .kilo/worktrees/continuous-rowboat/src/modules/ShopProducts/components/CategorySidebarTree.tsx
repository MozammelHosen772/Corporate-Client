"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

interface TreeChild {
  id: string;
  label: string;
  slug: string;
}

interface TreeNode {
  id: string;
  label: string;
  slug: string;
  children?: TreeChild[];
}

interface Props {
  categories: TreeNode[];
  currentSlug: string;
}

export default function CategorySidebarTree({
  categories,
  currentSlug,
}: Props) {
  const searchParams = useSearchParams();

  const buildHref = (slug: string) => {
    const p = new URLSearchParams(searchParams.toString());
    p.delete("page");
    const qs = p.toString();
    return `/shop/${slug}${qs ? `?${qs}` : ""}`;
  };

  const initialOpen = categories.find(
    (c) =>
      c.slug === currentSlug ||
      c.children?.some((ch) => ch.slug === currentSlug),
  )?.id;

  const [openId, setOpenId] = useState<string | undefined>(initialOpen);

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">
        Product Categories
      </h3>

      <Link
        href="/shop"
        className={`mb-2 block py-1 text-sm font-medium transition-colors ${
          !currentSlug
            ? "font-bold text-orange-600"
            : "text-gray-700 hover:text-orange-600"
        }`}
      >
        All Products
      </Link>

      <ul className="thin-scrollbar max-h-72 space-y-0.5 overflow-y-auto pr-1">
        {categories.map((cat) => {
          const hasChildren = !!cat.children?.length;
          const isOpen = openId === cat.id;
          const isActiveParent = cat.slug === currentSlug;
          const isActiveChild = cat.children?.some(
            (c) => c.slug === currentSlug,
          );

          return (
            <li key={cat.id}>
              <div className="flex items-center justify-between">
                <Link
                  href={buildHref(cat.slug)}
                  className={`flex-1 py-1.5 text-sm transition-colors ${
                    isActiveParent || isActiveChild
                      ? "font-bold text-orange-600"
                      : "text-gray-600 hover:text-orange-600"
                  }`}
                >
                  {cat.label}
                </Link>
                {hasChildren && (
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? undefined : cat.id)}
                    aria-label={`Toggle ${cat.label}`}
                    className="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-600"
                  >
                    {isOpen ? (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5" />
                    )}
                  </button>
                )}
              </div>

              {hasChildren && isOpen && (
                <ul className="ml-3 mb-1 space-y-0.5 border-l border-gray-100 pl-3">
                  {cat.children!.map((sub) => {
                    const isActive = sub.slug === currentSlug;
                    return (
                      <li key={sub.id}>
                        <Link
                          href={buildHref(sub.slug)}
                          className={`block py-1 text-sm transition-colors ${
                            isActive
                              ? "font-bold text-orange-600"
                              : "text-gray-500 hover:text-orange-600"
                          }`}
                        >
                          {sub.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      <style jsx>{`
        .thin-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #e5e7eb transparent;
        }
        .thin-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .thin-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .thin-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e5e7eb;
          border-radius: 9999px;
        }
        .thin-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #d1d5db;
        }
      `}</style>
    </div>
  );
}
