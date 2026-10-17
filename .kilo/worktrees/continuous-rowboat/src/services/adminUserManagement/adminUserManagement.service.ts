"use server";

import { serverFetch } from "@/lib/server-fetch";
import {
  TActionResponse,
  TLoginActivity,
  TUserListResponse,
  TUserQueryParams,
} from "@/types/adminUserManagement/adminUserManagement.interface";
import { revalidatePath } from "next/cache";

const revalidateUsers = () =>
  revalidatePath("/admin/dashboard/all-users-management", "page");

export const fetchAllUsers = async (
  params: TUserQueryParams,
): Promise<TUserListResponse> => {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.role) query.set("role", params.role);
  if (params.status) query.set("status", params.status);
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.sortOrder) query.set("sortOrder", params.sortOrder);

  const response = await serverFetch.get(`/user?${query.toString()}`, {
    next: { tags: ["all-users"] },
  });

  if (!response.ok) throw new Error("Failed to fetch users");

  const result = await response.json();
  if (!result.success) throw new Error("Failed to fetch users");

  return {
    users: result.data ?? [],
    meta: result.meta ?? null,
  };
};

export const changeUserRole = async (
  userId: number,
  role: string,
): Promise<TActionResponse> => {
  const response = await serverFetch.patch(`/user/${userId}/role`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });

  const result = await response.json();
  if (!result.success)
    throw new Error(result.message || "Failed to update role");

  revalidateUsers();
  return result;
};

export const changeUserStatus = async (
  userId: number,
  status: string,
): Promise<TActionResponse> => {
  const response = await serverFetch.patch(`/user/${userId}/status`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  const result = await response.json();
  if (!result.success)
    throw new Error(result.message || "Failed to update status");

  revalidateUsers();
  return result;
};

export const removeUser = async (userId: number): Promise<TActionResponse> => {
  const response = await serverFetch.delete(`/user/${userId}`);

  const result = await response.json();
  if (!result.success)
    throw new Error(result.message || "Failed to delete user");

  revalidateUsers();
  return result;
};
// ✅ notun — user er device/location login activity fetch korার jonno
export const fetchUserLoginActivity = async (
  userId: number,
): Promise<TLoginActivity[]> => {
  const response = await serverFetch.get(`/user/${userId}/login-activity`);

  if (!response.ok) throw new Error("Failed to fetch login activity");

  const result = await response.json();
  if (!result.success)
    throw new Error(result.message || "Failed to fetch login activity");

  return result.data ?? [];
};
