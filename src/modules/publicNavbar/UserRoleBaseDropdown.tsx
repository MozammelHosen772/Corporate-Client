import { navbarRoleBaseMenu } from "@/lib/navbarUserRoleBaseInfo";
import LogoutButton from "@/shared/LogOutButton";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Props = {
  user: {
    name: string;
    phone: string;
    profilePicture?: string;
    role: "ADMIN" | "USER" | "SUPER_ADMIN" | "MODERATOR";
  };
};

const ROLE_CONFIG = {
  SUPER_ADMIN: { label: "SUPER ADMIN", color: "bg-purple-100 text-purple-700" },
  ADMIN: { label: "ADMIN", color: "bg-blue-100 text-blue-700" },
  MODERATOR: { label: "MODERATOR", color: "bg-amber-100 text-amber-700" },
  USER: { label: "ACTIVE USER", color: "bg-emerald-100 text-emerald-700" },
} as const;

export default function UserRoleBaseDropdown({ user }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setOpen(false);
    window.addEventListener("userChanged", handler);
    return () => window.removeEventListener("userChanged", handler);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (!user) return null;

  const roleConfig = ROLE_CONFIG[user.role] ?? ROLE_CONFIG.USER;

  return (
    <div ref={ref} className="relative z-50">
      {/* Trigger Button */}
      <button
        aria-label="Open user menu"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((prev) => !prev)}
        onMouseEnter={() => setOpen(true)}
        className="group relative flex items-center justify-center rounded-full p-[3px] transition-all duration-200 hover:ring-2 hover:ring-amber-400/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
      >
        <AvatarImage
          profilePicture={user.profilePicture}
          name={user.name}
          size={44}
        />
        <span
          aria-hidden="true"
          className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 shadow-sm"
        />
      </button>

      {/* Dropdown Panel */}
      <div
        role="menu"
        aria-label="User menu"
        onMouseLeave={() => setOpen(false)}
        className={[
          "absolute right-0 top-full mt-2 w-72 origin-top-right",
          "rounded-2xl border border-gray-100 bg-white shadow-xl shadow-black/[0.08]",
          "transition-all duration-200 ease-out",
          open
            ? "scale-100 opacity-100 pointer-events-auto"
            : "scale-95 opacity-0 pointer-events-none",
        ].join(" ")}
      >
        {/* Profile Header */}
        <div className="relative overflow-hidden rounded-t-2xl border-b border-gray-100 bg-gradient-to-br from-amber-50 via-white to-yellow-50 px-5 py-4">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-200/25"
          />

          <div className="relative flex items-center gap-3">
            <AvatarImage
              profilePicture={user.profilePicture}
              name={user.name}
              size={52}
            />

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">
                {user.name}
              </p>
              <p className="truncate text-xs text-gray-500">{user.phone}</p>
              <span
                className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${roleConfig.color}`}
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

        {/* Navigation Menu */}
        <nav aria-label="User navigation" className="py-1.5">
          {navbarRoleBaseMenu[user.role]?.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="group flex items-center gap-3 px-2.5 py-1.5 transition-colors duration-150 hover:bg-amber-50 focus-visible:bg-amber-50 focus-visible:outline-none"
              >
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors duration-150 group-hover:bg-amber-100 group-hover:text-amber-700"
                >
                  {Icon && <Icon className="h-3 w-3" />}
                </span>
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="rounded-b-2xl border-t border-gray-100 bg-gray-50/60 p-3">
          <div className="w-full [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:gap-2 [&>button]:w-full [&>button]:rounded-xl [&>button]:bg-red-500 [&>button]:px-4 [&>button]:py-2 [&>button]:text-sm [&>button]:font-semibold [&>button]:text-white [&>button]:shadow-sm [&>button]:transition-all [&>button]:duration-200 hover:[&>button]:bg-red-600 hover:[&>button]:shadow-md">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Avatar sub-component ─────────────────────────────────────────── */

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
        alt={`${name} profile picture`}
        width={size}
        height={size}
        sizes="80px"
        quality={90}
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
