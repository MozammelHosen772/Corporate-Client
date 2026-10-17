"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpRight, Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export interface ISocialMediaPublic {
  id: number;
  facebook: string | null;
  youtube: string | null;
  instagram: string | null;
  twitter: string | null;
}

interface ContactPageClientProps {
  socialMedia: ISocialMediaPublic | null;
}

const CONTACT_INFO = [
  {
    icon: Phone,
    label: "Call Support",
    value: "+8801895-610891",
    href: "tel:+8801895-610891",
  },
  {
    icon: Mail,
    label: "Email Inquiry",
    value: "imechanic.net@gmail.com",
    href: "mailto:imechanic.net@gmail.com",
  },
  {
    icon: MapPin,
    label: "Headquarters",
    value: "Future Park, Dhaka 1229, Bangladesh",
    href: null,
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "Sat–Thu: 9am – 8pm",
    href: null,
  },
];

/* ============================================================
   SOCIAL SVG ICONS
============================================================ */

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.019 4.388 11.01 10.125 11.927v-8.437H7.078v-3.49h3.047V9.852c0-3.027 1.791-4.7 4.533-4.7 1.312 0 2.686.236 2.686.236v2.953h-1.515c-1.491 0-1.956.93-1.956 1.883v2.259h3.328l-.532 3.49h-2.796V24C19.612 23.083 24 18.092 24 12.073Z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.28-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163Zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324A6.162 6.162 0 0 0 12 5.838Zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.376.505A3.016 3.016 0 0 0 .502 6.186C0 8.063 0 12 0 12s0 3.937.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.376-.505a3.016 3.016 0 0 0 2.122-2.136C24 15.937 24 12 24 12s0-3.937-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817-5.963 6.817H1.684l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
  </svg>
);

/* ============================================================
   SOCIAL DATA
============================================================ */

const createSocials = (socialMedia: ISocialMediaPublic | null) => {
  if (!socialMedia) return [];

  return [
    {
      label: "Facebook",
      href: socialMedia.facebook,
      icon: FacebookIcon,
    },
    {
      label: "Instagram",
      href: socialMedia.instagram,
      icon: InstagramIcon,
    },
    {
      label: "YouTube",
      href: socialMedia.youtube,
      icon: YoutubeIcon,
    },
    {
      label: "Twitter",
      href: socialMedia.twitter,
      icon: TwitterIcon,
    },
  ].filter((social): social is typeof social & { href: string } =>
    Boolean(social.href),
  );
};

/* ============================================================
   CONTACT PAGE
============================================================ */

export default function ContactPageClient({
  socialMedia,
}: ContactPageClientProps) {
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const socials = createSocials(socialMedia);

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({
        ...prev,
        [key]: e.target.value,
      }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));

      toast.success("Message sent! We'll get back to you soon.");

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    });
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="space-y-6">
          {/* =====================================================
              HERO
          ===================================================== */}

          <section className="relative overflow-hidden rounded-2xl border border-border bg-card">
            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative px-5 py-9 sm:px-8 sm:py-12 lg:px-10">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted/70 px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                We are here to help
              </div>

              <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[42px] lg:leading-[1.15]">
                Let&apos;s get your device{" "}
                <span className="text-primary">back to life.</span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Have a question about a repair, service, or your device? Reach
                out to our support team and we&apos;ll help you find the right
                solution.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Fast response
                </span>

                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Expert support
                </span>

                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Genuine service
                </span>
              </div>
            </div>
          </section>

          {/* =====================================================
              SUPPORT + SOCIAL
          ===================================================== */}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Direct Support */}

            <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <div className="mb-6">
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />

                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Contact
                  </span>
                </div>

                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  Direct Support
                </h2>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Contact us directly through any of these channels.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                  <div
                    key={label}
                    className="group rounded-xl border border-border bg-muted/30 p-4 transition-all duration-200 hover:border-primary/20 hover:bg-muted/60"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background shadow-sm">
                        <Icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                      </div>

                      <div className="min-w-0 pt-0.5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                          {label}
                        </p>

                        {href ? (
                          <a
                            href={href}
                            className="mt-1.5 block truncate text-sm font-medium text-foreground transition-colors hover:text-primary hover:underline"
                          >
                            {value}
                          </a>
                        ) : (
                          <p className="mt-1.5 text-sm font-medium leading-5 text-foreground">
                            {value}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* =================================================
                DYNAMIC SOCIAL MEDIA
            ================================================= */}

            <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <div className="mb-6">
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />

                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Social
                  </span>
                </div>

                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  Connect Socially
                </h2>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Follow us for updates, offers, and repair tips.
                </p>
              </div>

              {socials.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {socials.map(({ label, href, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-4 transition-all duration-200 hover:border-primary/20 hover:bg-muted/60"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background shadow-sm">
                          <Icon className="h-[17px] w-[17px] text-muted-foreground transition-colors group-hover:text-primary" />
                        </div>

                        <div>
                          <span className="block text-sm font-medium text-foreground">
                            {label}
                          </span>

                          <span className="mt-0.5 block text-[11px] text-muted-foreground">
                            Follow us
                          </span>
                        </div>
                      </div>

                      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                    </a>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/20">
                  <p className="text-xs text-muted-foreground">
                    Social media links are currently unavailable.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* =====================================================
              MESSAGE FORM
          ===================================================== */}

          <section className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="border-b border-border px-5 py-6 sm:px-7 sm:py-7 lg:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />

                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Get in touch
                    </span>
                  </div>

                  <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    Send us a message
                  </h2>

                  <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted-foreground">
                    Tell us what you need help with and our support team will
                    get back to you.
                  </p>
                </div>

                <div className="flex w-fit shrink-0 items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  Usually replies within 2–4 hours
                </div>
              </div>
            </div>

            <div className="px-5 py-6 sm:px-7 sm:py-7 lg:px-8 lg:py-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-medium">
                      Full Name <span className="text-destructive">*</span>
                    </Label>

                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={form.name}
                      onChange={set("name")}
                      className="h-11 border-border bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-medium">
                      Email Address <span className="text-destructive">*</span>
                    </Label>

                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={form.email}
                      onChange={set("email")}
                      className="h-11 border-border bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-xs font-medium">
                    Subject
                  </Label>

                  <Input
                    id="subject"
                    placeholder="e.g. Screen replacement inquiry"
                    value={form.subject}
                    onChange={set("subject")}
                    className="h-11 border-border bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-xs font-medium">
                    Detailed Message <span className="text-destructive">*</span>
                  </Label>

                  <Textarea
                    id="message"
                    placeholder="Describe your issue or question in detail..."
                    rows={7}
                    value={form.message}
                    onChange={set("message")}
                    className="resize-none border-border bg-background leading-6"
                  />
                </div>

                <div className="flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs leading-5 text-muted-foreground">
                    Required fields are marked with{" "}
                    <span className="text-destructive">*</span>
                  </p>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="h-11 gap-2 px-6"
                  >
                    <Send className="h-4 w-4" />

                    {isPending ? "Sending..." : "Send Message"}

                    {!isPending && <ArrowUpRight className="h-4 w-4" />}
                  </Button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
