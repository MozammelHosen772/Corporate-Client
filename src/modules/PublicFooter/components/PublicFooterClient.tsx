// "use client";

// import { useTheme } from "@/contexts/ThemeContext";
// import { ISocialMedia } from "@/services/settings/socialMedia.service";

// import {
//   Award,
//   ChevronRight,
//   Code2,
//   Globe,
//   Mail,
//   MapPin,
//   MessageCircle,
// } from "lucide-react";

// import Image from "next/image";
// import Link from "next/link";

// // ─── Colors (rong bodlate chaile shudhu ei duita bodlaw) ──────────────────────
// const FOOTER_BG = "bg-[#0c0a08]";
// const GOLD = "#c8a15a";

// // ─── Static data ──────────────────────────────────────────────────────────────

// const usefulLinks = [{ label: "Latest News", href: "/blog" }];

// const quickLinks = [
//   { label: "Home", href: "/" },
//   { label: "About", href: "/#about" },
//   { label: "Ecosystem", href: "/#ecosystem" },
//   { label: "Insights", href: "/#insights" },
//   { label: "Gallery", href: "/#gallery" },
//   { label: "Contact", href: "/contact" },
// ];

// // Office link: href e tomar office page / contact page er link dao
// const officeLinks = [
//   { city: "New York", country: "United States", href: "/contact" },
//   { city: "London", country: "United Kingdom", href: "/contact" },
//   { city: "Dubai", country: "United Arab Emirates", href: "/contact" },
//   { city: "Singapore", country: "Singapore", href: "/contact" },
//   { city: "Hong Kong", country: "Hong Kong SAR", href: "/contact" },
// ];

// // ─── Social SVG Icons ─────────────────────────────────────────────────────────

// const iconProps = {
//   viewBox: "0 0 24 24",
//   className: "h-4 w-4 fill-current",
//   xmlns: "http://www.w3.org/2000/svg",
// };

// const FacebookIcon = () => (
//   <svg {...iconProps}>
//     <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
//   </svg>
// );

// const InstagramIcon = () => (
//   <svg {...iconProps}>
//     <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919C8.333.014 8.741 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
//   </svg>
// );

// const YoutubeIcon = () => (
//   <svg {...iconProps}>
//     <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
//   </svg>
// );

// const TwitterXIcon = () => (
//   <svg {...iconProps}>
//     <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
//   </svg>
// );

// // ─── Social platform config ───────────────────────────────────────────────────

// type SocialPlatform = {
//   key: keyof Omit<ISocialMedia, "id">;
//   label: string;
//   Icon: () => React.ReactElement;
//   baseUrl: string;
// };

// const SOCIAL_PLATFORMS: SocialPlatform[] = [
//   {
//     key: "facebook",
//     label: "Facebook",
//     Icon: FacebookIcon,
//     baseUrl: "https://facebook.com/",
//   },
//   {
//     key: "instagram",
//     label: "Instagram",
//     Icon: InstagramIcon,
//     baseUrl: "https://instagram.com/",
//   },
//   {
//     key: "youtube",
//     label: "YouTube",
//     Icon: YoutubeIcon,
//     baseUrl: "https://youtube.com/",
//   },
//   {
//     key: "twitter",
//     label: "Twitter / X",
//     Icon: TwitterXIcon,
//     baseUrl: "https://twitter.com/",
//   },
// ];

// // ─── Small shared pieces (accent = gold #c8a15a) ──────────────────────────────

// function ColumnTitle({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="mb-5 flex items-center gap-2">
//       <span className="h-5 w-1 rounded-full bg-[#c8a15a]" />
//       <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-white">
//         {children}
//       </h4>
//     </div>
//   );
// }

// const linkCls =
//   "group flex items-center gap-2 py-2 text-sm text-slate-400 transition-colors duration-200 hover:text-[#c8a15a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c8a15a]";

// const chevronCls =
//   "h-3.5 w-3.5 text-slate-600 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#c8a15a]";

// const contactCardCls =
//   "group flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 transition-all duration-300 hover:border-[#c8a15a]/30 hover:bg-[#c8a15a]/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c8a15a]";

// const contactIconCls =
//   "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-slate-300 transition-colors group-hover:bg-[#c8a15a]/10 group-hover:text-[#c8a15a]";

