"use server";

import { publicFetch } from "@/lib/public-fetch";
import { serverFetch } from "@/lib/server-fetch";

export interface ISocialMedia {
  id: number;
  facebook: string | null;
  youtube: string | null;
  instagram: string | null;
  twitter: string | null;
}
export interface ISocialMediaPublic {
  id: number;
  facebook: string | null;
  youtube: string | null;
  instagram: string | null;
  twitter: string | null;
}
interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
interface IApiResponsePublic<T> {
  success: boolean;
  message: string;
  data: T;
}

// ─── Public — footer এ use করো ────────────────────────────────────────────────

export const getSocialMedia = async (): Promise<ISocialMediaPublic | null> => {
  try {
    const res = await publicFetch.get("/settings/social-media");
    const json: IApiResponsePublic<ISocialMediaPublic> = await res.json();
    if (!res.ok || !json.success) return null;
    return json.data;
  } catch {
    return null;
  }
};

// ─── Admin — create + update একসাথে (upsert) ─────────────────────────────────

export const saveSocialMedia = async (
  payload: Partial<Omit<ISocialMedia, "id">>,
): Promise<ISocialMedia> => {
  const res = await serverFetch.post("/settings/social-media", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json: IApiResponse<ISocialMedia> = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to save social media");
  }
  return json.data;
};
