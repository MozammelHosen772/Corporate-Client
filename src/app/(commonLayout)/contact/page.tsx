// import ContactPageClient from "@/modules/settingPages/ContactPageClient/ContactPageClient";
// import { getSocialMedia } from "@/services/settings/socialMedia.service";

// export default async function ContactPage() {
//   const socialMedia = await getSocialMedia();

//   return <ContactPageClient socialMedia={socialMedia} />;
// }
"use client";

import { ChevronDown, MapPin, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────

const LOCATIONS = [
  {
    name: "Future Park, Dhaka 1229, Bangladesh",
    status: "Off Day: Wednesday",
    address: "Jamuna Future Park, Shop No. 4B-025D",
    phone: "01895-610891",
    mapUrl:
      "https://www.google.com/maps/search/Jamuna+Future+Park,+Dhaka+1229,+Bangladesh/@24.0075852,84.5210833,8z?hl=en&entry=ttu&g_ep=EgoyMDI2MDkwMS4wIKXMDSoASAFQAw%3D%3D",
  },
];

const FAQS = [
  {
    question: "What kind of repairs do you offer?",
    answer:
      "We offer a wide range of repairs including screen replacements, battery replacements, water damage repairs, software upgrades, and more.",
  },
  {
    question: "How long will my repair take?",
    answer:
      "The time it takes to complete a repair depends on the type of repair and the availability of parts. We strive to complete repairs as quickly as possible and typically provide an estimated time frame when you drop off your device.",
  },
  {
    question: "Do you use genuine OEM parts?",
    answer:
      "Yes, we use genuine OEM parts for all repairs to ensure the best performance and longevity of your device.",
  },
];

// ─── FAQ Item ─────────────────────────────────────────────────────────────

function FaqItem({
  question,
  answer,
  defaultOpen = false,
}: {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl bg-slate-50">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left "
      >
        <span className="text-sm font-medium text-slate-800 sm:text-base">
          {question}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="px-6 pb-5 text-sm leading-relaxed text-slate-500">
          {answer}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default function ContactLocationsSection() {
  return (
    <section className="bg-white py-16">
      {/* ── Our Locations ── */}
      <div className="mx-auto max-w-[1100px] px-4 text-center sm:px-6">
        <p className="text-sm font-semibold text-orange-500">Contact Us</p>
        <h2 className="mt-2 text-4xl font-extrabold text-slate-900">
          Our Locations
        </h2>
        <p className="mt-4 text-slate-500">
          Come visit our friendly team at one of our offices.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 text-left sm:grid-cols-2">
          {LOCATIONS.map((loc) => (
            <div
              key={loc.name}
              className="rounded-2xl border border-slate-200 p-6 sm:p-8"
            >
              <div className="mb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5 shrink-0 text-orange-500" />
                <h3 className="text-lg font-bold text-slate-900">{loc.name}</h3>
              </div>

              <p className="text-sm font-medium text-orange-500">
                {loc.status}
              </p>

              <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-800">
                {loc.address}
              </p>

              <a
                href={`tel:${loc.phone}`}
                className="mt-3 inline-block text-sm font-semibold text-slate-800 underline underline-offset-2"
              >
                Call : {loc.phone}
              </a>

              <div className="mt-6">
                <Link
                  href={loc.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  Visit on Map
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M7 17 17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA Banner ── */}
      <div className="mt-16 bg-slate-50 py-16 mt-4">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h3 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
            For our higher authority attention
          </h3>
          <p className="mt-3 text-slate-600">
            Click complaint &amp; suggestion button
          </p>

          <Link
            href="https://www.google.com/maps/search/Jamuna+Future+Park,+Dhaka+1229,+Bangladesh/@24.0075852,84.5210833,8z?hl=en&entry=ttu&g_ep=EgoyMDI2MDkwMS4wIKXMDSoASAFQAw%3D%3D"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-orange-500 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Click Here
            <Send className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="mx-auto max-w-[900px] px-4 py-16 sm:px-6">
        <h2 className="text-center text-3xl font-extrabold text-slate-900">
          Frequently Asked Questions
        </h2>

        <div className="mt-10 space-y-4">
          {FAQS.map((faq, i) => (
            <FaqItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              defaultOpen={i === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