// // ─── Props ────────────────────────────────────────────────────────────────────

// interface Props {
//   socialMedia: ISocialMedia | null;
// }

// // ─── Component ────────────────────────────────────────────────────────────────

// export default function PublicFooterClient({ socialMedia }: Props) {
//   const { theme } = useTheme();

//   const activeSocialLinks = SOCIAL_PLATFORMS.filter(
//     ({ key }) => socialMedia?.[key],
//   );

//   return (
//     <footer className="w-full">
//       <section
//         className={`relative overflow-hidden ${FOOTER_BG} text-slate-200`}
//       >
//         {/* Background grid */}
//         <div
//           aria-hidden
//           className="pointer-events-none absolute inset-0 opacity-[0.035]"
//           style={{
//             backgroundImage:
//               "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
//             backgroundSize: "34px 34px",
//           }}
//         />

//         {/* Gold glow */}
//         <div
//           aria-hidden
//           className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#c8a15a]/10 blur-3xl"
//         />
//         <div
//           aria-hidden
//           className="pointer-events-none absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-[#c8a15a]/5 blur-3xl"
//         />

//         <div className="relative mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
//           {/* Main grid: 5 columns */}
//           <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-8">
//             {/* ───────── 1. BRAND ───────── */}
//             <div className="xl:pr-6">
//               <Link
//                 href="/"
//                 className="inline-flex items-center"
//                 aria-label="G Group home"
//               >
//                 {theme?.footerLogoUrl ? (
//                   <Image
//                     src={theme.footerLogoUrl}
//                     alt="G Group"
//                     width={140}
//                     height={45}
//                     sizes="140px"
//                     priority
//                     className="object-contain"
//                   />
//                 ) : (
//                   <span className="text-xl font-extrabold tracking-tight text-white">
//                     G
//                   </span>
//                 )}
//               </Link>

//               <p className="mt-5 text-sm leading-6 text-slate-400">G Group.</p>

//               {activeSocialLinks.length > 0 && (
//                 <div className="mt-6">
//                   <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
//                     Follow us
//                   </p>

//                   <div className="flex items-center gap-2">
//                     {activeSocialLinks.map(({ key, label, Icon, baseUrl }) => {
//                       const value = socialMedia![key]!;
//                       const href = value.startsWith("http")
//                         ? value
//                         : `${baseUrl}${value}`;

//                       return (
//                         <Link
//                           key={key}
//                           href={href}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           aria-label={label}
//                           className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:border-[#c8a15a] hover:bg-[#c8a15a] hover:text-[#0c0a08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c8a15a]"
//                         >
//                           <Icon />
//                         </Link>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )}

//               <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
//                 <Award className="h-4 w-4 text-[#c8a15a]" />
//                 <span>Trusted service partner</span>
//               </div>
//             </div>

//             {/* ───────── 2. USEFUL LINKS ───────── */}
//             <div>
//               <ColumnTitle>Useful Links</ColumnTitle>
//               <ul className="space-y-1">
//                 {usefulLinks.map(({ label, href }) => (
//                   <li key={label}>
//                     <Link href={href} className={linkCls}>
//                       <ChevronRight className={chevronCls} />
//                       {label}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* ───────── 3. QUICK LINKS ───────── */}
//             <div>
//               <ColumnTitle>Quick Links</ColumnTitle>
//               <ul className="space-y-1">
//                 {quickLinks.map(({ label, href }) => (
//                   <li key={label}>
//                     <Link href={href} className={linkCls}>
//                       <ChevronRight className={chevronCls} />
//                       {label}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* ───────── 4. OUR OFFICES ───────── */}
//             <div>
//               <ColumnTitle>Our Offices</ColumnTitle>
//               <ul className="space-y-1">
//                 {officeLinks.map(({ city, country, href }) => (
//                   <li key={city}>
//                     <Link
//                       href={href}
//                       className="group flex items-start gap-2.5 py-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c8a15a]"
//                     >
//                       <MapPin className="mt-1 h-3.5 w-3.5 shrink-0 text-slate-600 transition-colors group-hover:text-[#c8a15a]" />
//                       <span className="min-w-0">
//                         <span className="block text-sm text-slate-300 transition-colors group-hover:text-[#c8a15a]">
//                           {city}
//                         </span>
//                         <span className="block text-[11px] text-slate-500">
//                           {country}
//                         </span>
//                       </span>
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* ───────── 5. CONTACT ───────── */}
//             <div>
//               <ColumnTitle>Contact Us</ColumnTitle>

