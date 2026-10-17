// import { LogIn, UserPlus } from "lucide-react";
// import Link from "next/link";

// export default function AuthDropdown({ onClose }: { onClose: () => void }) {
//   return (
//     <div className="absolute right-0 top-full z-50 w-[280px] pt-3">
//       <div className="overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-2xl">
//         {/* HEADER */}
//         <div className="bg-teal-600 px-5 py-4">
//           <p className="text-base font-semibold text-white">Welcome Back! 👋</p>

//           <p className="mt-0.5 text-xs text-teal-100">
//             Sign in to access your account
//           </p>
//         </div>

//         {/* BUTTONS */}
//         <div className="flex flex-col gap-3 p-4">
//           {/* Login */}
//           <Link href="/login" onClick={onClose}>
//             <button
//               className="
//                 flex
//                 w-full
//                 cursor-pointer
//                 items-center
//                 justify-center
//                 gap-2
//                 rounded-xl
//                 bg-teal-600
//                 py-2.5
//                 text-sm
//                 font-medium
//                 text-white
//                 transition-all
//                 duration-200
//                 hover:bg-teal-700
//                 active:scale-[0.98]
//               "
//             >
//               <LogIn aria-hidden="true" className="h-4 w-4" />
//               Login to your account
//             </button>
//           </Link>

//           {/* Divider */}
//           <div className="flex items-center gap-3">
//             <div className="h-px flex-1 bg-gray-100" />

//             <span className="text-xs text-gray-500">New here?</span>

//             <div className="h-px flex-1 bg-gray-100" />
//           </div>

//           {/* Register */}
//           <Link href="/register" onClick={onClose}>
//             <button
//               className="
//                 flex
//                 w-full
//                 cursor-pointer
//                 items-center
//                 justify-center
//                 gap-2
//                 rounded-xl
//                 border
//                 border-teal-600/25
//                 py-2.5
//                 text-sm
//                 font-medium
//                 text-teal-600
//                 transition-all
//                 duration-200
//                 hover:border-teal-600
//                 hover:bg-teal-50
//                 active:scale-[0.98]
//               "
//             >
//               <UserPlus aria-hidden="true" className="h-4 w-4" />
//               Create new account
//             </button>
//           </Link>
//         </div>

//         {/* FOOTER */}
//         <div className="px-4 pb-4">
//           <p className="text-center text-xs text-gray-500">
//             By continuing, you agree to our{" "}
//             <Link
//               href="/terms"
//               onClick={onClose}
//               className="font-medium text-teal-600 hover:underline"
//             >
//               Terms
//             </Link>{" "}
//             &{" "}
//             <Link
//               href="/privacy"
//               onClick={onClose}
//               className="font-medium text-teal-600 hover:underline"
//             >
//               Privacy
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { motion } from "framer-motion";
import { LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

const focusCls =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0c28a]";

export default function AuthDropdown({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute right-0 top-full z-50 w-[280px] pt-3">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative border border-[#c8a15a]/30 bg-gradient-to-b from-[#1a150e] to-[#0c0a08] shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
      >
        {/* little arrow pointing to the user icon */}
        <span
          aria-hidden
          className="absolute -top-[7px] right-[18px] h-3 w-3 rotate-45 border-l border-t border-[#c8a15a]/30 bg-[#1a150e]"
        />

        {/* HEADER */}
        <div className="border-b border-[#c8a15a]/20 px-5 py-4">
          <p className="font-serif text-2xl text-white">Welcome back</p>
          <p className="mt-1 text-[13px] text-[#968f83]">
            Sign in to access your account.
          </p>
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col gap-3 p-5">
          {/* Login */}
          <Link
            href="/login"
            onClick={onClose}
            className={`group flex h-11 w-full items-center justify-center gap-2 bg-[#c8a15a] text-sm font-medium text-[#120e09] transition-all duration-300 hover:bg-[#e0c28a] hover:shadow-[0_0_24px_rgba(200,161,90,0.35)] active:scale-[0.98] ${focusCls}`}
          >
            <LogIn aria-hidden="true" className="h-4 w-4" />
            Login to your account
          </Link>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-[#c8a15a]/20" />
            <span className="text-xs text-[#968f83]">New here?</span>
            <div className="h-px flex-1 bg-[#c8a15a]/20" />
          </div>

          {/* Register */}
          <Link
            href="/register"
            onClick={onClose}
            className={`flex h-11 w-full items-center justify-center gap-2 border border-[#c8a15a]/60 text-sm text-[#e0c28a] transition-all duration-300 hover:border-[#c8a15a] hover:bg-[#c8a15a]/10 active:scale-[0.98] ${focusCls}`}
          >
            <UserPlus aria-hidden="true" className="h-4 w-4" />
            Create new account
          </Link>
        </div>

        {/* FOOTER */}
        <div className="border-t border-[#c8a15a]/15 px-5 py-3.5">
          <p className="text-center text-xs leading-relaxed text-[#968f83]">
            By continuing, you agree to our{" "}
            <Link
              href="/terms"
              onClick={onClose}
              className={`text-[#e0c28a] underline-offset-4 hover:underline ${focusCls}`}
            >
              Terms
            </Link>{" "}
            &{" "}
            <Link
              href="/privacy"
              onClick={onClose}
              className={`text-[#e0c28a] underline-offset-4 hover:underline ${focusCls}`}
            >
              Privacy
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
