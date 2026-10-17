/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import LogoutButton from "@/shared/LogOutButton";
import { UserInfo } from "@/types/user.interface";
import { Settings, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface UserDropdownProps {
  userInfo?: UserInfo | null;
}

const ROLE_CONFIG = {
  super_admin: { label: "Super Admin", color: "bg-purple-100 text-purple-700" },
  admin: { label: "Admin", color: "bg-blue-100 text-blue-700" },
  moderator: { label: "Moderator", color: "bg-amber-100 text-amber-700" },
  user: { label: "Active User", color: "bg-emerald-100 text-emerald-700" },
} as const;

const MENU_ITEMS = [
  { href: "/account/my-profile", label: "Profile", icon: User },
  {
    href: "/account/change-password",
    label: "Change Password",
    icon: Settings,
  },
];

const UserDropdown = ({ userInfo }: UserDropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { name = "User", phone = "", role = "user" } = userInfo || {};

  const safeRole = (
    typeof role === "string" ? role.toLowerCase() : "user"
  ) as keyof typeof ROLE_CONFIG;

  const roleConfig = ROLE_CONFIG[safeRole] ?? ROLE_CONFIG.user;

  const profilePicture = (userInfo as any)?.profilePicture as
    | string
    | undefined;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (!userInfo) return null;

  return (
    <div ref={ref} className="relative z-50">
      {/* ── Trigger ── */}
      <button
        aria-label="Open user menu"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((prev) => !prev)}
        onMouseEnter={() => setOpen(true)}
        className="group relative flex items-center justify-center rounded-full p-[3px] transition-all duration-200 hover:ring-2 hover:ring-amber-400/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
      >
        <AvatarImage profilePicture={profilePicture} name={name} size={44} />
        <span
          aria-hidden="true"
          className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 shadow-sm"
        />
      </button>

      {/* ── Dropdown Panel ── */}
      <div
        role="menu"
        aria-label="User menu"
        onMouseLeave={() => setOpen(false)}
        className={[
          "absolute right-0 top-full mt-2 w-72 origin-top-right overflow-hidden",
          "rounded-2xl border border-gray-100 bg-white shadow-xl shadow-black/[0.08]",
          "transition-all duration-200 ease-out",
          open
            ? "scale-100 opacity-100 pointer-events-auto"
            : "scale-95 opacity-0 pointer-events-none",
        ].join(" ")}
      >
        {/* ── Profile Header ── */}
        <div className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-br from-amber-50 via-white to-yellow-50 px-5 py-5">
          {/* Decorative blobs */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-200/20"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-6 bottom-0 h-20 w-20 rounded-full bg-yellow-100/40"
          />

          <div className="relative flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <AvatarImage
                profilePicture={profilePicture}
                name={name}
                size={52}
              />
              <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-bold text-gray-900">
                {name}
              </p>
              <p className="truncate text-xs text-gray-500 mt-0.5">
                {phone || "No phone"}
              </p>
              <span
                className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${roleConfig.color}`}
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-current"
                />
                {roleConfig.label}
              </span>
            </div>
          </div>
        </div>

        {/* ── Menu Items ── */}
        <nav aria-label="User navigation" className="px-2 py-2 space-y-0.5">
          {MENU_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="group flex items-center gap-3 px-2 py-2 rounded-xl transition-all duration-200 hover:bg-amber-50 focus-visible:bg-amber-50 focus-visible:outline-none"
            >
              <span
                aria-hidden="true"
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition-colors group-hover:bg-amber-100 group-hover:text-amber-700"
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {label}
              </span>
            </Link>
          ))}
        </nav>
        <div className="rounded-b-2xl border-t border-gray-100 bg-gray-50/60 p-3">
          <div className="w-full [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:gap-2 [&>button]:w-full [&>button]:rounded-xl [&>button]:bg-red-500 [&>button]:px-4 [&>button]:py-2 [&>button]:text-sm [&>button]:font-semibold [&>button]:text-white [&>button]:shadow-sm [&>button]:transition-all [&>button]:duration-200 hover:[&>button]:bg-red-600 hover:[&>button]:shadow-md">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDropdown;

/* ─── Avatar sub-component ── */

type AvatarProps = {
  profilePicture?: string;
  name: string;
  size: number;
};

function AvatarImage({ profilePicture, name, size }: AvatarProps) {
  if (profilePicture) {
    return (
      <Image
        src={profilePicture}
        alt={`${name} profile profilePicture`}
        width={size}
        height={size}
        sizes="80px"
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      aria-label={`${name} avatar`}
      className="inline-flex flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 font-semibold uppercase text-white"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {name?.charAt(0) ?? "U"}
    </span>
  );
}