//               <div className="space-y-3">
//                 <Link href="/contact" className={contactCardCls}>
//                   <div className={contactIconCls}>
//                     <Globe className="h-4 w-4" />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
//                       Full Support
//                     </p>
//                     <p className="mt-0.5 text-sm text-slate-300 group-hover:text-[#c8a15a]">
//                       Contact Us Page →
//                     </p>
//                   </div>
//                 </Link>

//                 <a
//                   href="mailto:imechanic.net@gmail.com"
//                   className={contactCardCls}
//                 >
//                   <div className={contactIconCls}>
//                     <Mail className="h-4 w-4" />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
//                       Support Email
//                     </p>
//                     <p className="mt-0.5 truncate text-sm text-slate-300 group-hover:text-[#c8a15a]">
//                       imechanic.net@gmail.com
//                     </p>
//                   </div>
//                 </a>

//                 <a
//                   href="https://wa.me/8801895610891"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 transition-all duration-300 hover:border-green-500/30 hover:bg-green-500/5"
//                 >
//                   <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
//                     <MessageCircle className="h-4 w-4" />
//                   </div>
//                   <div>
//                     <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
//                       WhatsApp
//                     </p>
//                     <p className="mt-0.5 flex items-center gap-1.5 text-sm font-bold text-green-400">
//                       <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
//                       CHAT NOW
//                     </p>
//                   </div>
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ================================================================
//             BOTTOM BAR
//         ================================================================= */}
//         <div className="relative border-t border-white/10">
//           <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 px-4 py-5 sm:px-6 md:flex-row lg:px-8">
//             <p className="text-center text-xs text-slate-500 md:text-left">
//               © {new Date().getFullYear()} G Group. All rights reserved.
//             </p>

//             <div className="flex flex-wrap items-center justify-center gap-4">
//               <a
//                 href="https://github.com/MozammelHosen772"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 aria-label="Developer - Mozammel Hosen on GitHub"
//                 className="group flex items-center gap-2 text-xs text-slate-500"
//               >
//                 <Code2 className="h-3.5 w-3.5 text-slate-600" />
//                 <span>
//                   Developed by{" "}
//                   <span className="font-semibold text-slate-400 transition-colors duration-300 group-hover:text-[#c8a15a]">
//                     Ggroup
//                   </span>
//                 </span>
//                 <ChevronRight className="h-3 w-3 text-slate-600" />
//               </a>
//             </div>
//           </div>
//         </div>
//       </section>
//     </footer>
//   );
// }

"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { ISocialMedia } from "@/services/settings/socialMedia.service";

import {
  ArrowRight,
  ArrowUp,
  ChevronRight,
  Code2,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";

// ─── Static data ──────────────────────────────────────────────────────────────

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Ecosystem", href: "/#ecosystem" },
  { label: "Insights", href: "/#insights" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Latest news", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

// Office link: href e tomar office page / contact page er link dao
const officeLinks = [
  { city: "New York", country: "United States", href: "/contact" },
  { city: "London", country: "United Kingdom", href: "/contact" },
  { city: "Dubai", country: "United Arab Emirates", href: "/contact" },
  { city: "Singapore", country: "Singapore", href: "/contact" },
  { city: "Hong Kong", country: "Hong Kong SAR", href: "/contact" },
];

const SUPPORT_EMAIL = "imechanic.net@gmail.com";
const WHATSAPP_URL = "https://wa.me/8801895610891";

// ─── Social SVG Icons ─────────────────────────────────────────────────────────

const iconProps = {
  viewBox: "0 0 24 24",
  className: "h-4 w-4 fill-current",
  xmlns: "http://www.w3.org/2000/svg",
};

const FacebookIcon = () => (
  <svg {...iconProps}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = () => (
  <svg {...iconProps}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919C8.333.014 8.741 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg {...iconProps}>
    <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
  </svg>
);

const TwitterXIcon = () => (
  <svg {...iconProps}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// ─── Social platform config ───────────────────────────────────────────────────

type SocialPlatform = {
  key: keyof Omit<ISocialMedia, "id">;
  label: string;
  Icon: () => React.ReactElement;
  baseUrl: string;
};

const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    key: "facebook",
    label: "Facebook",
    Icon: FacebookIcon,
    baseUrl: "https://facebook.com/",
  },
  {
    key: "instagram",
    label: "Instagram",
    Icon: InstagramIcon,
    baseUrl: "https://instagram.com/",
  },
  {
    key: "youtube",
    label: "YouTube",
    Icon: YoutubeIcon,
    baseUrl: "https://youtube.com/",
  },
  {
    key: "twitter",
    label: "Twitter / X",
    Icon: TwitterXIcon,
    baseUrl: "https://twitter.com/",
  },
];

// ─── Shared pieces ────────────────────────────────────────────────────────────

const focusCls =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e0c28a]";

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="font-serif text-xl text-white">{children}</h3>
      <span className="mt-2 block h-px w-10 bg-[#c8a15a]" />
    </div>
  );
}

