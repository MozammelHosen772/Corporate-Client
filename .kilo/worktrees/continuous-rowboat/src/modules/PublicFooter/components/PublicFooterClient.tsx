// "use client";

// import { useTheme } from "@/contexts/ThemeContext";
// import { ISocialMedia } from "@/services/settings/socialMedia.service";
// import {
//   Award,
//   BadgeCheck,
//   ChevronRight,
//   Globe,
//   Headphones,
//   Mail,
//   MessageCircle,
//   Shield,
//   Truck,
// } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";

// // ─── Static data ──────────────────────────────────────────────────────────────

// const trustBadges = [
//   {
//     icon: Shield,
//     title: "Secure Checkout",
//     subtitle: "SSL Encrypted Payments",
//   },
//   {
//     icon: Headphones,
//     title: "24/7 Support",
//     subtitle: "Always here to help",
//   },
//   {
//     icon: Truck,
//     title: "Islandwide Shipping",
//     subtitle: "Fast & Reliable Delivery",
//   },
//   {
//     icon: BadgeCheck,
//     title: "100% Genuine",
//     subtitle: "Quality Guaranteed",
//   },
// ];

// const usefulLinks = [
//   { label: "Track Your Order", href: "/track-order" },
//   { label: "Latest News", href: "/blog" },
//   { label: "Our Collections", href: "/shop" },
// ];

// const policyLinks = [
//   { label: "Shipping & Delivery", href: "/shipping-delivery" },
//   { label: "Returns & Refunds", href: "/returns-refunds" },
//   { label: "Privacy Policy", href: "/privacy-policy" },
//   { label: "Terms of Service", href: "/terms-service" },
// ];

// const paymentMethods = ["VISA", "MC", "bKash", "Nagad"];

// // ─── Social SVG Icons ─────────────────────────────────────────────────────────

// const FacebookIcon = () => (
//   <svg
//     viewBox="0 0 24 24"
//     className="h-4 w-4 fill-current"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
//   </svg>
// );

// const InstagramIcon = () => (
//   <svg
//     viewBox="0 0 24 24"
//     className="h-4 w-4 fill-current"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
//   </svg>
// );

// const YoutubeIcon = () => (
//   <svg
//     viewBox="0 0 24 24"
//     className="h-4 w-4 fill-current"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
//   </svg>
// );

// const TwitterXIcon = () => (
//   <svg
//     viewBox="0 0 24 24"
//     className="h-4 w-4 fill-current"
//     xmlns="http://www.w3.org/2000/svg"
//   >
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
//       {/* ================================================================
//           TRUST BADGES
//       ================================================================= */}

//       <section className="border-y border-slate-200 bg-white">
//         <div className="mx-auto grid max-w-[1400px] grid-cols-2 px-2 py-5  md:grid-cols-4">
//           {trustBadges.map(({ icon: Icon, title, subtitle }, index) => (
//             <div
//               key={title}
//               className={`group flex items-center gap-3 px-3 py-3 transition-all duration-300 hover:bg-slate-50 ${
//                 index !== 0 ? "border-l border-slate-200" : ""
//               }`}
//             >
//               <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-all duration-300 group-hover:border-orange-200 group-hover:bg-orange-50 group-hover:text-orange-500">
//                 <Icon className="h-5 w-5" />
//               </div>

//               <div className="min-w-0">
//                 <p className="truncate text-sm font-bold text-slate-800">
//                   {title}
//                 </p>

//                 <p className="mt-0.5 truncate text-[11px] text-slate-500">
//                   {subtitle}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ================================================================
//           MAIN FOOTER
//       ================================================================= */}

//       <section className="relative overflow-hidden bg-[#0b1b34] text-white">
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

//         {/* Orange glow */}

//         <div
//           aria-hidden
//           className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl"
//         />

//         <div
//           aria-hidden
//           className="pointer-events-none absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-orange-500/5 blur-3xl"
//         />

//         <div className="relative mx-auto max-w-[1400px] px-2 py-14  lg:py-16">
//           {/* Top heading */}

//           <div className="mb-12 flex flex-col gap-6 border-b border-white/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
//             <div className="max-w-xl">
//               <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1.5">
//                 <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />

//                 <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400">
//                   Professional Repair & Service
//                 </span>
//               </div>

