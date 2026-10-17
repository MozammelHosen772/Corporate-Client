import {
  CheckCircle2,
  Clock3,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping & Delivery | FixIt Repair",
  description:
    "Learn about our shipping, delivery times, order processing and delivery coverage.",
};

const shippingSteps = [
  {
    icon: PackageCheck,
    number: "01",
    title: "Order Confirmed",
    description:
      "Once your order is confirmed, our team carefully prepares your items for dispatch.",
  },
  {
    icon: Truck,
    number: "02",
    title: "Order Dispatched",
    description:
      "Your package is handed over to our delivery partner and tracking information is updated.",
  },
  {
    icon: MapPin,
    number: "03",
    title: "On The Way",
    description:
      "Your order travels safely to the delivery address provided during checkout.",
  },
  {
    icon: CheckCircle2,
    number: "04",
    title: "Delivered",
    description:
      "Your package arrives at your doorstep. Please check the package before accepting it.",
  },
];

const deliveryInfo = [
  "Orders are normally processed within 1–2 business days.",
  "Delivery time may vary depending on your location.",
  "Customers should provide a complete and accurate delivery address.",
  "Delivery charges may vary depending on location and order type.",
  "Please keep your phone available so the delivery partner can contact you.",
];

export default function ShippingPage() {
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
              <Truck className="h-3.5 w-3.5" />
              Shipping & Delivery
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              We deliver.
              <br />
              <span className="text-orange-500">You relax.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Everything you need to know about order processing, shipping,
              delivery timelines and receiving your package safely.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-slate-300">
                <Clock3 className="h-4 w-4 text-orange-500" />
                Fast Processing
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-slate-300">
                <ShieldCheck className="h-4 w-4 text-orange-500" />
                Safe Delivery
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STEPS */}

      <section className="mx-auto max-w-[1400px] px-2 py-14  lg:py-20">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
            How it works
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            From checkout to your doorstep.
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {shippingSteps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                    <Icon className="h-5 w-5" />
                  </div>

                  <span className="text-xs font-bold text-slate-300">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-6 font-bold text-slate-900">{step.title}</h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* INFORMATION */}

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:py-20">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <h2 className="mt-5 text-2xl font-bold">Delivery information</h2>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              We work with trusted delivery partners to make sure your order
              reaches you safely and on time.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <div className="space-y-4">
              {deliveryInfo.map((item) => (
                <div key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />

                  <p className="text-sm leading-6 text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:py-20">
        <div className="rounded-3xl bg-[#0b1b34] p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Need help with your delivery?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
            Our support team is always ready to help you with your order.
          </p>

          <Link
            href="/contact"
            className="mt-6 inline-flex rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            Contact Support
          </Link>
        </div>
      </section>
    </main>
  );
}
