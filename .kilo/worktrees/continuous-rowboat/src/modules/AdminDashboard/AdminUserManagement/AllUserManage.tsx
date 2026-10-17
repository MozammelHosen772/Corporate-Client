"use client";

import { clientActionErrorModal } from "@/lib/clientActionErrorModal";
import {
  changeUserRole,
  changeUserStatus,
  fetchUserLoginActivity,
  removeUser,
} from "@/services/adminUserManagement/adminUserManagement.service";
import {
  TLoginActivity,
  TUserItem,
  TUserMeta,
  TUserRole,
  TUserStatus,
} from "@/types/adminUserManagement/adminUserManagement.interface";
import { useCallback, useState, useTransition } from "react";
import { toast } from "sonner";
import ConfirmModal from "./components/ConfirmModal";
import UserActivityModal from "./components/UserActivityModal";
import UserFilters from "./components/UserFilters";
import UserTable from "./components/UserTable";

interface Props {
  users: TUserItem[];
  meta: TUserMeta;
}

export default function AdminAllUserManage({ users, meta }: Props) {
  const [isPending, startTransition] = useTransition();
  const [filterPending, setFilterPending] = useState(false);

  const isTableLoading = isPending || filterPending;

  const [editingRole, setEditingRole] = useState<number | null>(null);
  const [editingStatus, setEditingStatus] = useState<number | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

  const [confirmDelete, setConfirmDelete] = useState<TUserItem | null>(null);
  const [confirmRoleChange, setConfirmRoleChange] = useState<{
    user: TUserItem;
    role: TUserRole;
  } | null>(null);
  const [confirmStatusChange, setConfirmStatusChange] = useState<{
    user: TUserItem;
    status: TUserStatus;
  } | null>(null);
  // ─── Login Activity Modal ──────────────────────────────────────────────────
  const [activityUser, setActivityUser] = useState<TUserItem | null>(null);
  const [activities, setActivities] = useState<TLoginActivity[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const handleFilterPending = useCallback((pending: boolean) => {
    setFilterPending(pending);
  }, []);

  // ─── Role ──────────────────────────────────────────────────────────────────

  const handleRoleChange = (user: TUserItem, newRole: string) => {
    if (newRole === user.userRole) return setEditingRole(null);
    setConfirmRoleChange({ user, role: newRole as TUserRole });
    setEditingRole(null);
  };

  const confirmRoleChangeAction = () => {
    if (!confirmRoleChange) return;
    const { user, role } = confirmRoleChange;
    setConfirmRoleChange(null);

    startTransition(async () => {
      try {
        await changeUserRole(user.id, role);
        toast.success(`${user.name}'s role updated to ${role}`);
      } catch (error) {
        if (clientActionErrorModal(error)) return;
        toast.error(
          error instanceof Error ? error.message : "Failed to update role",
        );
      }
    });
  };

  // ─── Status ────────────────────────────────────────────────────────────────

  const handleStatusChange = (user: TUserItem, newStatus: string) => {
    if (newStatus === user.userStatus) return setEditingStatus(null);
    setConfirmStatusChange({ user, status: newStatus as TUserStatus });
    setEditingStatus(null);
  };

  const confirmStatusChangeAction = () => {
    if (!confirmStatusChange) return;
    const { user, status } = confirmStatusChange;
    setConfirmStatusChange(null);

    startTransition(async () => {
      try {
        await changeUserStatus(user.id, status);
        toast.success(`${user.name}'s status updated to ${status}`);
      } catch (error) {
        if (clientActionErrorModal(error)) return;
        toast.error(
          error instanceof Error ? error.message : "Failed to update status",
        );
      }
    });
  };

  // ─── Delete ────────────────────────────────────────────────────────────────

  const confirmDeleteAction = () => {
    if (!confirmDelete) return;
    const user = confirmDelete;
    setConfirmDelete(null);
    setDeletingUserId(user.id);

    startTransition(async () => {
      try {
        await removeUser(user.id);
        toast.success("User deleted successfully");
      } catch (error) {
        if (clientActionErrorModal(error)) return;
        toast.error(
          error instanceof Error ? error.message : "Failed to delete user",
        );
      } finally {
        setDeletingUserId(null);
      }
    });
  };
  const handleViewActivity = async (user: TUserItem) => {
    setActivityUser(user);
    setActivityLoading(true);

    try {
      const data = await fetchUserLoginActivity(user.id);
      setActivities(data);
    } catch (error) {
      if (clientActionErrorModal(error)) return;
      toast.error(
        error instanceof Error ? error.message : "Failed to load activity",
      );
      setActivityUser(null);
    } finally {
      setActivityLoading(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {confirmRoleChange && (
        <ConfirmModal
          message={
            <>
              Are you sure you want to change{" "}
              <span className="font-semibold text-orange-500">
                {confirmRoleChange.user.name || "this user"}
              </span>{" "}
              role to{" "}
              <span className="font-semibold text-orange-600">
                {confirmRoleChange.role}
              </span>
              ?
            </>
          }
          onConfirm={confirmRoleChangeAction}
          onCancel={() => setConfirmRoleChange(null)}
        />
      )}

      {confirmStatusChange && (
        <ConfirmModal
          message={
            <>
              Are you sure you want to change{" "}
              <span className="font-semibold text-orange-500">
                {confirmStatusChange.user.name || "this user"}
              </span>{" "}
              status to{" "}
              <span className="font-semibold text-orange-600">
                {confirmStatusChange.status}
              </span>
              ?
            </>
          }
          onConfirm={confirmStatusChangeAction}
          onCancel={() => setConfirmStatusChange(null)}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          message={
            <>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-orange-500">
                {confirmDelete.name || "this user"}
              </span>
              ?
            </>
          }
          onConfirm={confirmDeleteAction}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
      {activityUser && (
        <UserActivityModal
          userName={activityUser.name || "User"}
          userPhone={activityUser.phone}
          userEmail={activityUser.email}
          activities={activities}
          isLoading={activityLoading}
          onClose={() => setActivityUser(null)}
        />
      )}
      <UserFilters onPendingChange={handleFilterPending} />

      <UserTable
        users={users}
        meta={meta}
        isPending={isTableLoading}
        deletingUserId={deletingUserId}
        editingRole={editingRole}
        editingStatus={editingStatus}
        onEditRole={setEditingRole}
        onEditStatus={setEditingStatus}
        onRoleChange={handleRoleChange}
        onStatusChange={handleStatusChange}
        onDelete={setConfirmDelete}
        onViewActivity={handleViewActivity}
      />
    </>
  );
}
