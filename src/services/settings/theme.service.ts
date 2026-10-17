"use server";
import { publicFetch } from "@/lib/public-fetch";
import { serverFetch } from "@/lib/server-fetch";

export interface IThemeData {
  logoUrl: string;
  logoPublicId: string;
  faviconUrl: string;
  faviconPublicId: string;
  footerLogoUrl: string;
  footerLogoPublicId: string;
}

// ─── Admin Panel — Always Fresh ───────────────────────────────────────────────

export const getThemeSettings = async (): Promise<IThemeData> => {
  try {
    const res = await serverFetch.get("/settings/theme", {
      cache: "no-store",
    });
    if (!res.ok) return {} as IThemeData;
    const json = await res.json();
    if (!json.success) return {} as IThemeData;
    return json.data;
  } catch {
    return {} as IThemeData;
  }
};

// ─── Public Layout — 1 ঘণ্টা Cache ──────────────────────────────────────────

export const getPublicTheme = async (): Promise<IThemeData> => {
  try {
    const res = await publicFetch.get("/settings/theme", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return {} as IThemeData;
    const json = await res.json();
    if (!json.success) return {} as IThemeData;
    return json.data;
  } catch {
    return {} as IThemeData;
  }
};

// ─── Save ─────────────────────────────────────────────────────────────────────

export const saveThemeSettings = async (
  payload: Partial<IThemeData>,
): Promise<IThemeData> => {
  const res = await serverFetch.post("/settings/theme", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message || "Save ব্যর্থ হয়েছে।");
  }
  return json.data;
};
