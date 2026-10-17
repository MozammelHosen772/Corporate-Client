import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Gavel,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | FixIt Repair",
  description: "Read the terms and conditions for using FixIt Repair services.",
};

const termsSections = [
  {
    icon: UserCheck,
    title: "Use of Our Services",
    text: "By using our website and services, you agree to provide accurate information and use the platform responsibly and lawfully.",
  },
  {
    icon: FileText,
    title: "Orders & Information",
    text: "Orders are subject to product availability, confirmation and applicable pricing. We may contact you when additional information is required to complete an order.",
  },
  {
    icon: ShieldCheck,
    title: "Product & Service Quality",
    text: "We make reasonable efforts to provide accurate product information, descriptions and service details. Product availability and specifications may change without prior notice.",
  },
  {
    icon: Gavel,
    title: "Account Responsibility",
    text: "If you create an account, you are responsible for maintaining the confidentiality of your account information and for activities performed through your account.",
  },
];

const importantPoints = [
  "Do not provide false or misleading information.",
  "Do not attempt to misuse or disrupt the website.",
  "Prices and availability may change when necessary.",
  "Orders may require confirmation before processing.",
  "Additional policies may apply to specific products or services.",
];

export default function TermsPage() {
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
              <FileText className="h-3.5 w-3.5" />
              Terms of Service
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Clear rules.
              <br />
              <span className="text-orange-500">Better service.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              These terms explain the basic rules and responsibilities when
              using our website, products and services.
            </p>
          </div>
        </div>
      </section>

      {/* INTRO */}

      <section className="mx-auto max-w-[1100px] px-2 py-14  lg:py-20">
        <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <AlertTriangle className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-bold">
                Please read before using our service
              </h2>

              <p className="mt-2 text-sm leading-7 text-slate-600">
                By accessing or using our website and services, you agree to
                follow these terms. If you do not agree with any part of these
                terms, please discontinue use of the service.
              </p>
            </div>
          </div>
        </div>

        {/* TERMS */}

        <div className="mt-8 space-y-5">
          {termsSections.map((section, index) => {
            const Icon = section.icon;

            return (
              <article
                key={section.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
              >
                <div className="flex gap-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
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

        {/* IMPORTANT */}

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-orange-500" />

            <h2 className="font-bold">Important points</h2>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {importantPoints.map((point) => (
              <div
                key={point}
                className="flex items-start gap-3 rounded-xl bg-slate-50 p-4"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />

                <p className="text-sm leading-6 text-slate-600">{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* LAST UPDATED */}

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">
            Terms may be updated from time to time to reflect changes in our
            services.
          </p>
        </div>
      </section>
    </main>
  );
}
