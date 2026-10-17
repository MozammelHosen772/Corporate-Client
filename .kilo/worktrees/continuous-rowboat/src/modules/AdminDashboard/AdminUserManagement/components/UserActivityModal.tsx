"use client";

import { TLoginActivity } from "@/types/adminUserManagement/adminUserManagement.interface";
import { Laptop, Loader2, Smartphone, Tablet, X } from "lucide-react";

interface Props {
  userName: string;
  userPhone: string;
  userEmail: string;
  activities: TLoginActivity[];
  isLoading: boolean;
  onClose: () => void;
}

const DeviceIcon = ({ type }: { type: string | null }) => {
  if (type === "mobile") return <Smartphone className="h-3.5 w-3.5" />;
  if (type === "tablet") return <Tablet className="h-3.5 w-3.5" />;
  return <Laptop className="h-3.5 w-3.5" />;
};

const EVENT_STYLE: Record<string, string> = {
  register: "bg-emerald-100 text-emerald-700",
  login: "bg-blue-100 text-blue-700",
  google_login: "bg-orange-100 text-orange-700",
};

export default function UserActivityModal({
  userName,
  userPhone,
  userEmail,
  activities,
  isLoading,
  onClose,
}: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ─── Header ─────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-700">{userName}</h3>
            <p className="text-xs text-slate-400">{userPhone || userEmail}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ─── Body ───────────────────────────────────────── */}
        <div className="max-h-[70vh] overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
            </div>
          ) : activities.length === 0 ? (
            <p className="py-16 text-center text-sm text-slate-400">
              No login activity found for this user.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100 sticky top-0">
                  <th className="px-4 py-2.5 text-left whitespace-nowrap">
                    Event
                  </th>
                  <th className="px-4 py-2.5 text-left whitespace-nowrap">
                    Device
                  </th>
                  <th className="px-4 py-2.5 text-left whitespace-nowrap">
                    Browser / OS
                  </th>
                  <th className="px-4 py-2.5 text-left whitespace-nowrap">
                    Location
                  </th>
                  <th className="px-4 py-2.5 text-left whitespace-nowrap">
                    IP Address
                  </th>
                  <th className="px-4 py-2.5 text-left whitespace-nowrap">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr
                    key={activity.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase whitespace-nowrap ${
                          EVENT_STYLE[activity.eventType] ||
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {activity.eventType.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-slate-600 whitespace-nowrap">
                        <DeviceIcon type={activity.deviceType} />
                        {activity.deviceType || "desktop"}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                      {activity.browser} {activity.browserVersion} /{" "}
                      {activity.os} {activity.osVersion}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                      {activity.city || activity.country
                        ? [activity.city, activity.region, activity.country]
                            .filter(Boolean)
                            .join(", ")
                        : "Unknown"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                      {activity.ipAddress || "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                      {new Date(activity.createdAt).toLocaleString("en-US", {
                        timeZone: "Asia/Dhaka",
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
