"use server";
import { serverFetch } from "@/lib/server-fetch";

export type ResourceType = "image" | "video" | "raw";

export interface IUploadedMedia {
  url: string;
  publicId: string;
  resourceType: ResourceType;
  // mediaType: "image" | "video" | "pdf"; // ✅ নতুন
}

interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const endpointMap = {
  image: "/media/upload-image",
  video: "/media/upload-video",
  pdf: "/media/upload-pdf",
  mixed: "/media/upload-mixed",
};

// ─────────────────────────────────────────────
// Upload
// ─────────────────────────────────────────────

export const uploadMedia = async (
  formData: FormData,
  type: "image" | "video" | "pdf" | "mixed",
): Promise<IUploadedMedia[]> => {
  const res = await serverFetch.post(endpointMap[type], {
    body: formData,
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to upload media");
  }

  return json.data;
};

// ─────────────────────────────────────────────
// Delete
// ─────────────────────────────────────────────

export const deleteMedia = async (
  publicId: string,
  resourceType: ResourceType,
): Promise<void> => {
  const res = await serverFetch.delete("/media/delete", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publicId, resourceType }),
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to delete media");
  }
};
