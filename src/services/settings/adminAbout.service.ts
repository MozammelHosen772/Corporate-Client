"use server";

import { publicFetch } from "@/lib/public-fetch";
import { serverFetch } from "@/lib/server-fetch";
import {
  IAbout,
  IAboutApiResponse,
  ICreateAboutPayload,
} from "@/types/adminSettings/adminAbout.interface";
import { revalidatePath, revalidateTag } from "next/cache";

// Get About (Admin)
export const getAbout = async (): Promise<IAbout | null> => {
  const res = await serverFetch.get("/settings/pages/about");
  const data: IAboutApiResponse<IAbout> = await res.json();

  if (!res.ok) throw new Error(data.message || "Failed to fetch about");

  return data.data ?? null;
};

//  Get About (Public)

export const getAboutPublic = async (): Promise<IAbout | null> => {
  const res = await publicFetch.get("/settings/pages/public/about", {
    next: {
      tags: ["about"],
      revalidate: 3600,
    },
  });
  const data: IAboutApiResponse<IAbout> = await res.json();

  if (!res.ok) throw new Error(data.message || "Failed to fetch about");

  return data.data ?? null;
};

//  Upsert About

export const upsertAbout = async (
  payload: ICreateAboutPayload,
): Promise<IAbout> => {
  const res = await serverFetch.post("/settings/pages/about", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data: IAboutApiResponse<IAbout> = await res.json();

  if (!res.ok) throw new Error(data.message || "Failed to save about");
  revalidateTag("about", "max");
  revalidatePath("/about");
  return data.data;
};
// Delete about
export const deleteAbout = async (): Promise<void> => {
  const res = await serverFetch.delete("/settings/pages/about");

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to delete about");
  }

  revalidateTag("about", "max");
  revalidatePath("/about");
};
