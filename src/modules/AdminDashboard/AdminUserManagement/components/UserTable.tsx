"use client";

import {
  TUserItem,
  TUserMeta,
} from "@/types/adminUserManagement/adminUserManagement.interface";
import { Eye, Loader2, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import {
  ROLE_STYLE,
  STATUS_STYLE,
  USER_ROLES,
  USER_STATUSES,
} from "../constants/adminUserManagement.constants";
import { DeleteIcon, UserAvatar, UserBadge } from "./UserUiElements";

// ─── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  users: TUserItem[];
  meta: TUserMeta;
  isPending: boolean;
  deletingUserId: number | null;
  editingRole: number | null;
  editingStatus: number | null;
  onEditRole: (userId: number) => void;
  onEditStatus: (userId: number) => void;
  onRoleChange: (user: TUserItem, role: string) => void;
  onStatusChange: (user: TUserItem, status: string) => void;
  onDelete: (user: TUserItem) => void;
  onViewActivity: (user: TUserItem) => void;
}

// ─── Page Numbers Helper ───────────────────────────────────────────────────────

const getPageNumbers = (current: number, total: number) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3)
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
};

// ─── Component ─────────────────────────────────────────────────────────────────

export default function UserTable({
  users,
  meta,
  isPending,
  deletingUserId,
  editingRole,
  editingStatus,
  onEditRole,
  onEditStatus,
  onRoleChange,
  onStatusChange,
  onDelete,
  onViewActivity,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [activePage, setActivePage] = useState<number | null>(null);

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    setActivePage(page);
    startTransition(() => {
      router.push(`?${params.toString()}`);
      setActivePage(null);
    });
  };

  const isTableLoading = isPending || activePage !== null;

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* ─── Loading Overlay ───────────────────────────────────────────────── */}
      {isTableLoading && (
        <div
          role="status"
          aria-live="polite"
          aria-busy="true"
          className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/60 backdrop-blur-[2px]"
        >
          <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 shadow-md ring-1 ring-slate-200">
            <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
            <span className="text-sm font-medium text-slate-600">
              Loading...
            </span>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100">
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-16">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                      <Users className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700">
                      No Users Found
                    </h3>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-400">
                      There are currently no users available in the system.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const isDeleting = deletingUserId === user.id;

                return (
                  <tr
                    key={user.id}
                    className={`border-b border-slate-100 transition-colors ${
                      isDeleting
                        ? "bg-red-50/60 opacity-60"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <td className="px-2 md:px-4 py-3">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          name={user.name}
                          photo={user.profilePicture ?? null}
                        />
                        <span className="font-medium text-slate-700 line-clamp-2 break-words max-w-[120px] sm:max-w-[180px]">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{user.phone || "NA"}</td>
                    <td className="px-4 py-3">{user.email || "NA"}</td>
                    <td className="px-4 py-3">
                      {editingRole === user.id ? (
                        <select
                          autoFocus
                          defaultValue={user.userRole}
                          onChange={(e) => onRoleChange(user, e.target.value)}
                          className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                        >
                          {USER_ROLES.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <button onClick={() => onEditRole(user.id)}>
                          <UserBadge
                            label={user.userRole}
                            styleClass={
                              ROLE_STYLE[user.userRole] ||
                              "bg-slate-100 text-slate-600"
                            }
                          />
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingStatus === user.id ? (
                        <select
                          autoFocus
                          defaultValue={user.userStatus}
                          onChange={(e) => onStatusChange(user, e.target.value)}
                          className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                        >
                          {USER_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <button onClick={() => onEditStatus(user.id)}>
                          <UserBadge
                            label={user.userStatus}
                            styleClass={
                              STATUS_STYLE[user.userStatus] ||
                              "bg-slate-100 text-slate-600"
                            }
                          />
                        </button>
                      )}
                    </td>

                    {/* ─── Delete Button / Spinner ───────────────────────── */}
                    {/* <td className="px-4 py-3">
                      {user.userRole !== "SUPER_ADMIN" && (
                        <button
                          disabled={isDeleting || isTableLoading}
                          onClick={() => onDelete(user)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
                        >
                          {isDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin text-red-400" />
                          ) : (
                            <DeleteIcon />
                          )}
                        </button>
                      )}
                    </td> */}

                    {/* ─── View / Delete Buttons ─────────────────────────────── */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {/* ✅ View Activity Icon */}
                        <button
                          onClick={() => onViewActivity(user)}
                          title="View device & location info"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {/* Delete Icon — existing logic same */}
                        {user.userRole !== "SUPER_ADMIN" && (
                          <button
                            disabled={isDeleting || isTableLoading}
                            onClick={() => onDelete(user)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
                          >
                            {isDeleting ? (
                              <Loader2 className="h-4 w-4 animate-spin text-red-400" />
                            ) : (
                              <DeleteIcon />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ─── Pagination ────────────────────────────────────────────────────── */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 px-2 md:px-4 py-3">
          <span className="text-xs text-slate-400">
            Showing {(meta.page - 1) * 10 + 1}–
            {Math.min(meta.page * 10, meta.total)} of {meta.total} users
          </span>

          <div className="flex items-center gap-1">
            {/* Prev */}
            <button
              disabled={!meta.hasPrevPage || activePage !== null}
              onClick={() => goToPage(meta.page - 1)}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Page Numbers */}
            {getPageNumbers(meta.page, meta.totalPages).map((page, idx) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="flex h-7 w-7 items-center justify-center text-xs text-slate-400"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  disabled={activePage !== null}
                  onClick={() => goToPage(page as number)}
                  className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-medium transition-colors disabled:cursor-not-allowed ${
                    page === meta.page
                      ? "bg-orange-500 text-white shadow-sm"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {activePage === page ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    page
                  )}
                </button>
              ),
            )}

            {/* Next */}
            <button
              disabled={!meta.hasNextPage || activePage !== null}
              onClick={() => goToPage(meta.page + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