//               <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
//                 Quality service.
//                 <br />
//                 <span className="text-orange-500">Trusted every time.</span>
//               </h2>

//               <p className="mt-3 max-w-lg text-sm leading-6 text-slate-400">
//                 IMechanic BD — delivering premium curated items and dependable
//                 service right to your doorstep.
//               </p>
//             </div>

//             <Link
//               href="/repair-booking"
//               className="group inline-flex w-fit items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-950/20 transition-all duration-300 hover:bg-orange-600"
//             >
//               Book a Repair
//               <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
//             </Link>
//           </div>

//           {/* Main grid */}

//           <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
//             {/* ============================================================
//                 BRAND
//             ============================================================= */}

//             <div className="lg:pr-8">
//               <Link
//                 href="/"
//                 className="inline-flex items-center"
//                 aria-label="IMechnanic home"
//               >
//                 {theme?.footerLogoUrl ? (
//                   <Image
//                     src={theme.footerLogoUrl}
//                     alt="IMechnanic"
//                     width={140}
//                     height={45}
//                     sizes="140px"
//                     priority
//                     className="object-contain"
//                   />
//                 ) : (
//                   <span className="text-xl font-extrabold tracking-tight">
//                     IMechnanic
//                   </span>
//                 )}
//               </Link>

//               <p className="mt-5 text-sm leading-6 text-slate-400">
//                 IMechanic BD — delivering premium curated items to your
//                 doorstep. Quality, speed, and exceptional customer service at
//                 every step.
//               </p>

//               {/* Social */}

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
//                           className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500 hover:bg-orange-500 hover:text-white"
//                         >
//                           <Icon />
//                         </Link>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )}

//               {/* Small trust label */}

//               <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
//                 <Award className="h-4 w-4 text-orange-500" />
//                 <span>Trusted service partner</span>
//               </div>
//             </div>

//             {/* ============================================================
//                 USEFUL LINKS
//             ============================================================= */}

//             <div>
//               <div className="mb-5 flex items-center gap-2">
//                 <span className="h-5 w-1 rounded-full bg-orange-500" />

//                 <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-white">
//                   Useful Links
//                 </h4>
//               </div>

//               <ul className="space-y-1">
//                 {usefulLinks.map(({ label, href }) => (
//                   <li key={label}>
//                     <Link
//                       href={href}
//                       className="group flex items-center gap-2 py-2 text-sm text-slate-400 transition-colors duration-200 hover:text-orange-400"
//                     >
//                       <ChevronRight className="h-3.5 w-3.5 text-slate-600 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-orange-500" />
//                       {label}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* ============================================================
//                 POLICIES
//             ============================================================= */}

//             <div>
//               <div className="mb-5 flex items-center gap-2">
//                 <span className="h-5 w-1 rounded-full bg-orange-500" />

//                 <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-white">
//                   Policies
//                 </h4>
//               </div>

//               <ul className="space-y-1">
//                 {policyLinks.map(({ label, href }) => (
//                   <li key={label}>
//                     <Link
//                       href={href}
//                       className="group flex items-center gap-2 py-2 text-sm text-slate-400 transition-colors duration-200 hover:text-orange-400"
//                     >
//                       <ChevronRight className="h-3.5 w-3.5 text-slate-600 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-orange-500" />
//                       {label}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* ============================================================
//                 CONTACT
//             ============================================================= */}

//             <div>
//               <div className="mb-5 flex items-center gap-2">
//                 <span className="h-5 w-1 rounded-full bg-orange-500" />

//                 <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-white">
//                   Contact Us
//                 </h4>
//               </div>

//               <div className="space-y-3">
//                 {/* Contact */}

//                 <Link
//                   href="/contact"
//                   className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 transition-all duration-300 hover:border-orange-500/20 hover:bg-orange-500/5"
//                 >
//                   <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-slate-300 transition-colors group-hover:bg-orange-500/10 group-hover:text-orange-400">
//                     <Globe className="h-4 w-4" />
//                   </div>

//                   <div className="min-w-0">
//                     <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
//                       Full Support
//                     </p>

//                     <p className="mt-0.5 text-sm text-slate-300 group-hover:text-orange-400">
//                       Contact Us Page →
//                     </p>
//                   </div>
//                 </Link>

//                 {/* Email */}

