"use client";

import { logoutUser } from "@/services/auth/logoutUser";
import { LogOut } from "lucide-react";
import { useState } from "react";

export default function LogoutButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      window.dispatchEvent(new Event("userChanged"));
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>

      {/* Confirmation Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 px-4"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="w-full max-w-xs rounded-2xl bg-white p-6 shadow-xl">
            {/* Icon */}
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-50">
              <LogOut className="h-5 w-5 text-red-500" />
            </div>

            {/* Text */}
            <h2 className="mb-1 text-sm font-semibold text-gray-900">
              Logout করবেন?
            </h2>
            <p className="text-xs text-gray-500">আপনাকে আবার login করতে হবে।</p>

            {/* Actions */}
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setOpen(false)}
                disabled={loading}
                className="flex-1 rounded-xl border border-gray-200 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-500 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut className="h-3.5 w-3.5" />
                    Yes, Logout
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
