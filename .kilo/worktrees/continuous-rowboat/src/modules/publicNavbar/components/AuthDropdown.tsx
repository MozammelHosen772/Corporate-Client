import { LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

export default function AuthDropdown({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute right-0 top-full w-[280px] z-50 pt-3">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* HEADER */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-400 px-5 py-4">
          <p className="text-white font-semibold text-base">Welcome Back! 👋</p>
          <p className="text-orange-100 text-xs mt-0.5">
            Sign in to access your account
          </p>
        </div>

        {/* BUTTONS */}
        <div className="p-4 flex flex-col gap-3">
          {/* Login */}
          <Link href="/login" onClick={onClose}>
            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-500 text-white font-medium text-sm hover:bg-orange-600 active:scale-[0.98] transition-all duration-200 cursor-pointer">
              <LogIn aria-hidden="true" className="h-4 w-4" />
              Login to your account
            </button>
          </Link>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-gray-500 text-xs">New here?</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Register */}
          <Link href="/register" onClick={onClose}>
            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] transition-all duration-200 cursor-pointer">
              <UserPlus aria-hidden="true" className="h-4 w-4" />
              Create new account
            </button>
          </Link>
        </div>

        {/* FOOTER */}
        <div className="px-4 pb-4">
          <p className="text-center text-xs text-gray-500">
            By continuing, you agree to our{" "}
            <Link
              href="/terms"
              onClick={onClose}
              className="text-orange-600 hover:underline"
            >
              Terms
            </Link>{" "}
            &{" "}
            <Link
              href="/privacy"
              onClick={onClose}
              className="text-orange-600 hover:underline"
            >
              Privacy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
