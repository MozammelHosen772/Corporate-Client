import { getAllLyrics } from "@/services/book/lyrics.service";
import { getAllNovels } from "@/services/book/novel.service";
import { getAllPoems } from "@/services/book/poem.service";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import SectionHeading from "./SectionHeading";

const SHELF_ACCENT: Record<string, { from: string; to: string; chip: string }> =
  {
    Novel: { from: "#f97316", to: "#0a1220", chip: "Novel" },
    Poem: { from: "#0ea5a4", to: "#0a1220", chip: "Poem" },
    Lyrics: { from: "#7c3aed", to: "#0a1220", chip: "Lyrics" },
  };

interface ShelfItem {
  id: string;
  title: string;
  kindLabel: string;
  href: string;
}

async function getShelfItems(): Promise<ShelfItem[]> {
  const [novels, poems, lyrics] = await Promise.all([
    getAllNovels({ limit: 4, isPublished: true }),
    getAllPoems({ limit: 4, isPublished: true }),
    getAllLyrics({ limit: 4, isPublished: true }),
  ]);

  return [
    ...novels.data.map((n) => ({
      id: n.id,
      title: n.title,
      kindLabel: "Novel",
      href: `/books/novel/${n.id}`,
    })),
    ...poems.data.map((p) => ({
      id: p.id,
      title: p.title,
      kindLabel: "Poem",
      href: `/books/poem/${p.id}`,
    })),
    ...lyrics.data.map((l) => ({
      id: l.id,
      title: l.title,
      kindLabel: "Lyrics",
      href: `/books/lyrics/${l.id}`,
    })),
  ];
}

export default async function LatestShelfSection() {
  const items = await getShelfItems();
  if (items.length === 0) return null;

  return (
    <div>
      <SectionHeading
        title="Latest from the shelf"
        actionLabel="Browse all"
        actionHref="/books/novel"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        {items.map((item) => {
          const accent = SHELF_ACCENT[item.kindLabel];
          return (
            <Link
              key={`${item.kindLabel}-${item.id}`}
              href={item.href}
              className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div
                className="relative flex h-36 flex-col justify-between p-5"
                style={{
                  background: `linear-gradient(160deg, ${accent.from}, ${accent.to})`,
                }}
              >
                <span className="w-fit rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/85 backdrop-blur">
                  {item.kindLabel}
                </span>
                <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-white">
                  {item.title}
                </h3>
              </div>
              <div className="flex items-center justify-between px-5 py-3.5 text-xs font-semibold text-[#f97316]">
                Read now
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
