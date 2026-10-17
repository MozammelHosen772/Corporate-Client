import {
  Database,
  Eye,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | FixIt Repair",
  description:
    "Learn how FixIt Repair collects, uses and protects your information.",
};

const privacySections = [
  {
    icon: Database,
    title: "Information We Collect",
    text: "We may collect information you provide when creating an account, placing an order, contacting support or using our services. This may include your name, contact information, delivery details and order information.",
  },
  {
    icon: Eye,
    title: "How We Use Information",
    text: "Your information helps us process orders, provide customer support, improve our services, communicate important updates and provide a better shopping experience.",
  },
  {
    icon: LockKeyhole,
    title: "How We Protect Your Data",
    text: "We take reasonable security measures to protect your information from unauthorized access, alteration, disclosure or misuse.",
  },
  {
    icon: UserRound,
    title: "Your Information",
    text: "You may contact us if you want to review, update or request information about the personal data associated with your account.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* HERO */}

      <section className="relative overflow-hidden bg-[#0b1b34]">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative mx-auto max-w-[1400px] px-2 py-16  lg:py-20">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              Privacy & Security
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Your privacy.
              <br />
              <span className="text-orange-500">Our responsibility.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              We believe your personal information should be handled with care,
              transparency and respect.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}

      <section className="mx-auto max-w-[1100px] px-2 py-14  lg:py-20">
        <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-bold">Our privacy commitment</h2>

              <p className="mt-2 text-sm leading-7 text-slate-500">
                This Privacy Policy explains how we collect, use and protect
                information when you interact with our website and services. By
                using our services, you acknowledge the practices described
                here.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {privacySections.map((section, index) => {
            const Icon = section.icon;

            return (
              <article
                key={section.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-orange-200 sm:p-8"
              >
                <div className="flex gap-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h2 className="text-lg font-bold">{section.title}</h2>

                      <span className="text-xs font-bold text-slate-300">
                        0{index + 1}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-7 text-slate-500">
                      {section.text}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-orange-500" />

            <h2 className="font-bold">Questions about privacy?</h2>
          </div>

          <p className="mt-3 text-sm leading-7 text-slate-500">
            If you have questions about this Privacy Policy or how your
            information is handled, please contact our support team.
          </p>

          <a
            href="mailto:info@shoppingcart.bd"
            className="mt-4 inline-flex text-sm font-semibold text-orange-500 hover:text-orange-600"
          >
            info@shoppingcart.bd
          </a>
        </div>
      </section>
    </main>
  );
}
