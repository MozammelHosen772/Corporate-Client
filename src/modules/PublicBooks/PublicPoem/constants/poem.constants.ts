// ─── Novel-only page copy — no BookKind/Record generic এখন লাগবে না ────────
export const POEM_PAGE_COPY = {
  label: "Poem",
  plural: "Poems",
  collection: "Our Poem Collection",
  headline: "Stories worth reading",
  description:
    "Explore our collection of Poems and discover stories written with imagination, emotion, and meaning.",
  empty: "No Poems found",
  emptyHint:
    "There are no Poems available at the moment. Please check back later for new stories.",
  readCta: "Read Poem",
  back: "Back to Poems",
  endTitle: "End of the Poem",
  endHint: "Thank you for taking the time to read this story.",
  browse: "Browse more Poems",
  coverLine: "A story to remember",
} as const;

export type PoemPageCopy = typeof POEM_PAGE_COPY;
