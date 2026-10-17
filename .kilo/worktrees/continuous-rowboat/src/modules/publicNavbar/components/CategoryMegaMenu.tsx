"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Menu } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { categories, mainNavLinks } from "../constants/navdata";

const CLOSE_DELAY_MS = 150;

export function CategoryMegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerId = useId();

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setIsOpen(false), CLOSE_DELAY_MS);
  }, [cancelClose]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <nav
      aria-label="Product categories"
      className="relative border-b bg-white border-t"
    >
      <div className="mx-auto flex max-w-[1400px] items-center gap-2 px-1">
        <div
          ref={containerRef}
          className="relative py-1.5"
          onMouseEnter={() => {
            cancelClose();
            setIsOpen(true);
          }}
          onMouseLeave={scheduleClose}
        >
          <button
            id={triggerId}
            type="button"
            aria-haspopup="true"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((v) => !v)}
            className={cn(
              "flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition-all duration-200",
              isOpen
                ? "border-orange-500 bg-orange-50 text-orange-600"
                : "border-neutral-200 bg-white text-neutral-800 hover:border-orange-300 hover:bg-orange-50/60 hover:text-orange-600",
            )}
          >
            <Menu className="h-4 w-4" aria-hidden="true" />
            All Categories
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform duration-200",
                isOpen && "rotate-180",
              )}
              aria-hidden="true"
            />
          </button>

          {isOpen && (
            <ul
              role="menu"
              aria-labelledby={triggerId}
              className="absolute left-0 top-full z-50 mt-2 w-64 divide-y divide-neutral-100 rounded-lg border border-neutral-100 bg-white py-2 shadow-2xl ring-1 ring-black/5"
            >
              {categories.map((cat) => {
                const Icon = cat.icon;
                const hasChildren = !!cat.children?.length;

                return (
                  <li key={cat.label} role="none" className="group relative">
                    <Link
                      role="menuitem"
                      href={cat.href}
                      prefetch={false}
                      className="flex items-center justify-between gap-2 px-4 py-2.5 text-sm text-neutral-700 transition-colors group-hover:bg-orange-50 group-hover:text-orange-600"
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                        {cat.label}
                      </span>
                      {hasChildren && (
                        <ChevronRight
                          className="h-3.5 w-3.5 shrink-0"
                          aria-hidden="true"
                        />
                      )}
                    </Link>

                    {/* Submenu starts exactly at this row's top, like the reference image */}
                    {hasChildren && (
                      <div
                        role="menu"
                        aria-label={cat.label}
                        className="invisible absolute left-full top-0 z-50 w-64 -translate-x-1 divide-y divide-neutral-100 rounded-lg border border-neutral-100 bg-white py-2 opacity-0 shadow-2xl ring-1 ring-black/5 transition-all duration-150 group-hover:visible group-hover:translate-x-0 group-hover:opacity-100"
                      >
                        {cat.children!.map((sub) => (
                          <Link
                            key={sub.label}
                            role="menuitem"
                            href={sub.href}
                            prefetch={false}
                            className="block px-5 py-2.5 text-sm text-neutral-600 transition-colors hover:bg-orange-50 hover:text-orange-600"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <ul className="flex items-center gap-1">
          {mainNavLinks.map((link) => {
            const isPreOrder = link.label === "Pre Order";
            return (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={cn(
                    "block rounded-md px-3.5 py-2 text-sm transition-colors",
                    isPreOrder
                      ? "font-semibold text-orange-600 hover:bg-orange-50"
                      : "font-medium text-neutral-700 hover:bg-neutral-50 hover:text-orange-600",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
