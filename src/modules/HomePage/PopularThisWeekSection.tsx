import { getAllLyrics } from "@/services/book/lyrics.service";
import { getAllNovels } from "@/services/book/novel.service";
import { getAllOthers } from "@/services/book/other.service";
import { getAllPoems } from "@/services/book/poem.service";
import { TrendingUp } from "lucide-react";
import Link from "next/link";

interface PopularItem {
  id: string;
  title: string;
  views: number;
  href: string;
}

async function getPopularItems(): Promise<PopularItem[]> {
  const [novels, poems, lyrics, others] = await Promise.all([
    getAllNovels({ limit: 10, isPublished: true }),
    getAllPoems({ limit: 10, isPublished: true }),
    getAllLyrics({ limit: 10, isPublished: true }),
    getAllOthers({ limit: 10, isPublished: true }),
  ]);

  const all: PopularItem[] = [
    ...novels.data.map((n) => ({
      id: n.id,
      title: n.title,
      views: n.views ?? 0,
      href: `/books/novel/${n.id}`,
    })),
    ...poems.data.map((p) => ({
      id: p.id,
      title: p.title,
      views: p.views ?? 0,
      href: `/books/poem/${p.id}`,
    })),
    ...lyrics.data.map((l) => ({
      id: l.id,
      title: l.title,
      views: l.views ?? 0,
      href: `/books/lyrics/${l.id}`,
    })),
    ...others.data.map((o) => ({
      id: o.id,
      title: o.title,
      views: o.views ?? 0,
      href: `/books/other/${o.id}`,
    })),
  ];

  return all.sort((a, b) => b.views - a.views).slice(0, 5);
}

export default async function PopularThisWeekSection() {
  const items = await getPopularItems();
  if (items.length === 0) return null;

  return (
    <div className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Popular right now</h2>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fff1e6]">
          <TrendingUp className="h-4 w-4 text-[#f97316]" />
        </div>
      </div>

      <div className="space-y-1">
        {items.map((item, index) => (
          <Link
            key={`${item.href}-${item.id}`}
            href={item.href}
            className="group -mx-2 flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-slate-50"
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                index === 0
                  ? "bg-[#f97316] text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-2 text-sm font-medium text-slate-800 group-hover:text-[#f97316]">
                {item.title}
              </h3>
              <span className="mt-0.5 block text-xs text-slate-400">
                {item.views.toLocaleString()} views
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
