// import type { LucideIcon } from "lucide-react";
// import {
//   BatteryCharging,
//   Bluetooth,
//   Cable,
//   Car,
//   Fan,
//   Headphones,
//   Home,
//   Plug,
//   Radio,
//   Smartphone,
//   Sparkles,
//   Speaker,
//   Usb,
//   Watch,
// } from "lucide-react";

// export type SubCategory = {
//   label: string;
//   href: string;
// };

// export type Category = {
//   label: string;
//   href: string;
//   icon: LucideIcon;
//   children?: SubCategory[];
// };

// export const categories: Category[] = [
//   {
//     label: "Adapters & Cables",
//     href: "/product-category/adapters-cables",
//     icon: Plug,
//     children: [
//       { label: "Adapters", href: "/product-category/adapters-cables/adapters" },
//       {
//         label: "Bluetooth & WIFI Receivers",
//         href: "/product-category/adapters-cables/bluetooth-wifi-receivers",
//       },
//       { label: "Cables", href: "/product-category/adapters-cables/cables" },
//       {
//         label: "Dongles & Converters",
//         href: "/product-category/adapters-cables/dongles-converters",
//       },
//       {
//         label: "Multiplugs",
//         href: "/product-category/adapters-cables/multiplugs",
//       },
//       {
//         label: "Universal Adapters",
//         href: "/product-category/adapters-cables/universal-adapters",
//       },
//       {
//         label: "Wireless Chargers",
//         href: "/product-category/adapters-cables/wireless-chargers",
//       },
//     ],
//   },
//   {
//     label: "Car Accessories",
//     href: "/product-category/car-accessories",
//     icon: Car,
//   },
//   { label: "Headsets", href: "/product-category/headsets", icon: Headphones },
//   {
//     label: "Home Appliances",
//     href: "/product-category/home-appliances",
//     icon: Home,
//     children: [
//       {
//         label: "Accessories",
//         href: "/product-category/home-appliances/accessories",
//       },
//       {
//         label: "Cleaning Appliances",
//         href: "/product-category/home-appliances/cleaning-appliances",
//       },
//       { label: "Clocks", href: "/product-category/home-appliances/clocks" },
//       {
//         label: "Electric Heaters",
//         href: "/product-category/home-appliances/electric-heaters",
//       },
//       {
//         label: "Humidifier",
//         href: "/product-category/home-appliances/humidifier",
//       },
//       {
//         label: "Kitchen Appliances",
//         href: "/product-category/home-appliances/kitchen-appliances",
//       },
//       {
//         label: "Mosquito Bats",
//         href: "/product-category/home-appliances/mosquito-bats",
//       },
//       {
//         label: "Security & Surveillance Devices",
//         href: "/product-category/home-appliances/security-surveillance-devices",
//       },
//       {
//         label: "Security Camera",
//         href: "/product-category/home-appliances/security-camera",
//       },
//       { label: "TV Box", href: "/product-category/home-appliances/tv-box" },
//     ],
//   },
//   {
//     label: "Lifestyle",
//     href: "/product-category/lifestyle",
//     icon: Sparkles,
//     children: [
//       { label: "Bags", href: "/product-category/lifestyle/bags" },
//       { label: "Fans", href: "/product-category/lifestyle/fans" },
//       { label: "Keyboard", href: "/product-category/lifestyle/keyboard" },
//       { label: "Lamps", href: "/product-category/lifestyle/lamps" },
//       { label: "Massagers", href: "/product-category/lifestyle/massagers" },
//       { label: "Mouse", href: "/product-category/lifestyle/mouse" },
//       { label: "Mouse Pad", href: "/product-category/lifestyle/mouse-pad" },
//       {
//         label: "Nail Clippers",
//         href: "/product-category/lifestyle/nail-clippers",
//       },
//       { label: "Pens", href: "/product-category/lifestyle/pens" },
//       { label: "Router", href: "/product-category/lifestyle/router" },
//       { label: "Stands", href: "/product-category/lifestyle/stands" },
//       { label: "Sunglasses", href: "/product-category/lifestyle/sunglasses" },
//       { label: "Trackers", href: "/product-category/lifestyle/trackers" },
//       { label: "Trimmers", href: "/product-category/lifestyle/trimmers" },
//       { label: "Umbrellas", href: "/product-category/lifestyle/umbrellas" },
//     ],
//   },
//   { label: "Neckbands", href: "/product-category/neckbands", icon: Radio },
//   { label: "Pen Drive", href: "/product-category/pen-drive", icon: Usb },
//   {
//     label: "Phone Accessories",
//     href: "/product-category/phone-accessories",
//     icon: Smartphone,
//     children: [
//       { label: "Battery", href: "/product-category/phone-accessories/battery" },
//       {
//         label: "Gimbal & Selfie Stick",
//         href: "/product-category/phone-accessories/gimbal-selfie-stick",
//       },
//       {
//         label: "Microphone",
//         href: "/product-category/phone-accessories/microphone",
//       },
//       {
//         label: "Phone Case",
//         href: "/product-category/phone-accessories/phone-case",
//       },
//       {
//         label: "Phone Cooler",
//         href: "/product-category/phone-accessories/phone-cooler",
//       },
//       {
//         label: "Screen Protector",
//         href: "/product-category/phone-accessories/screen-protector",
//       },
//     ],
//   },
//   {
//     label: "Powerbanks",
//     href: "/product-category/powerbanks",
//     icon: BatteryCharging,
//   },
//   {
//     label: "Rechargeable Fans",
//     href: "/product-category/rechargeable-fans",
//     icon: Fan,
//   },
//   {
//     label: "Smart Watches",
//     href: "/product-category/smart-watches",
//     icon: Watch,
//     children: [
//       {
//         label: "Watch Screen Protector",
//         href: "/product-category/smart-watches/watch-screen-protector",
//       },
//       {
//         label: "Watch Strap",
//         href: "/product-category/smart-watches/watch-strap",
//       },
//     ],
//   },
//   { label: "Speakers", href: "/product-category/speakers", icon: Speaker },
//   {
//     label: "TWS",
//     href: "/product-category/tws",
//     icon: Bluetooth,
//     children: [{ label: "TWS Case", href: "/product-category/tws/tws-case" }],
//   },
//   {
//     label: "Wired Earphones",
//     href: "/product-category/wired-earphones",
//     icon: Cable,
//   },
// ];

