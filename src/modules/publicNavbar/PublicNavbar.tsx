// "use client";

// import { User } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useEffect, useState } from "react";

// import { useAuth } from "@/contexts/AuthContext";
// import { useTheme } from "@/contexts/ThemeContext";

// import dynamic from "next/dynamic";

// import MobileTopNavbar from "./MobileTopNavbar";
// import { PUBLIC_NAV_ITEMS } from "./constants/publicNavigation";

// const MobileMenuDrawer = dynamic(() => import("./MobileMenuDrawer"), {
//   ssr: false,
// });

// const AuthDropdown = dynamic(() => import("./AuthDropdown"), {
//   ssr: false,
// });

// const UserRoleBaseDropdown = dynamic(() => import("./UserRoleBaseDropdown"), {
//   ssr: false,
// });

// const navLinkCls =
//   "inline-flex h-10 items-center justify-center whitespace-nowrap px-2 text-base font-medium leading-none text-slate-300 transition-colors duration-200 hover:text-[#c8a15a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c8a15a]";

// export default function PublicNavbar() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [showAuth, setShowAuth] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   const { user, loading } = useAuth();
//   const { theme } = useTheme();

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 10);
//     };

//     window.addEventListener("scroll", handleScroll, { passive: true });

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   // Dark background er jonno footer logo age, na thakle normal logo
//   const logoSrc = theme?.footerLogoUrl || theme?.logoUrl;

//   return (
//     <>
//       {/* =========================
//           DESKTOP NAVBAR
//       ========================== */}
//       <header
//         className={`
//           fixed left-0 right-0 top-0 z-50 hidden border-b border-white/10 sm:block
//           transition-all duration-300
//           ${
//             scrolled
//               ? "bg-[#0c0a08]/95 shadow-[0_2px_20px_rgba(0,0,0,0.5)] backdrop-blur-md"
//               : "bg-[#0c0a08]"
//           }
//         `}
//       >
//         <div className="mx-auto flex h-[72px] max-w-[1400px] items-center gap-5 px-2">
//           {/* LOGO */}
//           <Link href="/" className="shrink-0" aria-label="Home">
//             {logoSrc ? (
//               <Image
//                 src={logoSrc}
//                 alt="Logo"
//                 width={120}
//                 height={40}
//                 sizes="120px"
//                 priority
//                 className="object-contain"
//               />
//             ) : (
//               <span className="text-lg font-bold text-white">G Group</span>
//             )}
//           </Link>

//           {/* NAVIGATION (flat links) */}
//           <nav
//             aria-label="Main"
//             className="flex flex-1 items-center justify-end gap-4 xl:gap-6"
//           >
//             {PUBLIC_NAV_ITEMS.map((item) => (
//               <Link key={item.label} href={item.href!} className={navLinkCls}>
//                 {item.label}
//               </Link>
//             ))}
//           </nav>

//           {/* USER */}
//           <div className="flex items-center gap-5">
//             {loading ? (
//               <div className="size-9 animate-pulse rounded-full bg-white/10" />
//             ) : user ? (
//               <UserRoleBaseDropdown user={user} />
//             ) : (
//               <div
//                 className="relative"
//                 onMouseEnter={() => setShowAuth(true)}
//                 onMouseLeave={() => setShowAuth(false)}
//               >
//                 <div
//                   className="
//                     flex
//                     size-9
//                     cursor-pointer
//                     items-center
//                     justify-center
//                     rounded-full
//                     border
//                     border-white/15
//                     text-slate-300
//                     transition-all
//                     duration-200
//                     hover:border-[#c8a15a]
//                     hover:bg-[#c8a15a]/10
//                     hover:text-[#c8a15a]
//                     focus-visible:outline
//                     focus-visible:outline-2
//                     focus-visible:outline-offset-2
//                     focus-visible:outline-[#c8a15a]
//                   "
//                   role="button"
//                   aria-label="Login or register"
//                   aria-haspopup="true"
//                   aria-expanded={showAuth}
//                   tabIndex={0}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       setShowAuth((v) => !v);
//                     }
//                   }}
//                 >
//                   <User aria-hidden="true" className="size-[19px]" />
//                 </div>

//                 {showAuth && (
//                   <AuthDropdown onClose={() => setShowAuth(false)} />
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </header>

//       {/* Desktop navbar spacer */}
//       <div className="hidden h-[72px] sm:block" />

//       {/* Mobile */}
//       <MobileTopNavbar onMenuClick={() => setMenuOpen(true)} />

//       <MobileMenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
//     </>
//   );
// }
"use client";

import { motion, useScroll } from "framer-motion";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

