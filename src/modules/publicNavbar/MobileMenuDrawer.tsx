// "use client";

// import { useTheme } from "@/contexts/ThemeContext";

// import { ChevronRight, X } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useEffect, useState } from "react";
// import { PUBLIC_NAV_ITEMS } from "./constants/publicNavigation";

// type Props = {
//   open: boolean;
//   onClose: () => void;
// };

// const focusCls =
//   "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c8a15a]";

// export default function MobileMenuDrawer({ open, onClose }: Props) {
//   const { theme } = useTheme();
//   const pathname = usePathname();

//   const [openLabel, setOpenLabel] = useState<string | null>(null);

//   // আগের render-এর open/pathname ট্র্যাক করার জন্য
//   const [prevOpen, setPrevOpen] = useState(open);
//   const [prevPathname, setPrevPathname] = useState(pathname);

//   // render-এর সময়েই state adjust করা হচ্ছে, effect-এর মধ্যে না
//   if (open !== prevOpen || pathname !== prevPathname) {
//     setPrevOpen(open);
//     setPrevPathname(pathname);

//     if (!open) {
//       setOpenLabel(null);
//     } else {
//       const activeParent = PUBLIC_NAV_ITEMS.find((item) =>
//         item.children?.some((child) => child.href === pathname),
//       );
//       setOpenLabel(activeParent?.label ?? null);
//     }
//   }

//   useEffect(() => {
//     const mediaQuery = window.matchMedia("(min-width: 768px)");
//     const handleResize = () => {
//       if (mediaQuery.matches) onClose();
//     };
//     handleResize();
//     mediaQuery.addEventListener("change", handleResize);
//     return () => mediaQuery.removeEventListener("change", handleResize);
//   }, [onClose]);

//   useEffect(() => {
//     if (!open) return;
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = "auto";
//     };
//   }, [open]);

//   if (!open) return null;

//   const navItems = PUBLIC_NAV_ITEMS;

//   // Dark background er jonno footer logo age, na thakle normal logo
//   const logoSrc = theme?.footerLogoUrl || theme?.logoUrl;

//   const toggle = (label: string) => {
//     setOpenLabel((prev) => (prev === label ? null : label));
//   };

//   return (
//     <>
//       {/* Overlay */}
//       <div
//         onClick={onClose}
//         aria-hidden="true"
//         className="fixed inset-0 z-40 bg-black/60"
//       />

//       {/* Sidebar Drawer */}
//       <div
//         role="dialog"
//         aria-modal="true"
//         aria-label="Site navigation menu"
//         className="fixed left-0 top-0 z-50 flex h-full w-[82%] max-w-[250px] animate-slideLeft flex-col border-r border-white/10 bg-[#0c0a08] shadow-[0_0_40px_rgba(0,0,0,0.6)] md:hidden"
//       >
//         {/* Header */}
//         <div className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-3 py-3">
//           <Link
//             href="/"
//             onClick={onClose}
//             className={`flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-white/5 ${focusCls}`}
//           >
//             <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#c8a15a]/15 text-[#c8a15a]">
//               {logoSrc ? (
//                 <Image
//                   src={logoSrc}
//                   alt="Logo"
//                   width={20}
//                   height={20}
//                   className="object-contain"
//                 />
//               ) : (
//                 <span className="text-sm font-bold">G</span>
//               )}
//             </div>
//             <div className="min-w-0 flex-1 text-left">
//               <p className="truncate text-base font-semibold text-white">
//                 G Group
//               </p>
//               <p className="truncate text-sm text-slate-500">Menu</p>
//             </div>
//           </Link>

//           <button
//             onClick={onClose}
//             aria-label="Close menu"
//             className={`flex size-8 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-white/5 hover:text-[#c8a15a] ${focusCls}`}
//           >
//             <X aria-hidden="true" size={18} />
//           </button>
//         </div>

//         {/* Sidebar Menu */}
//         <nav className="flex-1 overflow-y-auto px-2 py-3">
//           <p className="px-2 pb-1 text-sm font-medium text-slate-500">
//             Navigate
//           </p>

//           <ul className="flex flex-col gap-0.5">
//             {navItems.map((item) => {
//               const hasChildren = !!item.children?.length;
//               const isOpen = openLabel === item.label;
//               const isDirectActive = !hasChildren && item.href === pathname;
//               const Icon = item.icon;