const linkCls = `group inline-flex items-center gap-2 py-1.5 text-[15px] text-[#968f83] transition-all duration-300 hover:translate-x-1 hover:text-[#e0c28a] ${focusCls}`;

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  socialMedia: ISocialMedia | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PublicFooterClient({ socialMedia }: Props) {
  const { theme } = useTheme();

  const activeSocialLinks = SOCIAL_PLATFORMS.filter(
    ({ key }) => socialMedia?.[key],
  );

  return (
    <footer className="w-full">
      <section className="relative overflow-hidden border-t border-[#c8a15a]/30 bg-gradient-to-b from-[#12100c] to-[#0c0a08] text-[#d8d2c8]">
        {/* Gold glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#c8a15a]/10 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-[#c8a15a]/5 blur-[120px]"
        />

        <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          {/* ───────── CTA band ───────── */}
          <div className="flex flex-col items-start justify-between gap-8 border-b border-[#c8a15a]/20 py-14 lg:flex-row lg:items-center lg:py-16">
            <div>
              <h2 className="font-serif text-4xl font-medium leading-[1.1] text-white sm:text-5xl">
                Let&apos;s build something
                <br />
                <span className="text-[#c8a15a]">that lasts.</span>
              </h2>
              <p className="mt-4 max-w-[460px] border-l border-[#c8a15a]/40 pl-5 text-[15px] leading-[1.8] text-[#968f83]">
                Talk to our team about partnerships, investments or ideas for a
                brighter tomorrow.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className={`group inline-flex h-12 items-center justify-center bg-[#c8a15a] px-7 text-sm font-medium text-[#120e09] transition-all duration-300 hover:bg-[#e0c28a] hover:shadow-[0_0_28px_rgba(200,161,90,0.4)] ${focusCls}`}
              >
                Connect with us
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className={`inline-flex h-12 items-center justify-center border border-[#c8a15a]/60 px-7 text-sm text-[#e0c28a] transition-colors duration-300 hover:border-[#c8a15a] hover:bg-[#c8a15a]/10 ${focusCls}`}
              >
                Email us
              </a>
            </div>
          </div>

          {/* ───────── Main grid ───────── */}
          <div className="grid grid-cols-1 gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:gap-10">
            {/* 1. Brand */}
            <div className="sm:col-span-2 lg:col-span-1 lg:pr-6">
              <Link
                href="/"
                className={`inline-flex items-center ${focusCls}`}
                aria-label="G Group home"
              >
                {theme?.footerLogoUrl ? (
                  <Image
                    src={theme.footerLogoUrl}
                    alt="G Group"
                    width={140}
                    height={45}
                    sizes="140px"
                    priority
                    className="object-contain"
                  />
                ) : (
                  <span className="font-serif text-3xl font-semibold text-[#e0c28a]">
                    G Group
                  </span>
                )}
              </Link>

              <p className="mt-5 max-w-[320px] text-[15px] leading-[1.8] text-[#968f83]">
                Building enduring businesses across essential sectors, for
                people, partners and generations to come.
              </p>

              {activeSocialLinks.length > 0 && (
                <div className="mt-7 flex items-center gap-2.5">
                  {activeSocialLinks.map(({ key, label, Icon, baseUrl }) => {
                    const value = socialMedia![key]!;
                    const href = value.startsWith("http")
                      ? value
                      : `${baseUrl}${value}`;

                    return (
                      <Link
                        key={key}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c8a15a]/40 text-[#e0c28a] transition-all duration-300 hover:-translate-y-1 hover:border-[#c8a15a] hover:bg-[#c8a15a] hover:text-[#0c0a08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0c28a]"
                      >
                        <Icon />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Explore */}
            <div>
              <ColumnTitle>Explore</ColumnTitle>
              <ul>
                {exploreLinks.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className={linkCls}>
                      <ChevronRight className="h-3.5 w-3.5 text-[#c8a15a]/60 transition-colors group-hover:text-[#c8a15a]" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Offices */}
            <div>
              <ColumnTitle>Our offices</ColumnTitle>
              <ul className="space-y-1.5">
                {officeLinks.map(({ city, country, href }) => (
                  <li key={city}>
                    <Link
                      href={href}
                      className={`group flex items-start gap-3 py-1 ${focusCls}`}
                    >
                      <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#c8a15a]/60 transition-colors group-hover:text-[#c8a15a]" />
                      <span className="min-w-0">
                        <span className="block text-[15px] text-[#d8d2c8] transition-colors group-hover:text-[#e0c28a]">
                          {city}
                        </span>
                        <span className="block text-xs text-[#968f83]/80">
                          {country}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Contact */}
            <div>
              <ColumnTitle>Contact us</ColumnTitle>
              <ul className="space-y-3">
                <li>
                  <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className={`group flex items-center gap-3 border border-[#c8a15a]/20 bg-[#14110c] p-3.5 transition-colors duration-300 hover:border-[#c8a15a] ${focusCls}`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#c8a15a]/40 text-[#c8a15a] transition-colors group-hover:bg-[#c8a15a] group-hover:text-[#0c0a08]">
                      <Mail className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs text-[#968f83]">
                        Support email
                      </span>
                      <span className="block truncate text-sm text-[#e9e2d3]">
                        {SUPPORT_EMAIL}
                      </span>
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center gap-3 border border-[#c8a15a]/20 bg-[#14110c] p-3.5 transition-colors duration-300 hover:border-[#c8a15a] ${focusCls}`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#c8a15a]/40 text-[#c8a15a] transition-colors group-hover:bg-[#c8a15a] group-hover:text-[#0c0a08]">
                      <MessageCircle className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-xs text-[#968f83]">
                        WhatsApp
                      </span>
                      <span className="flex items-center gap-2 text-sm text-[#e9e2d3]">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60 motion-reduce:animate-none" />
                          <span className="relative h-2 w-2 rounded-full bg-green-400" />
                        </span>
                        Chat now
                      </span>
                    </span>
                  </a>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className={`group inline-flex items-center gap-2 pt-1 text-sm text-[#e0c28a] ${focusCls}`}
                  >
                    <span className="border-b border-[#c8a15a]/60 pb-0.5">
                      Open contact page
                    </span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* ───────── Bottom bar ───────── */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-[#c8a15a]/20 py-6 md:flex-row">
            <p className="text-center text-[13px] text-[#968f83] md:text-left">
              © {new Date().getFullYear()} G Group. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-5">
              <a
                href="https://github.com/MozammelHosen772"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Developer - Mozammel Hosen on GitHub"
                className={`group flex items-center gap-2 text-[13px] text-[#968f83] ${focusCls}`}
              >
                <Code2 className="h-3.5 w-3.5 text-[#c8a15a]/60" />
                <span>
                  Developed by{" "}
                  <span className="text-[#d8d2c8] transition-colors duration-300 group-hover:text-[#e0c28a]">
                    Ggroup
                  </span>
                </span>
              </a>

              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                aria-label="Back to top"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c8a15a]/40 text-[#e0c28a] transition-all duration-300 hover:-translate-y-1 hover:bg-[#c8a15a] hover:text-[#0c0a08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0c28a]"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}
