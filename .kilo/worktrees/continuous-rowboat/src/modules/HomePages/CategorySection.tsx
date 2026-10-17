"use client";

import {
  AudioLines,
  BatteryCharging,
  Bluetooth,
  Cable,
  Ear,
  Fan,
  Flower2,
  Headphones,
  Home,
  Smartphone,
  Speaker,
  Watch,
} from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

const categories = [
  {
    id: 1,
    title: "Adapters & Cables",
    icon: Cable,
    url: "/category/adapters-cables",
  },
  {
    id: 2,
    title: "Headsets",
    icon: Headphones,
    url: "/category/headsets",
  },
  {
    id: 3,
    title: "Home Appliances",
    icon: Home,
    url: "/category/home-appliances",
  },
  {
    id: 4,
    title: "Lifestyle",
    icon: Flower2,
    url: "/category/lifestyle",
  },
  {
    id: 5,
    title: "Neckbands",
    icon: AudioLines,
    url: "/category/neckbands",
  },
  {
    id: 6,
    title: "Phone Accessories",
    icon: Smartphone,
    url: "/category/phone-accessories",
  },
  {
    id: 7,
    title: "Powerbanks",
    icon: BatteryCharging,
    url: "/category/powerbanks",
  },
  {
    id: 8,
    title: "Rechargeable Fans",
    icon: Fan,
    url: "/category/rechargeable-fans",
  },
  {
    id: 9,
    title: "Smart Watches",
    icon: Watch,
    url: "/category/smart-watches",
  },
  {
    id: 10,
    title: "Speakers",
    icon: Speaker,
    url: "/category/speakers",
  },
  {
    id: 11,
    title: "TWS",
    icon: Bluetooth,
    url: "/category/tws",
  },
  {
    id: 12,
    title: "Wired Earphones",
    icon: Ear,
    url: "/category/wired-earphones",
  },
];

const CategorySection = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const isDown = useRef(false);
  const isDragging = useRef(false);

  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;

    isDown.current = true;
    isDragging.current = false;

    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !sliderRef.current) return;

    e.preventDefault();

    isDragging.current = true;

    const x = e.pageX - sliderRef.current.offsetLeft;

    const walk = (x - startX.current) * 1.5;

    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const stopDragging = () => {
    isDown.current = false;

    setTimeout(() => {
      isDragging.current = false;
    }, 50);
  };

  return (
    <section className="w-full bg-slate-100 py-0 md:py-8 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
          onTouchStart={() => {
            isDragging.current = false;
          }}
          onTouchMove={() => {
            isDragging.current = true;
          }}
          className="flex items-start gap-3 md:gap-5 overflow-x-auto px-3 md:px-4 scrollbar-hide select-none cursor-grab active:cursor-grabbing snap-x snap-mandatory"
        >
          {categories.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="flex flex-col items-center justify-center min-w-[95px] md:min-w-[120px] shrink-0 snap-start group"
              >
                <Link
                  href={item.url}
                  draggable={false}
                  onClick={(e) => {
                    if (isDragging.current) {
                      e.preventDefault();
                    }
                  }}
                  className="flex flex-col items-center"
                >
                  <div className="relative w-[78px] h-[78px] md:w-[92px] md:h-[92px]">
                    <div className="absolute inset-0 rounded-[32%] bg-white rotate-[7deg] shadow-md"></div>

                    <div className="relative z-10 flex h-full w-full items-center justify-center overflow-hidden rounded-[32%] border-[3px] md:border-[5px] border-white bg-white -rotate-[7deg] transition-all duration-300 group-hover:rotate-0 group-hover:scale-105">
                      <div className="flex h-[70%] w-[70%] items-center justify-center rounded-full bg-gray-100 transition-colors duration-300 group-hover:bg-orange-50">
                        <Icon
                          aria-hidden="true"
                          className="h-6 w-6 md:h-7 md:w-7 text-orange-500 pointer-events-none"
                          strokeWidth={1.75}
                        />
                      </div>
                    </div>
                  </div>

                  <h3 className="mt-3 md:mt-4 text-[12px] md:text-[15px] font-semibold text-gray-800 whitespace-nowrap text-center">
                    {item.title}
                  </h3>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
