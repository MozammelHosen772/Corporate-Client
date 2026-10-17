"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SheetTitle } from "@/components/ui/sheet";
import { getIconComponent } from "@/lib/icon-mapper";
import { cn } from "@/lib/utils";
import { NavItem, NavSection } from "@/types/dashboard.interface";
import { UserInfo } from "@/types/user.interface";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createElement, useState } from "react";

const renderIcon = (iconName: string, className: string) => {
  const IconComponent = getIconComponent(iconName);
  return createElement(IconComponent, { className });
};

interface DashboardMobileSidebarContentProps {
  userInfo: UserInfo;
  navItems: NavSection[];
  dashboardHome: string;
  onClose: () => void; // ✅ নতুন prop
}
const ROLE_CONFIG: Record<
  string,
  { label: string; color: string; dot: string; bg: string }
> = {
  super_admin: {
    label: "Super Admin",
    color: "text-purple-700",
    dot: "bg-purple-500",
    bg: "bg-purple-50 border border-purple-100",
  },
  admin: {
    label: "Admin",
    color: "text-blue-700",
    dot: "bg-blue-500",
    bg: "bg-blue-50 border border-blue-100",
  },
  moderator: {
    label: "Moderator",
    color: "text-amber-700",
    dot: "bg-amber-500",
    bg: "bg-amber-50 border border-amber-100",
  },
  user: {
    label: "Active User",
    color: "text-emerald-700",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50 border border-emerald-100",
  },
};

// ─── Single nav link ────────────────────────────────────────────────────────
const NavLink = ({
  item,
  onClose,
}: {
  item: NavItem;
  onClose: () => void; // ✅
}) => {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      onClick={onClose} // ✅ click করলেই sidebar বন্ধ
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150",
        isActive
          ? "bg-amber-50 text-amber-700"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-800",
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-amber-500" />
      )}

      <span
        className={cn(
          "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg transition-colors duration-150",
          isActive
            ? "bg-amber-100 text-amber-600"
            : "bg-gray-100 text-gray-400 group-hover:bg-amber-50 group-hover:text-amber-500",
        )}
      >
        {renderIcon(item.icon, "h-3.5 w-3.5")}
      </span>

      <span className="flex-1 truncate">{item.title}</span>

      {item.badge && (
        <Badge
          className={cn(
            "ml-auto h-5 min-w-5 rounded-full px-1.5 text-[10px] font-semibold",
            isActive
              ? "bg-amber-200 text-amber-800 hover:bg-amber-200"
              : "bg-gray-100 text-gray-500 hover:bg-gray-100",
          )}
        >
          {item.badge}
        </Badge>
      )}
    </Link>
  );
};

