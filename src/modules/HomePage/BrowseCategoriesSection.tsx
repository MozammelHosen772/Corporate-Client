import { ArrowRight, BookText, Feather, Layers, Music } from "lucide-react";
import Link from "next/link";
import SectionHeading from "./SectionHeading";

const CATEGORIES = [
  {
    label: "Novel",
    description: "Long-form stories, chapter by chapter.",
    href: "/books/novel",
    icon: BookText,
  },
  {
    label: "Poem",
    description: "Lines written for rhythm and feeling.",
    href: "/books/poem",
    icon: Feather,
  },
  {
    label: "Lyrics",
    description: "Words meant to be sung, or nearly so.",
    href: "/books/lyrics",
    icon: Music,
  },
  {
    label: "Other",
    description: "Essays and writing that don't fit a shelf.",
    href: "/books/other",
    icon: Layers,
  },
];

export default function BrowseCategoriesSection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Browse by category" />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map(({ label, description, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#f97316]/40 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fff1e6]">
                <Icon className="h-5 w-5 text-[#f97316]" />
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-slate-900">
                  {label}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                  {description}
                </p>
              </div>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-[#f97316]">
                Browse
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
