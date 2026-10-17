// ─── Novel-only page copy — no BookKind/Record generic এখন লাগবে না ────────
export const LYRICS_PAGE_COPY = {
  label: "Lyrics",
  plural: "Lyricss",
  collection: "Our Lyrics Collection",
  headline: "Stories worth reading",
  description:
    "Explore our collection of Lyricss and discover stories written with imagination, emotion, and meaning.",
  empty: "No Lyricss found",
  emptyHint:
    "There are no Lyricss available at the moment. Please check back later for new stories.",
  readCta: "Read Lyrics",
  back: "Back to Lyricss",
  endTitle: "End of the Lyrics",
  endHint: "Thank you for taking the time to read this story.",
  browse: "Browse more Lyricss",
  coverLine: "A story to remember",
} as const;

export type LyricsPageCopy = typeof LYRICS_PAGE_COPY;
