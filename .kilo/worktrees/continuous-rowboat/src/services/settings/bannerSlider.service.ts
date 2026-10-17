"use server";

import { publicFetch } from "@/lib/public-fetch";
import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";

export type TPosition = "center" | "left";

export interface TSliderItem {
  id: number;
  title: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  position: TPosition;
  link: string;
}

export interface TSliderCreatePayload {
  title: string;
  isActive: boolean;
  position: TPosition;
  link: string;
  file: File;
}

export interface TApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface SliderItem {
  id: number;
  title: string;
  imageUrl: string;
  isActive: boolean;
  position: "center" | "left";
  link: string | null;
}

// ─── Public Hero Sliders (Cached) ────────────────────────────────────────────

export const getPublicHeroSliders = async (): Promise<SliderItem[] | null> => {
  try {
    const res = await publicFetch.get("/settings/slider", {
      next: {
        tags: ["hero-sliders"],
        revalidate: 300,
      },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    if (!data?.success) {
      return null;
    }

    return data.data ?? [];
  } catch (error) {
    return null;
  }
};

// ─── Get All Sliders (Admin - No Cache) ──────────────────────────────────────

export const getAllSliders = async (): Promise<TSliderItem[]> => {
  const res = await serverFetch.get("/settings/admin/slider", {
    cache: "no-store",
  });

  const data: TApiResponse<TSliderItem[]> = await res.json();

  if (!res.ok) throw new Error(data.message || "Failed to fetch sliders");
  return data.data ?? [];
};

// ─── Create Slider ───────────────────────────────────────────────────────────

export const createSlider = async (
  payload: TSliderCreatePayload,
): Promise<TSliderItem> => {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("isActive", String(payload.isActive));
  formData.append("position", payload.position);
  formData.append("link", payload.link);
  formData.append("file", payload.file);

  const res = await serverFetch.post("/settings/slider", {
    body: formData,
  });

  const data: TApiResponse<TSliderItem> = await res.json();

  if (!res.ok) throw new Error(data.message || "Failed to create slider");

  revalidateTag("hero-sliders", "max");

  return data.data;
};

// ─── Toggle Slider Status ────────────────────────────────────────────────────

export const toggleSliderStatus = async (
  sliderId: number,
): Promise<TSliderItem> => {
  const res = await serverFetch.patch(
    `/settings/slider/toggle-status/${sliderId}`,
  );

  const data: TApiResponse<TSliderItem> = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to toggle slider status");
  }

  revalidateTag("hero-sliders", "max");

  return data.data;
};

// ─── Delete Slider ───────────────────────────────────────────────────────────

export const deleteSlider = async (sliderId: number): Promise<void> => {
  const res = await serverFetch.delete(`/settings/slider/${sliderId}`);

  const data: TApiResponse<null> = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to delete slider");
  }
  revalidateTag("hero-sliders", "max");
};
