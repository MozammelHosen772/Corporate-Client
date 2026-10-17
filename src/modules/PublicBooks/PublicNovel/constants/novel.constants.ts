// ─── Novel-only page copy — no BookKind/Record generic এখন লাগবে না ────────
export const NOVEL_PAGE_COPY = {
  label: "Novel",
  plural: "Novels",
  collection: "Our Novel Collection",
  headline: "Stories worth reading",
  description:
    "Explore our collection of novels and discover stories written with imagination, emotion, and meaning.",
  empty: "No novels found",
  emptyHint:
    "There are no novels available at the moment. Please check back later for new stories.",
  readCta: "Read novel",
  back: "Back to novels",
  endTitle: "End of the novel",
  endHint: "Thank you for taking the time to read this story.",
  browse: "Browse more novels",
  coverLine: "A story to remember",
} as const;

export type NovelPageCopy = typeof NOVEL_PAGE_COPY;
