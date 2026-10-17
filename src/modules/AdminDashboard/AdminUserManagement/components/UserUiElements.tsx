"use client";
import { Loader2 } from "lucide-react";
import Image from "next/image";

// ─── Avatar ──────────────────────────────────────────────────────────────────

export function UserAvatar({
  name,
  photo,
}: {
  name: string | null;
  photo: string | null;
}) {
  const initials = (name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (photo) {
    return (
      <Image
        src={photo}
        alt={name || ""}
        width={36}
        height={36}
        className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200"
      />
    );
  }

  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-500 text-xs font-semibold text-white">
      {initials}
    </div>
  );
}

// ─── Badge ───────────────────────────────────────────────────────────────────

export function UserBadge({
  label,
  styleClass,
}: {
  label: string;
  styleClass: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${styleClass}`}
    >
      {label}
    </span>
  );
}

// ─── Spinner ─────────────────────────────────────────────────────────────────

export function UserSpinner() {
  return <Loader2 className="h-4 w-4 animate-spin text-slate-400" />;
}

// ─── Delete Icon ─────────────────────────────────────────────────────────────

export function DeleteIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  );
}