// export const mainNavLinks = [
//   { label: "Shop", href: "/shop" },
//   { label: "New Arrivals", href: "/new-arrivals" },
//   { label: "Hot Offer", href: "/offers" },
//   { label: "Blog", href: "/blog" },
//   { label: "Pre Order", href: "/pre-order" },
// ] as const;
import type { LucideIcon } from "lucide-react";
import {
  BatteryCharging,
  Bluetooth,
  Cable,
  Car,
  Fan,
  Headphones,
  Home,
  Plug,
  Radio,
  Smartphone,
  Sparkles,
  Speaker,
  Usb,
  Watch,
} from "lucide-react";

export type SubCategory = {
  label: string;
  href: string;
};

export type Category = {
  label: string;
  href: string;
  icon: LucideIcon;
  children?: SubCategory[];
};

export const categories: Category[] = [
  {
    label: "Adapters & Cables",
    href: "/shop/adapters-cables",
    icon: Plug,
    children: [
      { label: "Adapters", href: "/shop/adapters-cables/adapters" },
      {
        label: "Bluetooth & WIFI Receivers",
        href: "/shop/adapters-cables/bluetooth-wifi-receivers",
      },
      { label: "Cables", href: "/shop/adapters-cables/cables" },
      {
        label: "Dongles & Converters",
        href: "/shop/adapters-cables/dongles-converters",
      },
      {
        label: "Multiplugs",
        href: "/shop/adapters-cables/multiplugs",
      },
      {
        label: "Universal Adapters",
        href: "/shop/adapters-cables/universal-adapters",
      },
      {
        label: "Wireless Chargers",
        href: "/shop/adapters-cables/wireless-chargers",
      },
    ],
  },
  {
    label: "Car Accessories",
    href: "/shop/car-accessories",
    icon: Car,
  },
  { label: "Headsets", href: "/shop/headsets", icon: Headphones },
  {
    label: "Home Appliances",
    href: "/shop/home-appliances",
    icon: Home,
    children: [
      {
        label: "Accessories",
        href: "/shop/home-appliances/accessories",
      },
      {
        label: "Cleaning Appliances",
        href: "/shop/home-appliances/cleaning-appliances",
      },
      { label: "Clocks", href: "/shop/home-appliances/clocks" },
      {
        label: "Electric Heaters",
        href: "/shop/home-appliances/electric-heaters",
      },
      {
        label: "Humidifier",
        href: "/shop/home-appliances/humidifier",
      },
      {
        label: "Kitchen Appliances",
        href: "/shop/home-appliances/kitchen-appliances",
      },
      {
        label: "Mosquito Bats",
        href: "/shop/home-appliances/mosquito-bats",
      },
      {
        label: "Security & Surveillance Devices",
        href: "/shop/home-appliances/security-surveillance-devices",
      },
      {
        label: "Security Camera",
        href: "/shop/home-appliances/security-camera",
      },
      { label: "TV Box", href: "/shop/home-appliances/tv-box" },
    ],
  },
  {
    label: "Lifestyle",
    href: "/shop/lifestyle",
    icon: Sparkles,
    children: [
      { label: "Bags", href: "/shop/lifestyle/bags" },
      { label: "Fans", href: "/shop/lifestyle/fans" },
      { label: "Keyboard", href: "/shop/lifestyle/keyboard" },
      { label: "Lamps", href: "/shop/lifestyle/lamps" },
      { label: "Massagers", href: "/shop/lifestyle/massagers" },
      { label: "Mouse", href: "/shop/lifestyle/mouse" },
      { label: "Mouse Pad", href: "/shop/lifestyle/mouse-pad" },
      {
        label: "Nail Clippers",
        href: "/shop/lifestyle/nail-clippers",
      },
      { label: "Pens", href: "/shop/lifestyle/pens" },
      { label: "Router", href: "/shop/lifestyle/router" },
      { label: "Stands", href: "/shop/lifestyle/stands" },
      { label: "Sunglasses", href: "/shop/lifestyle/sunglasses" },
      { label: "Trackers", href: "/shop/lifestyle/trackers" },
      { label: "Trimmers", href: "/shop/lifestyle/trimmers" },
      { label: "Umbrellas", href: "/shop/lifestyle/umbrellas" },
    ],
  },
  { label: "Neckbands", href: "/shop/neckbands", icon: Radio },
  { label: "Pen Drive", href: "/shop/pen-drive", icon: Usb },
  {
    label: "Phone Accessories",
    href: "/shop/phone-accessories",
    icon: Smartphone,
    children: [
      { label: "Battery", href: "/shop/phone-accessories/battery" },
      {
        label: "Gimbal & Selfie Stick",
        href: "/shop/phone-accessories/gimbal-selfie-stick",
      },
      {
        label: "Microphone",
        href: "/shop/phone-accessories/microphone",
      },
      {
        label: "Phone Case",
        href: "/shop/phone-accessories/phone-case",
      },
      {
        label: "Phone Cooler",
        href: "/shop/phone-accessories/phone-cooler",
      },
      {
        label: "Screen Protector",
        href: "/shop/phone-accessories/screen-protector",
      },
    ],
  },
  {
    label: "Powerbanks",
    href: "/shop/powerbanks",
    icon: BatteryCharging,
  },
  {
    label: "Rechargeable Fans",
    href: "/shop/rechargeable-fans",
    icon: Fan,
  },
  {
    label: "Smart Watches",
    href: "/shop/smart-watches",
    icon: Watch,
    children: [
      {
        label: "Watch Screen Protector",
        href: "/shop/smart-watches/watch-screen-protector",
      },
      {
        label: "Watch Strap",
        href: "/shop/smart-watches/watch-strap",
      },
    ],
  },
  { label: "Speakers", href: "/shop/speakers", icon: Speaker },
  {
    label: "TWS",
    href: "/shop/tws",
    icon: Bluetooth,
    children: [{ label: "TWS Case", href: "/shop/tws/tws-case" }],
  },
  {
    label: "Wired Earphones",
    href: "/shop/wired-earphones",
    icon: Cable,
  },
];

export const mainNavLinks = [
  { label: "Shop", href: "/shop" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Hot Offer", href: "/offers" },
  { label: "Blog", href: "/blog" },
  { label: "Pre Order", href: "/pre-order" },
] as const;