//               if (!hasChildren) {
//                 return (
//                   <li key={item.label}>
//                     <Link
//                       href={item.href!}
//                       onClick={onClose}
//                       className={`flex items-center gap-2 rounded-md px-2 py-2.5 text-base font-medium transition-colors ${focusCls} ${
//                         isDirectActive
//                           ? "bg-[#c8a15a]/10 text-[#c8a15a]"
//                           : "text-slate-300 hover:bg-white/5 hover:text-[#c8a15a]"
//                       }`}
//                     >
//                       {Icon && (
//                         <Icon
//                           aria-hidden="true"
//                           size={18}
//                           className={`shrink-0 ${
//                             isDirectActive ? "text-[#c8a15a]" : "text-slate-500"
//                           }`}
//                         />
//                       )}
//                       <span className="truncate">{item.label}</span>
//                     </Link>
//                   </li>
//                 );
//               }

//               return (
//                 <li key={item.label}>
//                   <button
//                     type="button"
//                     onClick={() => toggle(item.label)}
//                     aria-expanded={isOpen}
//                     className={`flex w-full items-center gap-2 rounded-md px-2 py-2.5 text-left text-base font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-[#c8a15a] ${focusCls}`}
//                   >
//                     {Icon && (
//                       <Icon
//                         aria-hidden="true"
//                         size={18}
//                         className="shrink-0 text-slate-500"
//                       />
//                     )}
//                     <span className="flex-1 truncate">{item.label}</span>
//                     <ChevronRight
//                       aria-hidden="true"
//                       size={16}
//                       className={`shrink-0 text-slate-500 transition-transform duration-200 ${
//                         isOpen ? "rotate-90 text-[#c8a15a]" : ""
//                       }`}
//                     />
//                   </button>

//                   <div
//                     className={`grid overflow-hidden transition-all duration-200 ease-in-out ${
//                       isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
//                     }`}
//                   >
//                     <ul className="ml-[19px] flex min-h-0 flex-col gap-0.5 overflow-hidden border-l border-white/10 py-0.5 pl-3.5">
//                       {item.children!.map((child) => {
//                         const isChildActive = child.href === pathname;
//                         return (
//                           <li key={child.href}>
//                             <Link
//                               href={child.href}
//                               onClick={onClose}
//                               className={`flex items-center justify-between rounded-md px-2 py-2 text-base transition-colors ${focusCls} ${
//                                 isChildActive
//                                   ? "font-medium text-[#c8a15a]"
//                                   : "text-slate-400 hover:text-[#c8a15a]"
//                               }`}
//                             >
//                               <span className="truncate">{child.label}</span>
//                               {child.meta && (
//                                 <span className="shrink-0 text-sm text-slate-500">
//                                   {child.meta}
//                                 </span>
//                               )}
//                             </Link>
//                           </li>
//                         );
//                       })}
//                     </ul>
//                   </div>
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>
//       </div>
//     </>
//   );
// }

"use client";

import { useTheme } from "@/contexts/ThemeContext";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PUBLIC_NAV_ITEMS } from "./constants/publicNavigation";

type Props = {
  open: boolean;
  onClose: () => void;
};

const EASE = [0.22, 1, 0.36, 1] as const;

const focusCls =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0c28a]";

