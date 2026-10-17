// ─── Novel-only page copy — no BookKind/Record generic এখন লাগবে না ────────
export const OTHER_PAGE_COPY = {
  label: "Other",
  plural: "Others",
  collection: "Our Other Collection",
  headline: "Stories worth reading",
  description:
    "Explore our collection of Others and discover stories written with imagination, emotion, and meaning.",
  empty: "No Others found",
  emptyHint:
    "There are no Others available at the moment. Please check back later for new stories.",
  readCta: "Read Other",
  back: "Back to Others",
  endTitle: "End of the Other",
  endHint: "Thank you for taking the time to read this story.",
  browse: "Browse more Others",
  coverLine: "A story to remember",
} as const;

export type OtherPageCopy = typeof OTHER_PAGE_COPY;