import dynamic from "next/dynamic";

import MobileTopNavbar from "./MobileTopNavbar";
import { PUBLIC_NAV_ITEMS } from "./constants/publicNavigation";

const MobileMenuDrawer = dynamic(() => import("./MobileMenuDrawer"), {
  ssr: false,
});

const AuthDropdown = dynamic(() => import("./AuthDropdown"), {
  ssr: false,
});

const UserRoleBaseDropdown = dynamic(() => import("./UserRoleBaseDropdown"), {
  ssr: false,
});

const focusCls =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0c28a]";

// Gold underline slides in on hover and stays on the active page
const navLinkCls = `relative inline-flex h-10 items-center justify-center whitespace-nowrap px-2 text-[15px] leading-none transition-colors duration-300 after:absolute after:inset-x-2 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-[#c8a15a] after:transition-transform after:duration-300 hover:text-[#e0c28a] hover:after:scale-x-100 ${focusCls}`;

export default function PublicNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Dark background er jonno footer logo age, na thakle normal logo
  const logoSrc = theme?.footerLogoUrl || theme?.logoUrl;

  return (
    <>
      {/* =========================
          DESKTOP NAVBAR
      ========================== */}
      <header
        className={`
          fixed left-0 right-0 top-0 z-50 hidden border-b sm:block
          transition-all duration-300
          ${
            scrolled
              ? "border-[#c8a15a]/30 bg-[#0c0a08]/90 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-md"
              : "border-[#c8a15a]/15 bg-[#0c0a08]"
          }
        `}
      >
        <div
          className={`mx-auto flex max-w-[1400px] items-center gap-5 px-4 transition-all duration-300 lg:px-8 ${
            scrolled ? "h-[62px]" : "h-[72px]"
          }`}
        >
          {/* LOGO */}
          <Link href="/" className={`shrink-0 ${focusCls}`} aria-label="Home">
            {logoSrc ? (
              <Image
                src={logoSrc}
                alt="Logo"
                width={120}
                height={40}
                sizes="120px"
                priority
                className={`object-contain transition-all duration-300 ${
                  scrolled ? "h-9 w-auto" : "h-10 w-auto"
                }`}
              />
            ) : (
              <span className="font-serif text-2xl font-semibold text-[#e0c28a]">
                G Group
              </span>
            )}
          </Link>

          {/* NAVIGATION (flat links) */}
          <nav
            aria-label="Main"
            className="flex flex-1 items-center justify-end gap-2 xl:gap-5"
          >
            {PUBLIC_NAV_ITEMS.map((item) => {
              const isActive = item.href === pathname;
              return (
                <Link
                  key={item.label}
                  href={item.href!}
                  aria-current={isActive ? "page" : undefined}
                  className={`${navLinkCls} ${
                    isActive
                      ? "text-[#e0c28a] after:scale-x-100"
                      : "text-[#d8d2c8]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA + USER */}
          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className={`hidden h-10 items-center border border-[#c8a15a]/70 px-5 text-sm text-[#e0c28a] transition-colors duration-300 hover:border-[#c8a15a] hover:bg-[#c8a15a] hover:text-[#120e09] lg:inline-flex ${focusCls}`}
            >
              Connect
            </Link>

            {loading ? (
              <div className="size-10 animate-pulse rounded-full bg-white/10" />
            ) : user ? (
              <UserRoleBaseDropdown user={user} />
            ) : (
              <div
                className="relative"
                onMouseEnter={() => setShowAuth(true)}
                onMouseLeave={() => setShowAuth(false)}
              >
                <div
                  className={`flex size-10 cursor-pointer items-center justify-center rounded-full border border-[#c8a15a]/40 text-[#e0c28a] transition-all duration-300 hover:border-[#c8a15a] hover:bg-[#c8a15a] hover:text-[#120e09] ${focusCls}`}
                  role="button"
                  aria-label="Login or register"
                  aria-haspopup="true"
                  aria-expanded={showAuth}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setShowAuth((v) => !v);
                    }
                  }}
                >
                  <User aria-hidden="true" className="size-[19px]" />
                </div>

                {showAuth && (
                  <AuthDropdown onClose={() => setShowAuth(false)} />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Page scroll progress */}
        <motion.div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px origin-left bg-[#c8a15a]"
          style={{ scaleX: scrollYProgress }}
        />
      </header>

      {/* Desktop navbar spacer */}
      <div className="hidden h-[72px] sm:block" />

      {/* Mobile */}
      <MobileTopNavbar onMenuClick={() => setMenuOpen(true)} />

      <MobileMenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
