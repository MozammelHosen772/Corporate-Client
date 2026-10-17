import { useTheme } from "@/contexts/ThemeContext";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { categories } from "../constants/navdata";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function MobileCategoryDrawer({ open, onClose }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { theme } = useTheme();

  // close on desktop
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleResize = () => {
      if (mediaQuery.matches) onClose();
    };
    handleResize();
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, [onClose]);

  if (!open) return null;

  const handleClose = () => {
    setActiveCategory(null);
    onClose();
  };

  const handleBack = () => setActiveCategory(null);

  const activeCategoryData = categories.find((c) => c.label === activeCategory);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={handleClose}
        aria-hidden="true"
        className="fixed inset-0 z-40 bg-black/40"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Category menu"
        className="fixed left-0 top-0 z-50 h-full w-[65%] max-w-sm overflow-y-auto bg-white animate-slideLeft"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-2 py-1.5">
          <Link href="/" onClick={handleClose} className="shrink-0">
            <div className="relative h-10 w-[120px]">
              {theme?.logoUrl ? (
                <Image
                  src={theme.logoUrl}
                  alt="Taqwa Tech"
                  fill
                  priority
                  sizes="120px"
                  className="object-contain"
                />
              ) : (
                <span className="text-lg font-bold">Taqwa Tech</span>
              )}
            </div>
          </Link>

          <button
            onClick={handleClose}
            aria-label="Close category menu"
            className="rounded p-1 hover:bg-gray-100"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        {/* =========================
            LEVEL 1 : MAIN NAV + CATEGORIES
        ========================== */}
        {!activeCategory && (
          <div>
            <p className="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Categories
            </p>

            {categories.map((cat) => {
              const Icon = cat.icon;
              const hasChildren = !!cat.children?.length;

              return (
                <div
                  key={cat.label}
                  className="flex items-center justify-between border-b border-gray-200 px-3 py-2 hover:bg-gray-50"
                >
                  <Link
                    href={cat.href}
                    onClick={handleClose}
                    className="flex items-center gap-2.5 text-base font-medium text-gray-900"
                  >
                    <Icon
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-gray-500"
                    />
                    {cat.label}
                  </Link>

                  {hasChildren && (
                    <button
                      onClick={() => setActiveCategory(cat.label)}
                      aria-label={`Open ${cat.label} subcategories`}
                      className="rounded p-1 hover:bg-gray-100"
                    >
                      <ChevronRight
                        aria-hidden="true"
                        className="h-5 w-5 text-orange-500"
                      />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* =========================
            LEVEL 2 : SUB CATEGORY ITEMS
        ========================== */}
        {activeCategoryData && (
          <div>
            <div className="flex items-center justify-between border-b px-2 py-2">
              <button
                onClick={handleBack}
                aria-label="Go back"
                className="rounded hover:bg-gray-100"
              >
                <ChevronLeft aria-hidden="true" className="h-5 w-5" />
              </button>

              <Link
                href={activeCategoryData.href}
                onClick={handleClose}
                className="text-sm font-medium uppercase text-gray-500"
              >
                {activeCategoryData.label}
              </Link>

              <div className="w-5" />
            </div>

            <div className="space-y-1">
              {activeCategoryData.children?.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={handleClose}
                  className="flex w-full items-center border-b border-gray-200 px-3 py-2 hover:bg-gray-50"
                >
                  <span className="text-base text-black">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
