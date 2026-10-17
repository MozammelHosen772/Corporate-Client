import { useTheme } from "@/contexts/ThemeContext";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const menuItems = [
  { label: "Home", href: "/" },
  { label: "Offers", href: "/offers" },
  { label: "Track Order", href: "/track-order" },
  { label: "FAQ", href: "/faq" },
  { label: "Return & Exchange", href: "/return-exchange" },
  { label: "Shipping", href: "/shipping" },
  { label: "Size Charts", href: "/size-chart" },
  { label: "Cookies Policy", href: "/cookies-policy" },
  { label: "Terms & Conditions", href: "/terms-conditions" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export default function MobileMenuDrawer({ open, onClose }: Props) {
  const { theme } = useTheme();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleResize = () => {
      if (mediaQuery.matches) onClose();
    };
    handleResize();
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, [onClose]);

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-black/40 z-40"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation menu"
        className="fixed top-0 left-0 h-full w-[65%] max-w-sm bg-white z-50 animate-slideLeft overflow-y-auto md:hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <Link href="/" className="shrink-0">
            {theme?.logoUrl ? (
              <Image
                src={theme.logoUrl}
                alt="Taqwa Tech"
                width={120}
                height={40}
                sizes="120px"
                priority
              />
            ) : (
              <span className="text-lg font-bold">Taqwa Tech</span>
            )}
          </Link>

          <button
            onClick={onClose}
            aria-label="Close menu"
            className="cursor-pointer"
          >
            <X aria-hidden="true" />
          </button>
        </div>

        {/* Menu */}
        <ul className="divide-y">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
                className="block px-4 py-3 text-base hover:bg-gray-100 transition"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