export default function MobileMenuDrawer({ open, onClose }: Props) {
  const { theme } = useTheme();
  const pathname = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);

  const [openLabel, setOpenLabel] = useState<string | null>(null);

  // আগের render-এর open/pathname ট্র্যাক করার জন্য
  const [prevOpen, setPrevOpen] = useState(open);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // render-এর সময়েই state adjust করা হচ্ছে, effect-এর মধ্যে না
  if (open !== prevOpen || pathname !== prevPathname) {
    setPrevOpen(open);
    setPrevPathname(pathname);

    if (!open) {
      setOpenLabel(null);
    } else {
      const activeParent = PUBLIC_NAV_ITEMS.find((item) =>
        item.children?.some((child) => child.href === pathname),
      );
      setOpenLabel(activeParent?.label ?? null);
    }
  }

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleResize = () => {
      if (mediaQuery.matches) onClose();
    };
    handleResize();
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, [onClose]);

  // Scroll lock + Esc to close + focus the close button
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const navItems = PUBLIC_NAV_ITEMS;

  // Dark background er jonno footer logo age, na thakle normal logo
  const logoSrc = theme?.footerLogoUrl || theme?.logoUrl;

  const toggle = (label: string) => {
    setOpenLabel((prev) => (prev === label ? null : label));
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          onClick={onClose}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        />
      )}

      {open && (
        <motion.div
          key="panel"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation menu"
          className="fixed left-0 top-0 z-50 flex h-full w-[86%] max-w-[330px] flex-col overflow-hidden border-r border-[#c8a15a]/30 bg-gradient-to-b from-[#14110c] to-[#0c0a08] shadow-[0_0_50px_rgba(0,0,0,0.7)] md:hidden"
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          {/* gold glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#c8a15a]/10 blur-[80px]"
          />

          {/* Header */}
          <div className="relative flex shrink-0 items-center justify-between gap-3 border-b border-[#c8a15a]/20 px-5 py-4">
            <Link
              href="/"
              onClick={onClose}
              aria-label="G Group home"
              className={`flex min-w-0 items-center ${focusCls}`}
            >
              {logoSrc ? (
                <Image
                  src={logoSrc}
                  alt="G Group"
                  width={120}
                  height={40}
                  sizes="120px"
                  className="h-9 w-auto object-contain"
                />
              ) : (
                <span className="font-serif text-2xl font-semibold text-[#e0c28a]">
                  G Group
                </span>
              )}
            </Link>

            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close menu"
              className={`flex size-10 shrink-0 items-center justify-center rounded-full border border-[#c8a15a]/40 text-[#e0c28a] transition-colors hover:bg-[#c8a15a] hover:text-[#120e09] ${focusCls}`}
            >
              <X aria-hidden="true" size={18} />
            </button>
          </div>

          {/* Menu */}
          <nav
            aria-label="Mobile"
            className="relative flex-1 overflow-y-auto px-3 py-5"
          >
            <ul className="flex flex-col">
              {navItems.map((item, index) => {
                const hasChildren = !!item.children?.length;
                const isOpen = openLabel === item.label;
                const isDirectActive = !hasChildren && item.href === pathname;
                const isParentActive =
                  hasChildren &&
                  item.children!.some((c) => c.href === pathname);
                const isActive = isDirectActive || isParentActive;
                const Icon = item.icon;

                const rowCls = `relative flex w-full items-center gap-3 px-3 py-3.5 text-left font-serif text-[22px] leading-none transition-colors duration-200 ${focusCls} ${
                  isActive
                    ? "text-[#e0c28a]"
                    : "text-[#d8d2c8] hover:text-[#e0c28a]"
                }`;

                const activeBar = isActive && (
                  <span
                    aria-hidden
                    className="absolute inset-y-2 left-0 w-0.5 bg-[#c8a15a]"
                  />
                );

                const iconEl = Icon && (
                  <Icon
                    aria-hidden="true"
                    size={18}
                    className={`shrink-0 ${
                      isActive ? "text-[#c8a15a]" : "text-[#968f83]"
                    }`}
                  />
                );

                return (
                  <motion.li
                    key={item.label}
                    className="border-b border-[#c8a15a]/10 last:border-b-0"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      ease: EASE,
                      delay: 0.15 + index * 0.05,
                    }}
                  >
                    {!hasChildren ? (
                      <Link
                        href={item.href!}
                        onClick={onClose}
                        aria-current={isDirectActive ? "page" : undefined}
                        className={rowCls}
                      >
                        {activeBar}
                        {iconEl}
                        <span className="truncate">{item.label}</span>
                      </Link>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => toggle(item.label)}
                          aria-expanded={isOpen}
                          className={rowCls}
                        >
                          {activeBar}
                          {iconEl}
                          <span className="flex-1 truncate">{item.label}</span>
                          <ChevronRight
                            aria-hidden="true"
                            size={18}
                            className={`shrink-0 transition-transform duration-300 ${
                              isOpen
                                ? "rotate-90 text-[#c8a15a]"
                                : "text-[#968f83]"
                            }`}
                          />
                        </button>

                        <div
                          className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
                            isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                          }`}
                        >
                          <ul className="ml-6 flex min-h-0 flex-col overflow-hidden border-l border-[#c8a15a]/25 py-1 pl-4">
                            {item.children!.map((child) => {
                              const isChildActive = child.href === pathname;
                              return (
                                <li key={child.href}>
                                  <Link
                                    href={child.href}
                                    onClick={onClose}
                                    tabIndex={isOpen ? 0 : -1}
                                    aria-current={
                                      isChildActive ? "page" : undefined
                                    }
                                    className={`flex items-center justify-between gap-3 py-2.5 text-[15px] transition-colors ${focusCls} ${
                                      isChildActive
                                        ? "text-[#e0c28a]"
                                        : "text-[#968f83] hover:text-[#e0c28a]"
                                    }`}
                                  >
                                    <span className="truncate">
                                      {child.label}
                                    </span>
                                    {child.meta && (
                                      <span className="shrink-0 text-xs text-[#968f83]/80">
                                        {child.meta}
                                      </span>
                                    )}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </>
                    )}
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          {/* Footer CTA */}
          <div className="relative shrink-0 border-t border-[#c8a15a]/20 p-5">
            <Link
              href="/contact"
              onClick={onClose}
              className={`group flex h-12 items-center justify-center bg-[#c8a15a] text-sm font-medium text-[#120e09] transition-colors duration-300 hover:bg-[#e0c28a] ${focusCls}`}
            >
              Connect with us
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
            <p className="mt-3 text-center text-xs text-[#968f83]">
              Building for a brighter tomorrow.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
