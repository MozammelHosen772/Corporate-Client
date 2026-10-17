import ChangePassword from "@/modules/ChangePassword/ChangePassword";
import { Eye, KeyRound, Lock, RefreshCw, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Change Password",
};

export default async function ChangePasswordPage() {
  return (
    <section className="flex min-h-[calc(100vh-96px)] bg-[#F1F5F9] items-start justify-center px-2 py-10 md:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* ── Page Header ── */}
        <div className="mb-4 md:mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-11 w-11 items-center justify-center rounded-lg flex-shrink-0">
              <KeyRound className="text-primary h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
                Change Password
              </h1>
              <p className="text-muted-foreground text-sm">
                Update your password to keep your account secure
              </p>
            </div>
          </div>
          <div className="mt-4 border-t" />
        </div>

        {/* ── Two Column Layout ── */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* ── Left: Form ── */}
          <div className="lg:col-span-2">
            <ChangePassword />
          </div>

          {/* ── Right: Info Panel ── */}
          <div className="lg:col-span-3 space-y-4">
            {/* Security tips card */}
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="h-5 w-5 text-amber-600 flex-shrink-0" />
                <p className="text-sm font-semibold text-amber-800">
                  Before you update your password
                </p>
              </div>
              <ul className="space-y-2.5">
                {[
                  {
                    icon: Lock,
                    text: "Enter your current password to verify your identity",
                  },
                  {
                    icon: KeyRound,
                    text: "Choose a new password that is at least 8 characters",
                  },
                  {
                    icon: Eye,
                    text: "Use a mix of letters, numbers, and special characters",
                  },
                  {
                    icon: RefreshCw,
                    text: "Do not reuse a password you have used before",
                  },
                ].map(({ icon: Icon, text }, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-amber-100">
                      <Icon className="h-3 w-3 text-amber-600" />
                    </span>
                    <span className="text-xs md:text-sm text-amber-700 leading-snug">
                      {text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Extra note */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-700 mb-1">
                Having trouble?
              </p>
              <p className="text-sm text-slate-500 leading-relaxed">
                If you have forgotten your current password, please log out and
                use the{" "}
                <span className="font-medium text-slate-700">
                  Forgot Password
                </span>{" "}
                option on the login page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
