// import { ISelectOption } from "@/types/AdminProducts/AdminProducts.interface";

// export const MOCK_CATEGORIES: ISelectOption[] = [
//   // MEN
//   { value: "men", label: "Men" },

//   { value: "men-clothing", label: "Men → Clothing" },
//   { value: "men-tshirts", label: "Men → Clothing → T-Shirts" },
//   { value: "men-shirts", label: "Men → Clothing → Shirts" },
//   { value: "men-jackets", label: "Men → Clothing → Jackets" },

//   { value: "men-shoes", label: "Men → Shoes" },
//   { value: "men-sneakers", label: "Men → Shoes → Sneakers" },
//   { value: "men-running", label: "Men → Shoes → Running" },

//   { value: "men-accessories", label: "Men → Accessories" },
//   { value: "men-watches", label: "Men → Accessories → Watches" },
//   { value: "men-belts", label: "Men → Accessories → Belts" },

//   // WOMEN
//   { value: "women", label: "Women" },

//   { value: "women-clothing", label: "Women → Clothing" },
//   { value: "women-dresses", label: "Women → Clothing → Dresses" },
//   { value: "women-tops", label: "Women → Clothing → Tops" },

//   { value: "women-shoes", label: "Women → Shoes" },
//   { value: "women-heels", label: "Women → Shoes → Heels" },
//   { value: "women-flats", label: "Women → Shoes → Flats" },

//   { value: "women-accessories", label: "Women → Accessories" },
//   { value: "women-bags", label: "Women → Accessories → Handbags" },
//   { value: "women-jewelry", label: "Women → Accessories → Jewelry" },

//   // JUNIORS
//   { value: "juniors", label: "Kids & Juniors" },

//   { value: "juniors-clothing", label: "Kids → Clothing" },
//   { value: "juniors-hoodies", label: "Kids → Clothing → Hoodies" },
//   { value: "juniors-shorts", label: "Kids → Clothing → Shorts" },

//   { value: "juniors-shoes", label: "Kids → Shoes" },
//   { value: "juniors-running", label: "Kids → Shoes → Running" },
//   { value: "juniors-sneakers", label: "Kids → Shoes → Sneakers" },

//   { value: "juniors-accessories", label: "Kids → Accessories" },
//   { value: "juniors-bags", label: "Kids → Accessories → Bags" },
//   { value: "juniors-hats", label: "Kids → Accessories → Hats" },
// ];
// export const MOCK_UNITS: ISelectOption[] = [
//   { value: "unit-1", label: "Piece" },
//   { value: "unit-2", label: "Kg" },
//   { value: "unit-3", label: "Litre" },
//   { value: "unit-4", label: "Gram" },
//   { value: "unit-5", label: "Meter" },
//   { value: "unit-6", label: "Centimeter" },
//   { value: "unit-7", label: "Dozen" },
//   { value: "unit-8", label: "Pair" },
//   { value: "unit-9", label: "Set" },
//   { value: "unit-10", label: "Box" },
//   { value: "unit-11", label: "Pack" },
//   { value: "unit-12", label: "Bottle" },
//   { value: "unit-13", label: "Milliliter (ml)" },
//   { value: "unit-14", label: "Gallon" },
//   { value: "unit-15", label: "Yard" },
//   { value: "unit-16", label: "Square Feet" },
//   { value: "unit-17", label: "Roll" },
//   { value: "unit-18", label: "Bag" },
//   { value: "unit-19", label: "Carton" },
//   { value: "unit-20", label: "Ton" },
// ];

// export const MOCK_TAXES: ISelectOption[] = [
//   { value: "no-tax", label: "NO VAT" },
//   { value: "tax-1", label: "VAT 15%" },
//   { value: "tax-2", label: "VAT 5%" },
//   { value: "tax-3", label: "VAT 7.5%" },
//   { value: "tax-4", label: "VAT 10%" },
//   { value: "tax-5", label: "VAT 20%" },
//   { value: "tax-6", label: "Supplementary Duty 20%" },
//   { value: "tax-7", label: "Supplementary Duty 30%" },
//   { value: "tax-8", label: "Import Duty 5%" },
//   { value: "tax-9", label: "Import Duty 25%" },
//   { value: "tax-10", label: "AIT 3%" },
//   { value: "tax-11", label: "AIT 5%" },
// ];

// export const MOCK_BRANDS: ISelectOption[] = [
//   // Fashion & Clothing
//   { value: "nike", label: "Nike" },
//   { value: "adidas", label: "Adidas" },
//   { value: "puma", label: "Puma" },
//   { value: "hm", label: "H&M" },
//   { value: "zara", label: "Zara" },
//   { value: "levis", label: "Levi's" },
//   { value: "uniqlo", label: "Uniqlo" },
//   { value: "gucci", label: "Gucci" },
//   { value: "louis-vuitton", label: "Louis Vuitton" },

