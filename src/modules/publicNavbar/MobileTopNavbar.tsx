// "use client";

// import { useAuth } from "@/contexts/AuthContext";
// import { useTheme } from "@/contexts/ThemeContext";
// import { Menu, User } from "lucide-react";
// import dynamic from "next/dynamic";
// import Image from "next/image";
// import Link from "next/link";
// import { useState } from "react";

// const AuthDropdown = dynamic(() => import("./AuthDropdown"), {
//   ssr: false,
// });

// const UserRoleBaseDropdown = dynamic(() => import("./UserRoleBaseDropdown"), {
//   ssr: false,
// });

// type Props = {
//   onMenuClick: () => void;
// };

// const focusCls =
//   "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c8a15a]";

// export default function MobileTopNavbar({ onMenuClick }: Props) {
//   const { theme } = useTheme();
//   const { user, loading } = useAuth();
//   const [showAuth, setShowAuth] = useState(false);

//   // Dark background er jonno footer logo age, na thakle normal logo
//   const logoSrc = theme?.footerLogoUrl || theme?.logoUrl;

//   return (
//     <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0c0a08]/95 shadow-[0_2px_20px_rgba(0,0,0,0.5)] backdrop-blur-md sm:hidden">
//       <div className="flex items-center justify-between gap-3 px-3 py-2.5">
//         {/* ============================================================= */}
//         {/* MENU + LOGO                                                    */}
//         {/* ============================================================= */}

//         <div className="flex min-w-0 items-center gap-1.5">
//           {/* Menu */}
//           <button
//             type="button"
//             onClick={onMenuClick}
//             aria-label="Open sidebar menu"
//             className={`
//               flex size-9 shrink-0 items-center justify-center
//               rounded-full
//               text-slate-300
//               transition-all duration-200
//               hover:bg-[#c8a15a]/10 hover:text-[#c8a15a]
//               active:scale-95
//               ${focusCls}
//             `}
//           >
//             <Menu aria-hidden="true" className="size-[21px]" />
//           </button>

//           {/* Logo */}
//           <Link
//             href="/"
//             className={`flex min-w-0 shrink-0 items-center rounded-md ${focusCls}`}
//             aria-label="G Group home"
//           >
//             {logoSrc ? (
//               <Image
//                 src={logoSrc}
//                 alt="G Group"
//                 width={110}
//                 height={36}
//                 sizes="110px"
//                 priority
//                 className="h-9 w-auto object-contain"
//               />
//             ) : (
//               <span className="truncate text-lg font-bold tracking-tight text-white">
//                 G Group
//               </span>
//             )}
//           </Link>
//         </div>

//         {/* ============================================================= */}
//         {/* USER / AUTH                                                    */}
//         {/* ============================================================= */}

//         <div className="flex shrink-0 items-center">
//           {loading ? (
//             <div className="size-9 animate-pulse rounded-full bg-white/10" />
//           ) : user ? (
//             <UserRoleBaseDropdown user={user} />
//           ) : (
//             <div className="relative">
//               <button
//                 type="button"
//                 onClick={() => setShowAuth((v) => !v)}
//                 aria-label="Login or register"
//                 aria-haspopup="true"
//                 aria-expanded={showAuth}
//                 className={`
//                   flex size-9 items-center justify-center
//                   rounded-full
//                   border border-white/15
//                   text-slate-300
//                   transition-all duration-200
//                   hover:border-[#c8a15a] hover:bg-[#c8a15a]/10 hover:text-[#c8a15a]
//                   active:scale-95
//                   ${focusCls}
//                 `}
//               >
//                 <User aria-hidden="true" className="size-[19px]" />
//               </button>

//               {showAuth && (
//                 <>
//                   {/* backdrop to close on outside tap */}
//                   <div
//                     className="fixed inset-0 z-40"
//                     onClick={() => setShowAuth(false)}
//                     aria-hidden="true"
//                   />
//                   <div className="absolute right-0 z-50 mt-2">
//                     <AuthDropdown onClose={() => setShowAuth(false)} />
//                   </div>
//                 </>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { motion, useScroll } from "framer-motion";
import { Menu, User } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const AuthDropdown = dynamic(() => import("./AuthDropdown"), {
  ssr: false,
});

const UserRoleBaseDropdown = dynamic(() => import("./UserRoleBaseDropdown"), {
  ssr: false,
});

type Props = {
  onMenuClick: () => void;
};

const focusCls =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0c28a]";

const ringBtnCls = `flex size-10 items-center justify-center rounded-full border border-[#c8a15a]/40 text-[#e0c28a] transition-all duration-200 hover:border-[#c8a15a] hover:bg-[#c8a15a]/10 active:scale-95 ${focusCls}`;

export default function MobileTopNavbar({ onMenuClick }: Props) {
  const { theme } = useTheme();
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const { scrollYProgress } = useScroll();

  // Dark background er jonno footer logo age, na thakle normal logo
  const logoSrc = theme?.footerLogoUrl || theme?.logoUrl;

  return (
    <header className="sticky top-0 z-40 border-b border-[#c8a15a]/25 bg-[#0c0a08]/90 shadow-[0_6px_24px_rgba(0,0,0,0.5)] backdrop-blur-md sm:hidden">
      {/* Menu | centred logo | user */}
      <div className="grid grid-cols-[40px_1fr_40px] items-center gap-3 px-3 py-2.5">
        {/* Menu */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open sidebar menu"
          className={ringBtnCls}
        >
          <Menu aria-hidden="true" className="size-[19px]" />
        </button>

        {/* Logo */}
        <Link
          href="/"
          className={`flex min-w-0 items-center justify-center rounded-md ${focusCls}`}
          aria-label="G Group home"
        >
          {logoSrc ? (
            <Image
              src={logoSrc}
              alt="G Group"
              width={110}
              height={36}
              sizes="110px"
              priority
              className="h-9 w-auto object-contain"
            />
          ) : (
            <span className="truncate font-serif text-xl font-semibold text-[#e0c28a]">
              G Group
            </span>
          )}
        </Link>

        {/* User / Auth */}
        <div className="flex items-center justify-end">
          {loading ? (
            <div className="size-10 animate-pulse rounded-full bg-white/10" />
          ) : user ? (
            <UserRoleBaseDropdown user={user} />
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAuth((v) => !v)}
                aria-label="Login or register"
                aria-haspopup="true"
                aria-expanded={showAuth}
                className={ringBtnCls}
              >
                <User aria-hidden="true" className="size-[18px]" />
              </button>

              {showAuth && (
                <>
                  {/* backdrop to close on outside tap */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowAuth(false)}
                    aria-hidden="true"
                  />
                  <div className="absolute right-0 z-50 mt-2">
                    <AuthDropdown onClose={() => setShowAuth(false)} />
                  </div>
                </>
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
  );
}
