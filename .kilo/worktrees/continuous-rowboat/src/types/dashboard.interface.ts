import { UserRole } from "@/lib/auth-utils";

export interface NavItem {
  title: string;
  href: string;
  icon: string; // ✅ Changed from LucideIcon to string
  badge?: string | number;
  description?: string;
  roles: UserRole[];
  children?: NavItem[]; // ← এটা যোগ করো
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}