//                 <a
//                   href="mailto:info@shoppingcart.bd"
//                   className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 transition-all duration-300 hover:border-orange-500/20 hover:bg-orange-500/5"
//                 >
//                   <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-slate-300 transition-colors group-hover:bg-orange-500/10 group-hover:text-orange-400">
//                     <Mail className="h-4 w-4" />
//                   </div>

//                   <div className="min-w-0">
//                     <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
//                       Support Email
//                     </p>

//                     <p className="mt-0.5 truncate text-sm text-slate-300 group-hover:text-orange-400">
//                       imechanic.net@gmail.com
//                     </p>
//                   </div>
//                 </a>

//                 {/* WhatsApp */}

//                 <a
//                   href="https://wa.me/+8801895-610891"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 transition-all duration-300 hover:border-green-500/20 hover:bg-green-500/5"
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
//           <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 px-4 py-5 sm:px-6 md:flex-row">
//             <p className="text-center text-xs text-slate-500 md:text-left">
//               © {new Date().getFullYear()} IMechanic BD. All rights reserved.
//             </p>

//             <div className="flex items-center gap-2">
//               <span className="mr-1 text-[10px] font-medium uppercase tracking-wider text-slate-600">
//                 Payments
//               </span>

//               {paymentMethods.map((method) => (
//                 <span
//                   key={method}
//                   className="flex h-7 min-w-[42px] items-center justify-center rounded-md bg-white px-2 text-[10px] font-extrabold text-slate-800 shadow-sm"
//                 >
//                   {method}
//                 </span>
//               ))}
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
  Award,
  ChevronRight,
  Code2,
  Globe,
  Mail,
  MessageCircle,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";

// ─── Static data ──────────────────────────────────────────────────────────────

const locations = ["Jamuna Future Park (IMechanic BD)"];

const usefulLinks = [
  { label: "Latest News", href: "/blog" },
  { label: "Our Collections", href: "/shop" },
];

const policyLinks = [
  { label: "Shipping & Delivery", href: "/shipping-delivery" },
  { label: "Returns & Refunds", href: "/returns-refunds" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-service" },
];

const paymentMethods = ["MC", "bKash", "Nagad", "Rocket", "Bank"];

// ─── Social SVG Icons ─────────────────────────────────────────────────────────

const FacebookIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4 fill-current"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4 fill-current"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919C8.333.014 8.741 0 12 0zm0 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4 fill-current"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
  </svg>
);

const TwitterXIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4 fill-current"
    xmlns="http://www.w3.org/2000/svg"
  >
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
      {/* ================================================================
          TRUST BADGES
      ================================================================= */}
      <div className="max-w-4xl mx-auto px-6 mt-14 text-center mb-6">
        <span className="inline-block border border-gray-300 rounded-full px-5 py-2 text-sm font-semibold text-gray-700">
          Available at
        </span>

        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {locations.map((loc) => (
            <span
              key={loc}
              className="bg-orange-500 text-white text-sm font-semibold px-5 py-2 rounded-full"
            >
              {loc}
            </span>
          ))}
        </div>
      </div>
      {/* ================================================================
          MAIN FOOTER
      ================================================================= */}

      <section className="relative overflow-hidden bg-[#0b1b34] text-white">
        {/* Background grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "34px 34px",
          }}
        />

        {/* Orange glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl"
        />

        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-orange-500/5 blur-3xl"
        />

        <div className="relative mx-auto max-w-[1400px] px-2 py-14 lg:py-16">
          {/* Top heading */}

          {/* Main grid */}
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {/* BRAND */}
            <div className="lg:pr-8">
              <Link
                href="/"
                className="inline-flex items-center"
                aria-label="IMechanic home"
              >
                {theme?.footerLogoUrl ? (
                  <Image
                    src={theme.footerLogoUrl}
                    alt="IMechanic"
                    width={140}
                    height={45}
                    sizes="140px"
                    priority
                    className="object-contain"
                  />
                ) : (
                  <span className="text-xl font-extrabold tracking-tight">
                    IMechanic
                  </span>
                )}
              </Link>

              <p className="mt-5 text-sm leading-6 text-slate-400">
                IMechanic BD — delivering premium curated items to your
                doorstep. Quality, speed, and exceptional customer service at
                every step.
              </p>

              {/* Social */}
              {activeSocialLinks.length > 0 && (
                <div className="mt-6">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Follow us
                  </p>

                  <div className="flex items-center gap-2">
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
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500 hover:bg-orange-500 hover:text-white"
                        >
                          <Icon />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Trust label */}
              <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
                <Award className="h-4 w-4 text-orange-500" />
                <span>Trusted service partner</span>
              </div>
            </div>

            {/* USEFUL LINKS */}
            <div>
              <div className="mb-5 flex items-center gap-2">
                <span className="h-5 w-1 rounded-full bg-orange-500" />

                <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-white">
                  Useful Links
                </h4>
              </div>

              <ul className="space-y-1">
                {usefulLinks.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="group flex items-center gap-2 py-2 text-sm text-slate-400 transition-colors duration-200 hover:text-orange-400"
                    >
                      <ChevronRight className="h-3.5 w-3.5 text-slate-600 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-orange-500" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* POLICIES */}
            <div>
              <div className="mb-5 flex items-center gap-2">
                <span className="h-5 w-1 rounded-full bg-orange-500" />

                <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-white">
                  Policies
                </h4>
              </div>

              <ul className="space-y-1">
                {policyLinks.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="group flex items-center gap-2 py-2 text-sm text-slate-400 transition-colors duration-200 hover:text-orange-400"
                    >
                      <ChevronRight className="h-3.5 w-3.5 text-slate-600 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-orange-500" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CONTACT */}
            <div>
              <div className="mb-5 flex items-center gap-2">
                <span className="h-5 w-1 rounded-full bg-orange-500" />

                <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-white">
                  Contact Us
                </h4>
              </div>

              <div className="space-y-3">
                {/* Contact */}
                <Link
                  href="/contact"
                  className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 transition-all duration-300 hover:border-orange-500/20 hover:bg-orange-500/5"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-slate-300 transition-colors group-hover:bg-orange-500/10 group-hover:text-orange-400">
                    <Globe className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Full Support
                    </p>

                    <p className="mt-0.5 text-sm text-slate-300 group-hover:text-orange-400">
                      Contact Us Page →
                    </p>
                  </div>
                </Link>

                {/* Email */}
                <a
                  href="mailto:imechanic.net@gmail.com"
                  className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 transition-all duration-300 hover:border-orange-500/20 hover:bg-orange-500/5"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-slate-300 transition-colors group-hover:bg-orange-500/10 group-hover:text-orange-400">
                    <Mail className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Support Email
                    </p>

                    <p className="mt-0.5 truncate text-sm text-slate-300 group-hover:text-orange-400">
                      imechanic.net@gmail.com
                    </p>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/8801895610891"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 transition-all duration-300 hover:border-green-500/20 hover:bg-green-500/5"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                    <MessageCircle className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      WhatsApp
                    </p>

                    <p className="mt-0.5 flex items-center gap-1.5 text-sm font-bold text-green-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                      CHAT NOW
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================
            BOTTOM BAR
        ================================================================= */}

        <div className="relative border-t border-white/10">
          <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 px-4 py-5 sm:px-6 md:flex-row">
            {/* Copyright */}
            <p className="text-center text-xs text-slate-500 md:text-left">
              © {new Date().getFullYear()} IMechanic BD. All rights reserved.
            </p>

            {/* Developer + Payments */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              {/* Developer Link */}
              <a
                href="https://github.com/Mozammel772"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Developer - Mozammel Hosen on GitHub"
                className="group flex items-center gap-2 text-xs text-slate-500"
              >
                <Code2 className="h-3.5 w-3.5 text-slate-600" />

                <span>
                  Developed by{" "}
                  <span className="font-semibold text-slate-400 transition-colors duration-300 group-hover:text-orange-400">
                    IMechanic
                  </span>
                </span>

                <ChevronRight className="h-3 w-3 text-slate-600" />
              </a>

              {/* Divider */}
              <span className="hidden h-4 w-px bg-white/10 sm:block" />

              {/* Payments */}
              <div className="flex items-center gap-2">
                <span className="mr-1 text-[10px] font-medium uppercase tracking-wider text-slate-600">
                  Payments
                </span>

                {paymentMethods.map((method) => (
                  <span
                    key={method}
                    className="flex h-7 min-w-[42px] items-center justify-center rounded-md bg-white px-2 text-[10px] font-extrabold text-slate-800 shadow-sm"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}
