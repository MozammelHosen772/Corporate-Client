import {
  Home,
  Images,
  Info,
  Layers,
  Mail,
  Newspaper,
  type LucideIcon,
} from "lucide-react";

export type NavChild = {
  label: string;
  href: string;
  meta?: string;
};

export type NavItem = {
  label: string;
  href?: string;
  icon?: LucideIcon;
  children?: NavChild[];
};

export const PUBLIC_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "About", href: "/#about", icon: Info },
  { label: "Ecosystem", href: "/#ecosystem", icon: Layers },
  { label: "Insights", href: "/#insights", icon: Newspaper },
  { label: "Gallery", href: "/#gallery", icon: Images },
  { label: "Contact", href: "/contact", icon: Mail },
];
