"use client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { Heart, ShoppingBag, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useWhitelist } from "@/contexts/WhitelistContext";
import ProductSearch from "@/modules/AdminDashboard/AdminProducts/Productsearch";
import CartDrawer from "../../shared/CartDrawer";
import AuthDropdown from "./components/AuthDropdown";
import { CategoryMegaMenu } from "./components/CategoryMegaMenu";
import MobileBottomNav from "./components/MobileBottomNav";
import MobileMenuDrawer from "./components/MobileMenuDrawer";
import MobileTopNavbar from "./components/MobileTopNavbar";
import { TopNavbar } from "./components/TopNavbar";
import UserRoleBaseDropdown from "./components/UserRoleBaseDropdown";
import WhitelistDropdown from "./components/WhitelistDropdown";

// const MobileMenuDrawer = dynamic(
//   () => import("./components/MobileMenuDrawer"),
//   {
//     ssr: false,
//   },
// );
// const AuthDropdown = dynamic(() => import("./components/AuthDropdown"), {
//   ssr: false,
// });
// const UserRoleBaseDropdown = dynamic(() => import("./UserRoleBaseDropdown"), {
//   ssr: false,
// });

export default function PublicNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const [showWhitelist, setShowWhitelist] = useState(false);
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  const { items: whitelistItems, isHydrated } = useWhitelist();
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* FIXED NAVBAR */}
      <header
        className={`
          fixed top-0 left-0 right-0 z-50 hidden sm:block
          transition-all duration-300
          ${
            scrolled
              ? "bg-white/95 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.08)]"
              : "bg-white shadow-sm"
          }
        `}
      >
        <TopNavbar />
        <div className="max-w-[1400px] mx-auto  h-[65px] flex items-center gap-5">
          {/* LOGO */}
          <Link href="/" className="shrink-0" aria-label="Taqwa Tech home">
            {theme?.logoUrl ? (
              <Image
                src={theme.logoUrl}
                alt="Taqwa Tech"
                width={120}
                height={40}
                sizes="120px"
                priority
              />
            ) : (
              <span className="text-lg font-bold">Taqwa Tech</span>
            )}
          </Link>

          {/* MENU */}
          <div className="flex-2 flex justify-end">
            <NavigationMenu>
              <NavigationMenuList className="gap-5 font-bold">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/">Home</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/offers">Contact</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/track-order"
                      className="flex items-center gap-1.5 font-bold"
                    >
                      Pre Order
                      <span className="bg-orange-500 text-white text-[9px] font-bold leading-none px-1.5 py-[3px] rounded">
                        NEW
                      </span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* SEARCH */}
          <div className="flex-1 flex justify-end">
            <ProductSearch />
          </div>

          {/* ICONS */}
          <div className="flex items-center justify-center gap-6">
            <div
              className="relative"
              onMouseEnter={() => setShowWhitelist(true)}
              onMouseLeave={() => setShowWhitelist(false)}
            >
              <button
                aria-label="Whitelist"
                className="relative flex items-center justify-center"
              >
                <Heart aria-hidden="true" />
                {isHydrated && whitelistItems.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] px-[3px] rounded-full bg-orange-500 text-white text-[9px] font-bold leading-none flex items-center justify-center shadow-sm">
                    {whitelistItems.length}
                  </span>
                )}
              </button>
              {showWhitelist && (
                <WhitelistDropdown onClose={() => setShowWhitelist(false)} />
              )}
            </div>

            <button
              onClick={() => setCartOpen(true)}
              aria-label="Shopping cart"
            >
              <ShoppingBag aria-hidden="true" />
            </button>

            {loading ? (
              <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse" />
            ) : user ? (
              <UserRoleBaseDropdown user={user} />
            ) : (
              <div
                className="relative"
                onMouseEnter={() => setShowAuth(true)}
                onMouseLeave={() => setShowAuth(false)}
              >
                <div
                  className="h-9 w-9 border flex items-center justify-center rounded-full cursor-pointer"
                  role="button"
                  aria-label="Login or register"
                  aria-haspopup="true"
                  aria-expanded={showAuth}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setShowAuth((v) => !v);
                  }}
                >
                  <User aria-hidden="true" />
                </div>
                {showAuth && (
                  <AuthDropdown onClose={() => setShowAuth(false)} />
                )}
              </div>
            )}
          </div>
        </div>

        <CategoryMegaMenu />
      </header>

      {/* spacer */}
      <div className="hidden sm:block h-[72px]" />

      {/* CART DRAWER */}
      <CartDrawer open={cartOpen} setOpen={setCartOpen} />

      <MobileTopNavbar onMenuClick={() => setMenuOpen(true)} />
      <MobileMenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      <MobileBottomNav />
    </>
  );
}
