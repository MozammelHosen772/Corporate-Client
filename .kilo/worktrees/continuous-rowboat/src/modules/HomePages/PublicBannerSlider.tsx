"use client";

import { SliderItem } from "@/services/settings/bannerSlider.service";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo, useCallback, useEffect, useState } from "react";

interface Props {
  centerSliders: SliderItem[];
  leftSliders: SliderItem[];
}

const SlideImage = memo(
  ({
    slider,
    priority,
    className,
    width,
    height,
    sizes,
  }: {
    slider: SliderItem;
    priority?: boolean;
    className?: string;
    width: number;
    height: number;
    sizes: string;
  }) => {
    const image = (
      <Image
        src={slider.imageUrl}
        alt={slider.title || "Hero Banner"}
        width={width}
        height={height}
        priority={priority}
        quality={75}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        placeholder="empty"
        sizes={sizes}
        className={className}
      />
    );

    if (slider.link) {
      return (
        <Link
          href={slider.link}
          prefetch={false}
          className="block w-full h-full"
        >
          {image}
        </Link>
      );
    }

    return image;
  },
);

SlideImage.displayName = "SlideImage";

export const PublicBannerSlider = ({ centerSliders, leftSliders }: Props) => {
  const [current, setCurrent] = useState(0);

  const hasLeft = leftSliders.length > 0;

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === centerSliders.length - 1 ? 0 : prev + 1));
  }, [centerSliders.length]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? centerSliders.length - 1 : prev - 1));
  }, [centerSliders.length]);

  useEffect(() => {
    if (centerSliders.length <= 1) return;

    const timer = setInterval(nextSlide, 5000);

    return () => clearInterval(timer);
  }, [centerSliders.length, nextSlide]);

  if (!centerSliders.length && !leftSliders.length) {
    return null;
  }

  return (
    <section
      aria-label="Hero Banner"
      className="w-full bg-slate-100  py-6 px-2"
    >
      <div className="max-w-[1400px] mx-auto">
        <div
          className={`grid grid-cols-1 gap-3 ${
            hasLeft ? "lg:grid-cols-12" : ""
          }`}
        >
          {centerSliders.length > 0 && (
            <div
              className={`relative overflow-hidden rounded-lg ${
                hasLeft ? "lg:col-span-9" : "w-full"
              }`}
            >
              <div
                className="flex transition-transform duration-700 ease-in-out will-change-transform"
                style={{
                  transform: `translate3d(-${current * 100}%,0,0)`,
                }}
              >
                {centerSliders.map((slider, index) => (
                  <div key={slider.id} className="min-w-full">
                    <SlideImage
                      slider={slider}
                      priority={index === 0}
                      width={1800}
                      height={700}
                      sizes="(max-width:768px) 100vw, 75vw"
                      className="w-full h-[180px] md:h-[420px] object-cover"
                    />
                  </div>
                ))}
              </div>

              {centerSliders.length > 1 && (
                <>
                  <button
                    aria-label="Previous Slide"
                    onClick={prevSlide}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-orange-600 text-white flex items-center justify-center"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button
                    aria-label="Next Slide"
                    onClick={nextSlide}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-orange-600 text-white flex items-center justify-center"
                  >
                    <ChevronRight size={18} />
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {centerSliders.map((_, index) => (
                      <button
                        key={index}
                        aria-label={`Slide ${index + 1}`}
                        onClick={() => setCurrent(index)}
                        className={`h-2 rounded-full transition-all ${
                          current === index
                            ? "w-7 bg-orange-500"
                            : "w-2 bg-white/70"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {hasLeft && (
            <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-1 gap-2">
              {leftSliders.slice(0, 2).map((slider, index) => (
                <div
                  key={slider.id}
                  className="overflow-hidden rounded-lg h-[90px] md:h-[202px]"
                >
                  <SlideImage
                    slider={slider}
                    priority={index === 0}
                    width={600}
                    height={300}
                    sizes="(max-width:768px) 50vw, 25vw"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}

              {leftSliders.length === 1 && (
                <div className="rounded-lg bg-slate-100 h-[90px] md:h-[202px]" />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
