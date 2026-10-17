export const USER_ROLES = [
  "USER",
  "ADMIN",
  "SUPER_ADMIN",
  "MODERATOR",
] as const;

export const USER_STATUSES = [
  "ACTIVE",
  "INACTIVE",
  "SUSPENDED",
  "DELETED",
] as const;

export const USER_LIMIT = 10;

export const ROLE_STYLE: Record<string, string> = {
  SUPER_ADMIN: "bg-violet-100 text-violet-700",
  ADMIN: "bg-blue-100 text-blue-700",
  MODERATOR: "bg-amber-100 text-amber-700",
  USER: "bg-slate-100 text-slate-600",
};

export const STATUS_STYLE: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  INACTIVE: "bg-slate-100 text-slate-500",
  SUSPENDED: "bg-orange-100 text-orange-700",
  DELETED: "bg-red-100 text-red-600",
};