//   // Beauty & Cosmetics
//   { value: "skin1004", label: "SKIN1004" },
//   { value: "innisfree", label: "Innisfree" },
//   { value: "cosrx", label: "COSRX" },
//   { value: "the-ordinary", label: "The Ordinary" },
//   { value: "loreal", label: "L'Oréal" },
//   { value: "nivea", label: "Nivea" },
//   { value: "maybelline", label: "Maybelline" },

//   // Electronics
//   { value: "samsung", label: "Samsung" },
//   { value: "apple", label: "Apple" },
//   { value: "xiaomi", label: "Xiaomi" },
//   { value: "realme", label: "Realme" },
//   { value: "oppo", label: "Oppo" },
//   { value: "vivo", label: "Vivo" },
//   { value: "sony", label: "Sony" },
//   { value: "lg", label: "LG" },

//   // Home Appliances (Local)
//   { value: "walton", label: "Walton" },
//   { value: "symphony", label: "Symphony" },
//   { value: "vision", label: "Vision" },

//   // Bags & Accessories
//   { value: "fossil", label: "Fossil" },
//   { value: "casio", label: "Casio" },
//   { value: "michael-kors", label: "Michael Kors" },

//   // Kids & Baby
//   { value: "pigeon", label: "Pigeon" },
//   { value: "chicco", label: "Chicco" },
//   { value: "mothercare", label: "Mothercare" },

//   // FMCG / Consumer Goods (Local)
//   { value: "pran", label: "Pran" },
//   { value: "square", label: "Square" },
//   { value: "unilever", label: "Unilever" },

//   { value: "others", label: "Others" },
// ];

// export const MOCK_BARCODE: ISelectOption[] = [
//   { value: "barcode-1", label: "Bar Code 1" },
//   { value: "barcode-2", label: "Bar Code 2" },
//   { value: "barcode-3", label: "Bar Code 3" },
//   { value: "barcode-4", label: "Bar Code 4" },
//   { value: "barcode-5", label: "Bar Code 5" },
//   { value: "barcode-6", label: "EAN-13" },
//   { value: "barcode-7", label: "EAN-8" },
//   { value: "barcode-8", label: "UPC-A" },
//   { value: "barcode-9", label: "UPC-E" },
//   { value: "barcode-10", label: "Code 128" },
// ];
import { ISelectOption } from "@/types/AdminProducts/AdminProducts.interface";

export const MOCK_CATEGORIES: ISelectOption[] = [
  // Adapters & Cables
  { value: "adapters-cables", label: "Adapters & Cables" },
  { value: "adapters", label: "Adapters & Cables → Adapters" },
  {
    value: "bluetooth-wifi-receivers",
    label: "Adapters & Cables → Bluetooth & WIFI Receivers",
  },
  { value: "cables", label: "Adapters & Cables → Cables" },
  {
    value: "dongles-converters",
    label: "Adapters & Cables → Dongles & Converters",
  },
  { value: "multiplugs", label: "Adapters & Cables → Multiplugs" },
  {
    value: "universal-adapters",
    label: "Adapters & Cables → Universal Adapters",
  },
  {
    value: "wireless-chargers",
    label: "Adapters & Cables → Wireless Chargers",
  },

  // Car Accessories
  { value: "car-accessories", label: "Car Accessories" },

  // Headsets
  { value: "headsets", label: "Headsets" },

  // Home Appliances
  { value: "home-appliances", label: "Home Appliances" },
  {
    value: "accessories",
    label: "Home Appliances → Accessories",
  },
  {
    value: "cleaning-appliances",
    label: "Home Appliances → Cleaning Appliances",
  },
  { value: "clocks", label: "Home Appliances → Clocks" },
  {
    value: "electric-heaters",
    label: "Home Appliances → Electric Heaters",
  },
  { value: "humidifier", label: "Home Appliances → Humidifier" },
  {
    value: "kitchen-appliances",
    label: "Home Appliances → Kitchen Appliances",
  },
  {
    value: "mosquito-bats",
    label: "Home Appliances → Mosquito Bats",
  },
  {
    value: "security-surveillance-devices",
    label: "Home Appliances → Security & Surveillance Devices",
  },
  {
    value: "security-camera",
    label: "Home Appliances → Security Camera",
  },
  { value: "tv-box", label: "Home Appliances → TV Box" },

  // Lifestyle
  { value: "lifestyle", label: "Lifestyle" },
  { value: "bags", label: "Lifestyle → Bags" },
  { value: "fans", label: "Lifestyle → Fans" },
  { value: "keyboard", label: "Lifestyle → Keyboard" },
  { value: "lamps", label: "Lifestyle → Lamps" },
  { value: "massagers", label: "Lifestyle → Massagers" },
  { value: "mouse", label: "Lifestyle → Mouse" },
  { value: "mouse-pad", label: "Lifestyle → Mouse Pad" },
  { value: "nail-clippers", label: "Lifestyle → Nail Clippers" },
  { value: "pens", label: "Lifestyle → Pens" },
  { value: "router", label: "Lifestyle → Router" },
  { value: "stands", label: "Lifestyle → Stands" },
  { value: "sunglasses", label: "Lifestyle → Sunglasses" },
  { value: "trackers", label: "Lifestyle → Trackers" },
  { value: "trimmers", label: "Lifestyle → Trimmers" },
  { value: "umbrellas", label: "Lifestyle → Umbrellas" },

  // Neckbands
  { value: "neckbands", label: "Neckbands" },

  // Pen Drive
  { value: "pen-drive", label: "Pen Drive" },

  // Phone Accessories
  { value: "phone-accessories", label: "Phone Accessories" },
  { value: "battery", label: "Phone Accessories → Battery" },
  {
    value: "gimbal-selfie-stick",
    label: "Phone Accessories → Gimbal & Selfie Stick",
  },
  { value: "microphone", label: "Phone Accessories → Microphone" },
  { value: "phone-case", label: "Phone Accessories → Phone Case" },
  { value: "phone-cooler", label: "Phone Accessories → Phone Cooler" },
  {
    value: "screen-protector",
    label: "Phone Accessories → Screen Protector",
  },

  // Powerbanks
  { value: "powerbanks", label: "Powerbanks" },

  // Rechargeable Fans
  { value: "rechargeable-fans", label: "Rechargeable Fans" },

  // Smart Watches
  { value: "smart-watches", label: "Smart Watches" },
  {
    value: "watch-screen-protector",
    label: "Smart Watches → Watch Screen Protector",
  },
  { value: "watch-strap", label: "Smart Watches → Watch Strap" },

  // Speakers
  { value: "speakers", label: "Speakers" },

  // TWS
  { value: "tws", label: "TWS" },
  { value: "tws-case", label: "TWS → TWS Case" },

  // Wired Earphones
  { value: "wired-earphones", label: "Wired Earphones" },
];

