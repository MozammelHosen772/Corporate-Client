"use client";

import { IPublicFlashSaleProduct } from "@/services/products/flashSaleProducts.service";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CountdownTimer } from "./CountdownTimer";
import { FlashSaleCard } from "./FlashSaleCard";

const CARD_WIDTH = 297;

function ArrowButton({
  dir,
  disabled,
  onClick,
}: {
  dir: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={
        dir === "left" ? "Scroll products left" : "Scroll products right"
      }
      className="w-8 h-8 rounded-lg border flex items-center justify-center transition-all duration-150
      border-orange-400 text-orange-500 bg-orange-50
      hover:bg-orange-500 hover:text-white hover:border-orange-500
      disabled:opacity-25 disabled:cursor-not-allowed
      disabled:hover:bg-orange-50 disabled:hover:text-orange-500 disabled:hover:border-orange-400"
    >
      {dir === "left" ? (
        <ChevronLeft className="w-4 h-4" />
      ) : (
        <ChevronRight className="w-4 h-4" />
      )}
    </button>
  );
}

interface Props {
  initialProducts: IPublicFlashSaleProduct[];
  nextChangeAt: string | null;
}

export default function FlashSaleProductsClient({ initialProducts }: Props) {
  const [products] = useState(initialProducts);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;

    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;

    if (!el) return;

    updateArrows();

    el.addEventListener("scroll", updateArrows, {
      passive: true,
    });

    const ro = new ResizeObserver(updateArrows);

    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
    };
  }, [updateArrows]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "right" ? CARD_WIDTH * 3 : -CARD_WIDTH * 3,
      behavior: "smooth",
    });
  };
  return (
    <section
      aria-label="Flash sale products"
      className="w-full  border-b border-gray-100 py-5 px-2 md:px-4"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <header className="px-2 md:px-3 py-3.5 border-b border-gray-100">
            {/* Desktop */}
            <div className="hidden md:flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-50 shrink-0">
                  <Zap
                    className="w-4 h-4 text-orange-500 fill-orange-500"
                    aria-hidden="true"
                  />
                </div>

                <span className="text-[13px] font-extrabold tracking-widest uppercase text-white bg-gradient-to-r from-orange-500 to-red-500 px-4 py-1.5 rounded-full shrink-0">
                  Flash Sale
                </span>

                <h2 className="sr-only">
                  Flash Sale — Best prices, limited time
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <CountdownTimer />

                <div className="flex gap-1.5">
                  <ArrowButton
                    dir="left"
                    disabled={!canScrollLeft}
                    onClick={() => scroll("left")}
                  />

                  <ArrowButton
                    dir="right"
                    disabled={!canScrollRight}
                    onClick={() => scroll("right")}
                  />
                </div>
              </div>
            </div>

            {/* Mobile */}
            <div className="flex flex-col gap-2 md:hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-orange-50 shrink-0">
                    <Zap
                      className="w-3.5 h-3.5 text-orange-500 fill-orange-500"
                      aria-hidden="true"
                    />
                  </div>

                  <span className="text-[11px] font-extrabold tracking-widest uppercase text-white bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1 rounded-full">
                    Flash Sale
                  </span>

                  <h2 className="sr-only">
                    Flash Sale — Best prices, limited time
                  </h2>
                </div>

                <div className="flex gap-1.5">
                  <ArrowButton
                    dir="left"
                    disabled={!canScrollLeft}
                    onClick={() => scroll("left")}
                  />

                  <ArrowButton
                    dir="right"
                    disabled={!canScrollRight}
                    onClick={() => scroll("right")}
                  />
                </div>
              </div>

              <CountdownTimer />
            </div>
          </header>

          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto scroll-smooth px-2 md:px-3 py-4
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden"
          >
            {products.map((item) => (
              <FlashSaleCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
