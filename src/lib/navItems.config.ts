import { NavSection } from "@/types/dashboard.interface";
import { getDefaultDashboardRoute, UserRole } from "./auth-utils";

export const getCommonNavItems = (role: UserRole): NavSection[] => {
  const defaultDashboard = getDefaultDashboardRoute(role);

  return [
    {
      title: "Dashboard Management",
      items: [
        {
          title: "Dashboard",
          href: defaultDashboard,
          icon: "LayoutDashboard",
          roles: ["USER", "MODERATOR", "ADMIN", "SUPER_ADMIN"],
        },
      ],
    },
    {
      title: "Go To Home",
      items: [
        {
          title: "Home",
          href: "/",
          icon: "Home",
          roles: ["USER", "MODERATOR", "ADMIN", "SUPER_ADMIN"],
        },
      ],
    },
  ];
};

export const getModeratorNavItems = async (): Promise<NavSection[]> => {
  return [
    {
      title: "Repair Management",
      items: [
        {
          title: "Moderator",
          href: "/moderator/dashboard",
          icon: "Wrench",
          roles: ["MODERATOR"],
        },
      ],
    },
  ];
};

export const getUSERNavItems = async (): Promise<NavSection[]> => {
  return [
    {
      title: "Order Summery",
      items: [
        {
          title: "My Order",
          href: "/dashboard/my-order",
          icon: "ShoppingBag",
          roles: ["USER"],
        },
      ],
    },
  ];
};

// ─── Admin nav — with dropdowns ────────────────────────────────────────────
export const adminNavItems: NavSection[] = [
  {
    title: "User Management",
    items: [
      {
        title: "Users",
        href: "/admin/dashboard/users-management",
        icon: "Users",
        roles: ["ADMIN"],
        children: [
          {
            title: "All Users",
            href: "/admin/dashboard/all-users-management",
            icon: "Users",
            roles: ["ADMIN"],
          },
        ],
      },
    ],
  },
  {
    title: "Book Management",
    items: [
      {
        title: "Books",
        href: "/admin/dashboard/all-books-management",
        icon: "BookOpen",
        roles: ["ADMIN"],
        children: [
          {
            title: "Novel",
            href: "/admin/dashboard/all-books-management/novel",
            icon: "BookText",
            roles: ["ADMIN"],
          },
          {
            title: "Poem",
            href: "/admin/dashboard/all-books-management/poem",
            icon: "Feather",
            roles: ["ADMIN"],
          },
          {
            title: "Lyrics",
            href: "/admin/dashboard/all-books-management/lyrics",
            icon: "Music",
            roles: ["ADMIN"],
          },
          {
            title: "Other",
            href: "/admin/dashboard/all-books-management/other",
            icon: "FileText",
            roles: ["ADMIN"],
          },
        ],
      },
    ],
  },
  {
    title: "Home Pages Management",
    items: [
      {
        title: "Media",
        href: "/admin/dashboard/all-media-management",
        icon: "Layers",
        roles: ["ADMIN"],
        children: [
          {
            title: "Video",
            href: "/admin/dashboard/all-media-management/video",
            icon: "Video",
            roles: ["ADMIN"],
          },
          {
            title: "Audio",
            href: "/admin/dashboard/all-media-management/audio",
            icon: "AudioLines",
            roles: ["ADMIN"],
          },
          {
            title: "Image",
            href: "/admin/dashboard/all-media-management/image",
            icon: "Image",
            roles: ["ADMIN"],
          },
          {
            title: "Hero Banner ",
            href: "/admin/dashboard/all-media-management/ai-explore",
            icon: "Sparkles",
            roles: ["ADMIN"],
          },
          {
            title: "About Leader",
            href: "/admin/dashboard/all-media-management/about-leader",
            icon: "MessageSquare",
            roles: ["ADMIN"],
          },
          {
            title: "Idea Brighter",
            href: "/admin/dashboard/all-media-management/idea-brighter",
            icon: "MessageSquare",
            roles: ["ADMIN"],
          },
          {
            title: "The Ground",
            href: "/admin/dashboard/all-media-management/the-ground",
            icon: "MessageSquare",
            roles: ["ADMIN"],
          },
          {
            title: "Music",
            href: "/admin/dashboard/all-media-management/music",
            icon: "Music",
            roles: ["ADMIN"],
          },
          {
            title: "Musical Instruments",
            href: "/admin/dashboard/all-media-management/musical-instrument",
            icon: "Guitar",
            roles: ["ADMIN"],
          },
          {
            title: "Other",
            href: "/admin/dashboard/all-media-management/other",
            icon: "FileText",
            roles: ["ADMIN"],
          },
        ],
      },
    ],
  },

  {
    title: "Blog Management",
    items: [
      {
        title: "Blog",
        href: "/admin/dashboard/blog-management",
        icon: "Newspaper",
        roles: ["ADMIN"],
        children: [
          {
            title: "Create Blog",
            href: "/admin/dashboard/all-blog-management",
            icon: "PenSquare",
            roles: ["ADMIN"],
          },
          {
            title: " Blog List",
            href: "/admin/dashboard/all-blog-management/list",
            icon: "List",
            roles: ["ADMIN"],
          },
        ],
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        title: "Settings",
        href: "/admin/dashboard/appointments-management",
        icon: "Settings",
        roles: ["ADMIN", "SUPER_ADMIN"],
        children: [
          {
            title: "Theme",
            href: "/admin/dashboard/settings/theme",
            icon: "Palette",
            roles: ["ADMIN"],
          },
          {
            title: "Social Media",
            href: "/admin/dashboard/settings/social-media",
            icon: "Share2",
            roles: ["ADMIN"],
          },
          {
            title: "Payment Method",
            href: "/admin/dashboard/settings/payment-method",
            icon: "CreditCard",
            roles: ["ADMIN"],
          },
        ],
      },
      {
        title: "Pages",
        href: "/admin/dashboard/settings/pages",
        icon: "FileText",
        roles: ["ADMIN", "SUPER_ADMIN"],
        children: [
          {
            title: "About",
            href: "/admin/dashboard/settings/pages/about",
            icon: "Info",
            roles: ["ADMIN"],
          },
        ],
      },
    ],
  },
];

export const getNavItemsByRole = async (
  role: UserRole,
): Promise<NavSection[]> => {
  const commonNavItems = getCommonNavItems(role);

  switch (role) {
    case "SUPER_ADMIN":
    case "ADMIN":
      return [...commonNavItems, ...adminNavItems];
    case "MODERATOR":
      return [...commonNavItems, ...(await getModeratorNavItems())];
    case "USER":
      return [...commonNavItems, ...(await getUSERNavItems())];
    default:
      return [];
  }
};