export const MOCK_UNITS: ISelectOption[] = [
  { value: "unit-1", label: "Piece" },
  { value: "unit-2", label: "Service" },
  { value: "unit-3", label: "Hour" },
  { value: "unit-4", label: "Day" },
  { value: "unit-5", label: "Job" },
  { value: "unit-6", label: "Repair" },
  { value: "unit-7", label: "Replacement" },
  { value: "unit-8", label: "Set" },
  { value: "unit-9", label: "Pair" },
  { value: "unit-10", label: "Pack" },
];

export const MOCK_TAXES: ISelectOption[] = [
  { value: "no-tax", label: "NO VAT" },
  { value: "tax-1", label: "VAT 5%" },
  { value: "tax-2", label: "VAT 7.5%" },
  { value: "tax-3", label: "VAT 10%" },
  { value: "tax-4", label: "VAT 15%" },
];

export const MOCK_BRANDS: ISelectOption[] = [
  // MOBILE
  { value: "apple", label: "Apple" },
  { value: "samsung", label: "Samsung" },
  { value: "xiaomi", label: "Xiaomi" },
  { value: "oppo", label: "OPPO" },
  { value: "vivo", label: "Vivo" },
  { value: "realme", label: "Realme" },
  { value: "oneplus", label: "OnePlus" },
  { value: "google", label: "Google Pixel" },
  { value: "motorola", label: "Motorola" },
  { value: "nokia", label: "Nokia" },

  // TABLET
  { value: "ipad", label: "iPad" },
  { value: "lenovo", label: "Lenovo" },
  { value: "huawei", label: "Huawei" },

  // LAPTOP
  { value: "asus", label: "ASUS" },
  { value: "hp", label: "HP" },
  { value: "dell", label: "Dell" },
  { value: "acer", label: "Acer" },
  { value: "msi", label: "MSI" },

  // OTHERS
  { value: "sony", label: "Sony" },
  { value: "lg", label: "LG" },
  { value: "walton", label: "Walton" },
  { value: "symphony", label: "Symphony" },
  { value: "tecno", label: "Tecno" },
  { value: "infinix", label: "Infinix" },

  { value: "others", label: "Others" },
];

export const MOCK_BARCODE: ISelectOption[] = [
  { value: "barcode-1", label: "Service Code" },
  { value: "barcode-2", label: "Repair Code" },
  { value: "barcode-3", label: "Part Code" },
  { value: "barcode-4", label: "IMEI" },
  { value: "barcode-5", label: "Serial Number" },
  { value: "barcode-6", label: "EAN-13" },
  { value: "barcode-7", label: "EAN-8" },
  { value: "barcode-8", label: "UPC-A" },
  { value: "barcode-9", label: "Code 128" },
  { value: "barcode-10", label: "QR Code" },
];
