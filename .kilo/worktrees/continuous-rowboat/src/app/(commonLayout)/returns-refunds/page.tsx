import {
  CheckCircle2,
  ClipboardCheck,
  RefreshCcw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Returns & Refunds | FixIt Repair",
  description: "Learn about our return, replacement and refund policy.",
};

const returnSteps = [
  {
    icon: ClipboardCheck,
    title: "Submit Request",
    description:
      "Contact our support team with your order details and explain the issue.",
  },
  {
    icon: ShieldCheck,
    title: "Inspection",
    description:
      "Our team reviews the product condition and verifies the return request.",
  },
  {
    icon: RefreshCcw,
    title: "Replacement / Refund",
    description:
      "Once approved, we process the replacement or eligible refund.",
  },
];

const eligibleItems = [
  "The product arrived damaged or defective.",
  "The wrong product was delivered.",
  "The received item does not match the confirmed order.",
  "The product has a verified manufacturing issue.",
];

const notEligible = [
  "Products damaged due to misuse or accidental damage.",
  "Products with signs of unauthorized modification.",
  "Items returned without required order information.",
  "Products outside the applicable return period.",
];

export default function ReturnsPage() {
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

        <div className="relative mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:py-20">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400">
              <RefreshCcw className="h-3.5 w-3.5" />
              Returns & Refunds
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Something not right?
              <br />
              <span className="text-orange-500">We&apos;ll make it right.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Our return and refund process is designed to be simple,
              transparent and fair.
            </p>
          </div>
        </div>
      </section>

      {/* PROCESS */}

      <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:py-20">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
            Simple process
          </p>

          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            How returns work
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {returnSteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="relative rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <span className="absolute right-6 top-6 text-4xl font-black text-slate-100">
                  0{index + 1}
                </span>

                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mt-6 font-bold">{step.title}</h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ELIGIBILITY */}

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-[1400px] gap-6 px-2 py-14  lg:grid-cols-2 lg:py-20">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>

              <h2 className="font-bold">Eligible for return</h2>
            </div>

            <div className="mt-6 space-y-4">
              {eligibleItems.map((item) => (
                <div key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />

                  <p className="text-sm leading-6 text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50/50 p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-500">
                <XCircle className="h-5 w-5" />
              </div>

              <h2 className="font-bold">Not eligible</h2>
            </div>

            <div className="mt-6 space-y-4">
              {notEligible.map((item) => (
                <div key={item} className="flex gap-3">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />

                  <p className="text-sm leading-6 text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="mx-auto max-w-[1400px] px-2 py-14 lg:py-20">
        <div className="rounded-3xl bg-[#0b1b34] p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Need to start a return?
          </h2>

          <p className="mt-3 text-sm text-slate-400">
            Contact our support team with your order information.
          </p>

          <Link
            href="/contact"
            className="mt-6 inline-flex rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white hover:bg-orange-600"
          >
            Contact Support
          </Link>
        </div>
      </section>
    </main>
  );
}
