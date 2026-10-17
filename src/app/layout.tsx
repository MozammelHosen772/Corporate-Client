import SessionExpiredHandler from "@/components/SessionExpiredHandler";

import Providers from "@/providers/Providers";
import { getPublicTheme } from "@/services/settings/theme.service";
import type { Metadata, Viewport } from "next";
import { Bai_Jamjuree, Sora } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";
import "./globals.css";

const baiJamjuree = Bai_Jamjuree({
  subsets: ["latin"],
  variable: "--font-bai",
  weight: ["400", "500", "600"],
  display: "swap",
  preload: true,
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  preload: false,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ea580c",
};

// ⚠️ তোমার আসল ডোমেইন — সব জায়গায় এটাই কনসিসটেন্ট ভাবে ব্যবহার হচ্ছে
const SITE_URL = "https://imechanic.com.bd";

export async function generateMetadata(): Promise<Metadata> {
  const theme = await getPublicTheme();

  return {
    title: {
      default:
        "IMechanic - Mobile & Device Repair Service Center + Phone Shop in Dhaka",
      template: "%s | IMechanic",
    },
    description:
      "IMechanic is a trusted mobile, tablet & laptop repair service center located in Jamuna Future Park, Dhaka. We offer screen replacement, battery replacement, water damage repair, motherboard repair, software fix, and also sell brand new & used smartphones at the best price in Bangladesh.",
    keywords: [
      // ── Brand ──────────────────────────────────
      "IMechanic",
      "IMechanic BD",
      "IMechanic Jamuna Future Park",
      "IMechanic Dhaka",

      // ── Repair — general ───────────────────────
      "mobile repair",
      "phone repair",
      "mobile repair shop",
      "phone repair shop",
      "mobile repair near me",
      "phone repair near me",
      "mobile repairing center",
      "device repair service",
      "smartphone repair service",
      "electronics repair shop Dhaka",
      "mobile servicing center Dhaka",
      "mobile repair shop in Dhaka",
      "best mobile repair shop in Bangladesh",
      "mobile repair shop near Jamuna Future Park",
      "মোবাইল রিপেয়ার",
      "মোবাইল সার্ভিসিং সেন্টার",
      "মোবাইল মেরামত",
      "ফোন রিপেয়ার ঢাকা",
      "মোবাইল রিপেয়ারিং সেন্টার ঢাকা",

      // ── Repair — specific issues ───────────────
      "phone screen replacement",
      "mobile display replacement",
      "broken screen repair",
      "phone battery replacement",
      "mobile battery change",
      "water damage phone repair",
      "liquid damage repair",
      "motherboard repair",
      "IC repair mobile",
      "charging port repair",
      "camera repair mobile",
      "speaker repair mobile",
      "mic repair mobile",
      "back glass replacement",
      "phone software repair",
      "phone unlock service",
      "IMEI repair",
      "network problem solve mobile",

      // ── Repair — brand specific ────────────────
      "iPhone repair Dhaka",
      "iPhone screen replacement Bangladesh",
      "iPhone battery replacement Bangladesh",
      "Samsung mobile repair",
      "Samsung screen replacement",
      "Xiaomi mobile repair",
      "Redmi mobile repair",
      "Oppo mobile repair",
      "Vivo mobile repair",
      "Realme mobile repair",
      "Huawei mobile repair",
      "OnePlus repair Dhaka",
      "laptop repair Dhaka",
      "tablet repair Dhaka",
      "iPad repair Bangladesh",

      // ── Buy / Sell phones ──────────────────────
      "buy mobile phone online Bangladesh",
      "smartphone price in Bangladesh",
      "mobile phone shop Dhaka",
      "used phone shop Dhaka",
      "second hand mobile Dhaka",
      "new phone price Bangladesh",
      "iPhone price in Bangladesh",
      "Samsung price in Bangladesh",
      "best mobile shop Jamuna Future Park",
      "mobile accessories shop Dhaka",

      // ── Location ────────────────────────────────
      "Jamuna Future Park mobile shop",
      "Jamuna Future Park repair shop",
      "Baridhara mobile repair",
      "Progoti Sharani mobile shop",
      "mobile repair shop Dhaka 1229",

      // ── General ecommerce (আগের থেকে রাখা হলো) ──
      "bangladesh ecommerce",
      "online shopping bangladesh",
      "ecommerce bd",
      "bd online shop",
      "buy products online bangladesh",
      "trusted online shop bd",
      "fast delivery bangladesh",
    ],
    authors: [{ name: "IMechanic Team" }],
    creator: "IMechanic",
    metadataBase: new URL(SITE_URL),
    openGraph: {
      title:
        "IMechanic - Mobile & Device Repair Service Center + Phone Shop in Dhaka",
      description:
        "Trusted mobile, tablet & laptop repair service in Jamuna Future Park, Dhaka. Screen, battery, water damage & motherboard repair — plus new & used phones for sale.",
      url: SITE_URL,
      siteName: "IMechanic",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "IMechanic - Mobile Repair & Phone Shop in Dhaka",
        },
      ],
      locale: "en_US",
      alternateLocale: ["bn_BD"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "IMechanic - Mobile Repair & Phone Shop in Dhaka",
      description:
        "Screen repair, battery replacement, water damage repair & phone sales — all in one place at Jamuna Future Park, Dhaka.",
      images: ["/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: theme?.faviconUrl || "/favicon.ico",
      shortcut: theme?.faviconUrl || "/favicon.ico",
      apple: theme?.faviconUrl || "/favicon.ico",
    },
    alternates: {
      canonical: SITE_URL,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = await getPublicTheme();

  return (
    <html
      lang="en"
      className={`${baiJamjuree.variable} ${sora.variable} h-full antialiased`}
    >
      <head>
        {/* ── LocalBusiness + Repair Service Schema — Google-এ "mobile
            repair near me" / "phone repair Dhaka" ইত্যাদি সার্চে সাহায্য করবে ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["ElectronicsStore", "LocalBusiness"],
              "@id": `${SITE_URL}/#organization`,
              name: "IMechanic",
              alternateName: "IMechanic Mobile & Device Repair Center",
              url: SITE_URL,
              logo: `${SITE_URL}/logo.png`,
              image: `${SITE_URL}/og-image.png`,
              description:
                "IMechanic is a mobile, tablet & laptop repair service center in Jamuna Future Park, Dhaka. We repair screens, batteries, water-damaged devices, motherboards, and also sell new & used smartphones.",
              telephone: "+8801895610893",
              email: "imechanic.net@gmail.com",
              priceRange: "৳৳",
              currenciesAccepted: "BDT",
              paymentAccepted: "Cash, bKash, Nagad, Card",
              address: {
                "@type": "PostalAddress",
                streetAddress:
                  "4B-025D, Level-4, Jamuna Future Park, KA-244, Progoti Shoroni, Baridhara",
                addressLocality: "Dhaka",
                postalCode: "1229",
                addressCountry: "BD",
              },
              areaServed: "BD",
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Saturday",
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                  ],
                  opens: "11:00",
                  closes: "21:00",
                },
              ],
              // ── কোন কোন সার্ভিস দেওয়া হয় — repair related search এ ranking বাড়ায় ──
              makesOffer: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Mobile Screen Replacement",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Mobile Battery Replacement",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Water / Liquid Damage Repair",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Motherboard & IC Repair",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Charging Port Repair",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Software & IMEI Repair",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Product",
                    name: "New & Used Smartphones",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className="min-h-full flex flex-col font-sans pb-16  md:pb-0"
        suppressHydrationWarning={true}
      >
        {/* <TopLoader /> */}
        <Providers initialTheme={theme}>
          <SessionExpiredHandler />
          {children}
        </Providers>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