// ─── Dropdown nav item ──────────────────────────────────────────────────────
const NavDropdown = ({
  item,
  isOpen, // ✅ parent থেকে control
  onToggle, // ✅ toggle করলে parent কে জানাও
  onClose, // ✅ child link click করলে sidebar বন্ধ
}: {
  item: NavItem;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) => {
  const pathname = usePathname();
  const isAnyChildActive = item.children?.some(
    (child) => pathname === child.href,
  );
  const isParentActive = pathname === item.href || isAnyChildActive;

  return (
    <div>
      <button
        type="button"
        onClick={onToggle} // ✅ local state নেই, parent control করে
        className={cn(
          "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150",
          isParentActive
            ? "bg-amber-50 text-amber-700"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-800",
        )}
      >
        {isParentActive && (
          <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-amber-500" />
        )}

        <span
          className={cn(
            "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg transition-colors duration-150",
            isParentActive
              ? "bg-amber-100 text-amber-600"
              : "bg-gray-100 text-gray-400 group-hover:bg-amber-50 group-hover:text-amber-500",
          )}
        >
          {renderIcon(item.icon, "h-3.5 w-3.5")}
        </span>

        <span className="flex-1 truncate text-left">{item.title}</span>

        <span
          className={cn(
            "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold transition-colors duration-150",
            isParentActive
              ? "bg-amber-100 text-amber-600"
              : "bg-gray-100 text-gray-400",
          )}
        >
          {item.children?.length}
        </span>

        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 flex-shrink-0 transition-transform duration-200 will-change-transform",
            isOpen ? "rotate-90" : "rotate-0", // ✅ isOpen prop ব্যবহার
            isParentActive ? "text-amber-500" : "text-gray-300",
          )}
        />
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-200 ease-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }} // ✅ isOpen prop ব্যবহার
      >
        <div className="overflow-hidden">
          <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-dashed border-amber-100 pb-1.5 pl-3 pt-0.5">
            {item.children!.map((child) => {
              const isChildActive = pathname === child.href;

              return (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={onClose} // ✅ child click করলে sidebar বন্ধ
                  className={cn(
                    "group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors duration-150",
                    isChildActive
                      ? "bg-amber-50 text-amber-700"
                      : "text-gray-400 hover:bg-gray-50 hover:text-gray-700",
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 flex-shrink-0 rounded-full transition-colors duration-150",
                      isChildActive
                        ? "bg-amber-500"
                        : "bg-gray-200 group-hover:bg-amber-300",
                    )}
                  />

                  <span
                    className={cn(
                      "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md transition-colors duration-150",
                      isChildActive
                        ? "bg-amber-100 text-amber-600"
                        : "bg-gray-100 text-gray-400 group-hover:bg-amber-50 group-hover:text-amber-400",
                    )}
                  >
                    {renderIcon(child.icon, "h-3 w-3")}
                  </span>

                  <span className="flex-1 truncate">{child.title}</span>

                  {child.badge && (
                    <Badge
                      className={cn(
                        "ml-auto h-5 min-w-5 rounded-full px-1.5 text-[10px] font-semibold",
                        isChildActive
                          ? "bg-amber-200 text-amber-800 hover:bg-amber-200"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-100",
                      )}
                    >
                      {child.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Nav section — accordion state এখানে ────────────────────────────────────
// ✅ section-level এ openIndex রাখলে প্রতিটা section আলাদাভাবে manage হয়
const NavSectionRenderer = ({
  section,
  onClose,
}: {
  section: NavSection;
  onClose: () => void;
}) => {
  const pathname = usePathname();

  // ✅ initial open: active child আছে এমন item এর index
  const initialOpen = section.items.findIndex(
    (item) =>
      item.children?.some((child) => pathname === child.href) ||
      pathname === item.href,
  );
  const [openIndex, setOpenIndex] = useState<number | null>(
    initialOpen !== -1 ? initialOpen : null,
  );

  const handleToggle = (idx: number) => {
    // ✅ একই index click করলে বন্ধ, নইলে ওটা open (বাকি সব বন্ধ)
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="space-y-0.5">
      {section.items.map((item, idx) =>
        item.children && item.children.length > 0 ? (
          <NavDropdown
            key={item.href}
            item={item}
            isOpen={openIndex === idx} // ✅
            onToggle={() => handleToggle(idx)} // ✅
            onClose={onClose}
          />
        ) : (
          <NavLink key={item.href} item={item} onClose={onClose} />
        ),
      )}
    </div>
  );
};

// ─── Main mobile sidebar ─────────────────────────────────────────────────────
const DashboardMobileSidebar = ({
  userInfo,
  navItems,
  dashboardHome,
  onClose, // ✅ নতুন prop
}: DashboardMobileSidebarContentProps) => {
  const safeRole =
    typeof userInfo.role === "string" ? userInfo.role.toLowerCase() : "user";
  const roleConfig = ROLE_CONFIG[safeRole] ?? ROLE_CONFIG.user;
  const firstLetter = userInfo.name?.charAt(0)?.toUpperCase() ?? "U";

  return (
    <div className="flex h-full flex-col bg-white">
      <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

      {/* ══ FIXED Header ══ */}
      <div className="flex-shrink-0 relative overflow-hidden border-b border-gray-100 px-5 py-4">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-200/20"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-4 bottom-0 h-16 w-16 rounded-full bg-yellow-100/40"
        />
        <Link
          href={dashboardHome}
          onClick={onClose} // ✅ logo/home click করলেও বন্ধ
          className="relative flex items-center gap-2.5"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-sm flex-shrink-0">
            <span className="text-sm font-bold text-white">M</span>
          </div>
          <span className="text-[15px] font-bold tracking-tight text-gray-900">
            IMechnanic
          </span>
        </Link>
      </div>

      {/* ══ SCROLLABLE Navigation ══ */}
      <ScrollArea className="flex-1 min-h-0 px-3 py-3">
        <nav className="space-y-5 pb-2">
          {navItems.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              {section.title && (
                <div className="mb-2 flex items-center gap-2 px-2">
                  <p className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                    {section.title}
                  </p>
                  <div className="h-px w-full bg-gradient-to-r from-orange-500 to-transparent" />
                </div>
              )}

              {/* ✅ NavSectionRenderer accordion state manage করে */}
              <NavSectionRenderer section={section} onClose={onClose} />
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* ══ FIXED Footer ══ */}
      <div className="flex-shrink-0 border-t border-gray-100 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-gray-50/80 px-3 py-2.5 ring-1 ring-gray-100">
          <div className="relative flex-shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-sm font-bold text-white shadow-sm">
              {firstLetter}
            </div>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-gray-900 leading-tight">
              {userInfo.name || "User"}
            </p>
            <span
              className={cn(
                "mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                roleConfig.bg,
                roleConfig.color,
              )}
            >
              <span
                aria-hidden="true"
                className={cn("h-1.5 w-1.5 rounded-full", roleConfig.dot)}
              />
              {roleConfig.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMobileSidebar;
