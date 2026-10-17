import { KeyRound, LayoutDashboard, Package, User } from "lucide-react";

const accountMenu = [
  {
    name: "My Profile",
    href: "/account/my-profile",
    icon: User,
  },
  {
    name: "Change Password",
    href: "/account/change-password",
    icon: KeyRound,
  },
];

const adminMenu = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },

  ...accountMenu,
];

export const navbarRoleBaseMenu = {
  SUPER_ADMIN: adminMenu,

  ADMIN: adminMenu,

  MODERATOR: [
    {
      name: "Dashboard",
      href: "/moderator/dashboard",
      icon: LayoutDashboard,
    },
    ...accountMenu,
  ],

  USER: [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Orders",
      href: "/dashboard/my-order",
      icon: Package,
    },

    ...accountMenu, // ← user এও
  ],
};
