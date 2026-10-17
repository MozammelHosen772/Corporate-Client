"use server";

import { serverFetch } from "@/lib/server-fetch";
import { TAdminDashboardStats } from "@/types/AdminDashboard/adminDashboard.interface";

export const getAdminDashboardStats =
  async (): Promise<TAdminDashboardStats> => {
    const response = await serverFetch.get("/dashboard", {
      next: { tags: ["admin-dashboard"], revalidate: 60 }, // 1 min cache
    });

    if (!response.ok) throw new Error("Failed to fetch dashboard stats");

    const result = await response.json();
    if (!result.success)
      throw new Error(result.message || "Failed to fetch dashboard stats");

    return result.data;
  };
