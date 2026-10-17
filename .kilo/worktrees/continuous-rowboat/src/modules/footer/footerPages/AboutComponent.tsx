"use client";

import TiptapRenderer from "@/shared/tiptapEditor/TiptapRenderer";
import { IAbout } from "@/types/adminSettings/adminAbout.interface";

interface Props {
  about: IAbout | null;
}

export default function AboutComponent({ about }: Props) {
  if (!about) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground text-sm">
          No content available yet.
        </p>
      </section>
    );
  }

  return (
    <main>
      <section className=" py-6">
        <div className="max-w-[1400px] mx-auto px-2">
          <TiptapRenderer html={about.description} />
        </div>
      </section>

      {about.metaKeywords && (
        <section className="px-2 pb-6">
          <div className="max-w-[1160px] mx-auto flex items-center gap-4 flex-wrap">
            <span className="text-[11px] font-medium tracking-widest uppercase text-[#9e8878]">
              Topics
            </span>
            <div className="flex flex-wrap gap-2">
              {about.metaKeywords
                .split(",")
                .map((k) => k.trim())
                .filter(Boolean)
                .map((keyword) => (
                  <span
                    key={keyword}
                    className="text-[13px] text-[#c8773a] bg-[#f5e6d8] border border-[#c8773a]/25 px-4 py-1 rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
