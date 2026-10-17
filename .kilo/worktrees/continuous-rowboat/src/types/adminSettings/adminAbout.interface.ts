export interface IAbout {
  id: string;
  description: string; // TipTap HTML content
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string; // "seo, shop, bd" — comma-separated string
  createdAt?: string;
  updatedAt?: string;
}

// ─── Payloads ─────────────────────────────────────────────────────────────────

/** POST /settings/pages/about — নতুন তৈরি করার সময় */
export interface ICreateAboutPayload {
  description: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string; // "seo, shop, bd" — join করে পাঠাও
}

/** PATCH /settings/pages/about/:id — আপডেট করার সময় */
export interface IUpdateAboutPayload {
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

// ─── API Response wrapper ─────────────────────────────────────────────────────

export interface IAboutApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export type IAboutResponse = IAboutApiResponse<IAbout>;
export type IAboutListResponse = IAboutApiResponse<IAbout[]>;
