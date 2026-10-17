export type TUserRole = "USER" | "ADMIN" | "SUPER_ADMIN" | "MODERATOR";

export type TUserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "DELETED";

export interface TUserItem {
  id: number;
  name: string | null;
  email: string;
  phone: string;
  profilePicture?: string | null;
  userRole: TUserRole;
  userStatus: TUserStatus;
  createdAt: string;
}

export interface TUserMeta {
  total: number;
  page: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

export interface TUserListResponse {
  users: TUserItem[];
  meta: TUserMeta;
}

export interface TUserQueryParams {
  page: number;
  limit: number;
  search?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface TActionResponse {
  success: boolean;
  message?: string;
}
// src/types/adminUserManagement/adminUserManagement.interface.ts e add koro
export interface TLoginActivity {
  id: number;
  ipAddress: string | null;
  userAgent: string | null;
  deviceType: string | null;
  browser: string | null;
  browserVersion: string | null;
  os: string | null;
  osVersion: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  eventType: string;
  createdAt: string;
}
