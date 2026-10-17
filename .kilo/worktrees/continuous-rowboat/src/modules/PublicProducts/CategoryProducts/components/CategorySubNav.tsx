"use client";

import { ICategoryNodeInfo } from "@/services/products/category.service";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface Props {
  categoryNode: ICategoryNodeInfo;
}

export default function CategorySubNav({ categoryNode }: Props) {
  const { breadcrumb, children } = categoryNode;

  return (
    <div className="bg-white rounded-lg shadow-sm p-2 md:p-4 mb-2">
      {/* Breadcrumb */}
      <div className="flex items-center flex-wrap gap-1 text-sm mb-1.5 md:mb-2">
        {breadcrumb.map((item, i) => (
          <span key={item.slug} className="flex items-center gap-1">
            <Link
              href={`/category/${item.slug}`}
              className={`hover:text-orange-600 transition-colors ${
                i === breadcrumb.length - 1
                  ? "text-gray-900 font-semibold"
                  : "text-gray-500"
              }`}
            >
              {item.label}
            </Link>
            {i < breadcrumb.length - 1 && (
              <ChevronRight size={14} className="text-gray-300" />
            )}
          </span>
        ))}
      </div>

      {/* Sub-category chips */}
      {children.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {children.map((child) => (
            <Link
              key={child.slug}
              href={`/category/${child.slug}`}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 transition-colors"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
