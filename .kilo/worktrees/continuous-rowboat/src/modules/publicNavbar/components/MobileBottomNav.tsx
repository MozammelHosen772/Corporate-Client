"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useWhitelist } from "@/contexts/WhitelistContext";
import { useCart } from "@/hooks/useCart";
import { navbarRoleBaseMenu } from "@/modules/publicNavbar/constants/navbarUserRoleBaseInfo";
import { Grid, Heart, Home, ShoppingBag, User, X } from "lucide-react";

import CartDrawer from "@/shared/CartDrawer";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LogoutButton from "../../../shared/LogOutButton";
import MobileCategoryDrawer from "./MobileCategoryDrawer";

const ROLE_CONFIG = {
  SUPER_ADMIN: { label: "Super Admin", color: "bg-purple-100 text-purple-700" },
  ADMIN: { label: "Admin", color: "bg-blue-100 text-blue-700" },
  MODERATOR: { label: "Moderator", color: "bg-amber-100 text-amber-700" },
  USER: { label: "Active User", color: "bg-emerald-100 text-emerald-700" },
} as const;

export default function MobileBottomNav() {
  const [openCategory, setOpenCategory] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const { user, loading } = useAuth();
  const { cartItems } = useCart();
  // ✅ NEW: whitelist count + hydration flag — navbar/whitelist page er
  // sathe consistent thakte
  const { items: whitelistItems, isHydrated: whitelistHydrated } =
    useWhitelist();
  const pathname = usePathname();

  /* ── Body scroll lock ── */
  useEffect(() => {
    const anyOpen = openCategory || openCart || openProfile;
    document.body.style.overflow = anyOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openCategory, openCart, openProfile]);

  /* ── Helpers ── */
  const isActive = (href: string) => pathname === href;

  const avatarFallback = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  const role = (user?.role as keyof typeof ROLE_CONFIG) || "USER";
  const roleConfig = ROLE_CONFIG[role] ?? ROLE_CONFIG.USER;
  const roleMenus = navbarRoleBaseMenu[role] || [];

  // ✅ hydration na hoye jawa porjonto count 0 dhore neya hocche, tai
  // server/client mismatch hobe na
  const whitelistCount = whitelistHydrated ? whitelistItems.length : 0;

  return (
    <>
      {/* ========================= BOTTOM NAV ========================= */}
      <nav
        aria-label="Mobile bottom navigation"
        className="fixed bottom-0 inset-x-0 z-40 sm:hidden transition-transform duration-200"
      >
        <div className="absolute inset-0 bg-white/90 backdrop-blur-xl border-t border-gray-100/80 shadow-[0_-8px_32px_rgba(0,0,0,0.08)]" />

        <div className="relative grid grid-cols-5 items-end h-[68px]  pb-2">
          {/* HOME */}
          <Link
            href="/"
            aria-label="Home"
            className="flex flex-col items-center justify-center gap-1 pt-2 group"
          >
            <div
              className={`flex items-center justify-center w-10 h-7 rounded-2xl transition-all duration-300 ${isActive("/") ? "bg-orange-500 shadow-[0_4px_12px_rgba(249,115,22,0.4)]" : ""}`}
            >
              <Home
                size={18}
                aria-hidden="true"
                className={`transition-colors duration-200 ${isActive("/") ? "text-white" : "text-gray-400 group-hover:text-orange-500"}`}
              />
            </div>
            <span
              className={`text-[10px] font-semibold tracking-wide transition-colors duration-200 ${isActive("/") ? "text-orange-500" : "text-gray-400 group-hover:text-orange-500"}`}
            >
              Home
            </span>
          </Link>

          {/* CATEGORY */}
          <button
            onClick={() => setOpenCategory(true)}
            aria-label="Browse categories"
            className="flex flex-col items-center justify-center gap-1 pt-2 group"
          >
            <div className="flex items-center justify-center w-10 h-7 rounded-2xl transition-all duration-300">
              <Grid
                size={18}
                aria-hidden="true"
                className="text-gray-400 group-hover:text-orange-500 transition-colors duration-200"
              />
            </div>
            <span className="text-[10px] font-semibold tracking-wide text-gray-400 group-hover:text-orange-500 transition-colors duration-200">
              Category
            </span>
          </button>

          {/* CART */}
          <div className="flex flex-col items-center justify-end pb-1">
            <button
              onClick={() => setOpenCart(true)}
              aria-label={`Shopping cart${(cartItems?.length ?? 0) > 0 ? `, ${cartItems.length} items` : ""}`}
              className="relative -mt-6 group"
            >
              <div className="absolute inset-0 rounded-full bg-orange-400/30 scale-110 blur-md group-active:scale-100 transition-all duration-300" />
              <div className="relative h-[52px] w-[52px] rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-[0_8px_24px_rgba(249,115,22,0.45)] group-active:scale-95 transition-all duration-200">
                <ShoppingBag
                  aria-hidden="true"
                  className="text-white"
                  size={22}
                  strokeWidth={2}
                />
                {(cartItems?.length ?? 0) > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 rounded-full bg-[#0f3ea9] text-white text-[9px] font-bold flex items-center justify-center shadow-md border-2 border-white">
                    {cartItems.length > 99 ? "99+" : cartItems.length}
                  </span>
                )}
              </div>
            </button>
          </div>

          {/* WISHLIST */}
          {/* ⚠️ route "/whitelist" — jodi tomar actual route "/wishlist" hoy,
              WhitelistDropdown.tsx / WhitelistPage.tsx er route-o milie nite hobe */}
          <Link
            href="/whitelist"
            aria-label="Wishlist"
            className="flex flex-col items-center justify-center gap-1 pt-2 group"
          >
            <div
              className={`relative flex items-center justify-center w-10 h-7 rounded-2xl transition-all duration-300 ${isActive("/whitelist") ? "bg-orange-500 shadow-[0_4px_12px_rgba(249,115,22,0.4)]" : ""}`}
            >
              <Heart
                size={18}
                aria-hidden="true"
                className={`transition-colors duration-200 ${isActive("/whitelist") ? "text-white" : "text-gray-400 group-hover:text-orange-500"}`}
              />
              {/* ✅ NEW: badge count — isHydrated guard thaka obosthay
                  render hoy, tai hydration mismatch hobe na */}
              {whitelistCount > 0 && (
                <span className="absolute -top-1 -right-0.5 min-w-[16px] h-[16px] px-[3px] rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-[8px] font-bold leading-none flex items-center justify-center shadow-sm border-2 border-white">
                  {whitelistCount > 99 ? "99+" : whitelistCount}
                </span>
              )}
            </div>
            <span
              className={`text-[10px] font-semibold tracking-wide transition-colors duration-200 ${isActive("/whitelist") ? "text-orange-500" : "text-gray-400 group-hover:text-orange-500"}`}
            >
              Wishlist
            </span>
          </Link>

          {/* PROFILE / LOGIN */}
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-1 pt-2">
              <div className="w-7 h-7 rounded-full bg-gray-200 animate-pulse" />
            </div>
          ) : user ? (
            <button
              onClick={() => setOpenProfile(true)}
              aria-label="Open profile menu"
              className="flex flex-col items-center justify-center gap-1 pt-2 group"
            >
              <div className="w-10 h-7 flex items-center justify-center">
                {user.profilePicture ? (
                  <Image
                    src={user.profilePicture}
                    alt={`${user.name} profile`}
                    width={28}
                    height={28}
                    sizes="60px"
                    className="rounded-full object-cover border-2 border-orange-400"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-[10px] font-bold shadow">
                    {avatarFallback}
                  </div>
                )}
              </div>
              <span className="text-[10px] font-semibold tracking-wide text-gray-400 group-hover:text-orange-500 transition-colors duration-200 max-w-[52px] truncate">
                {user.name?.split(" ")[0]}
              </span>
            </button>
          ) : (
            <Link
              href="/login"
              aria-label="Login"
              className="flex flex-col items-center justify-center gap-1 pt-2 group"
            >
              <div
                className={`flex items-center justify-center w-10 h-7 rounded-2xl transition-all duration-300 ${isActive("/login") ? "bg-orange-500 shadow-[0_4px_12px_rgba(249,115,22,0.4)]" : ""}`}
              >
                <User
                  size={18}
                  aria-hidden="true"
                  className={`transition-colors duration-200 ${isActive("/login") ? "text-white" : "text-gray-400 group-hover:text-orange-500"}`}
                />
              </div>
              <span
                className={`text-[10px] font-semibold tracking-wide transition-colors duration-200 ${isActive("/login") ? "text-orange-500" : "text-gray-400 group-hover:text-orange-500"}`}
              >
                Login
              </span>
            </Link>
          )}
        </div>
      </nav>

      {/* ========================= PROFILE DRAWER ========================= */}

      {/* Overlay */}
      <div
        onClick={() => setOpenProfile(false)}
        aria-hidden="true"
        className={`fixed inset-0 bg-black/50 backdrop-blur-[2px] z-[9998] transition-all duration-300 sm:hidden ${openProfile ? "opacity-100 visible" : "opacity-0 invisible"}`}
      />

      {/* Left Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Profile menu"
        className={`fixed top-0 left-0 z-[9999] h-screen w-[78%] max-w-[300px] bg-white flex flex-col transition-all duration-300 sm:hidden shadow-[0_0_40px_rgba(0,0,0,0.15)] ${openProfile ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* ── Profile Header ── */}
        <div className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-br from-amber-50 via-white to-yellow-50 px-5 py-5">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-200/20"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-6 bottom-0 h-20 w-20 rounded-full bg-yellow-100/40"
          />

          <button
            onClick={() => setOpenProfile(false)}
            aria-label="Close profile menu"
            className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200"
          >
            <X size={16} aria-hidden="true" />
          </button>

          <div className="relative flex items-center gap-4 pt-1">
            <div className="relative flex-shrink-0">
              {user?.profilePicture ? (
                <Image
                  src={user.profilePicture}
                  alt={`${user?.name || "User"} profile`}
                  width={64}
                  height={64}
                  sizes="80px"
                  className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-md"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-xl font-bold shadow-md border-2 border-white">
                  {avatarFallback}
                </div>
              )}
              <span
                aria-hidden="true"
                className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="truncate text-[15px] font-bold text-gray-900">
                {user?.name || "User"}
              </h2>
              <p className="truncate text-xs text-gray-500 mt-0.5">
                {user?.phone || ""}
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

        <nav
          aria-label="Profile navigation"
          className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5 bg-white"
        >
          {roleMenus.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpenProfile(false)}
                className={`flex items-center gap-3 px-2 py-1.5 rounded-xl transition-all duration-200 ${
                  active
                    ? "bg-amber-50 text-amber-700"
                    : "text-gray-700 hover:bg-amber-50 hover:text-amber-700"
                }`}
              >
                <div
                  aria-hidden="true"
                  className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl transition-colors ${active ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"}`}
                >
                  <Icon size={18} />
                </div>
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}

          <div className="pt-2 mt-2 border-t border-gray-100">
            <LogoutButton />
          </div>
        </nav>
      </div>

      {/* ========================= CART DRAWER ========================= */}
      <CartDrawer open={openCart} setOpen={setOpenCart} />

      {/* ========================= CATEGORY DRAWER ========================= */}
      <MobileCategoryDrawer
        open={openCategory}
        onClose={() => setOpenCategory(false)}
      />
    </>
  );
}
