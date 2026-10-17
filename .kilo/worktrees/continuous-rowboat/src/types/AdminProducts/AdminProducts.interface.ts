// types/adminDashboard/AdminProducts/AdminProducts.interface.ts

export interface IProduct {
  id: string;
  name: string;
  sku: string;
  shortName?: string; // ✅ optional করুন
  slug: string;
  tittle?: string;
  barcode?: string;
  categoryId: string;
  buyingPrice: number;
  sellingPrice?: number;
  mrpPrice: number;
  taxId?: string;
  brandId?: string;
  status: "ACTIVE" | "INACTIVE";
  canPurchasable: boolean;
  showStockOut: boolean;
  refundable: boolean;
  stock: number;
  maximumPurchaseQuantity: number;
  lowStockQuantityWarning: number;
  unitId: string;
  weight?: string;
  warranty?: string;
  tags?: string[];
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateProductPayload {
  name: string;
  sku: string;
  shortName?: string; // ✅ optional করুন
  slug: string;
  tittle?: string;
  barcode?: string;
  categoryId: string;
  buyingPrice: number;
  sellingPrice?: number;
  mrpPrice: number;
  taxId?: string;
  brandId?: string;
  status: "ACTIVE" | "INACTIVE";
  canPurchasable: boolean;
  showStockOut: boolean;
  refundable: boolean;
  stock: number;
  maximumPurchaseQuantity: number;
  lowStockQuantityWarning: number;
  unitId: string;
  weight?: string;
  warranty?: string;
  tags?: string[];
  description?: string;
}

// export interface IPublicProduct {
//   id: string;
//   name: string;
//   slug: string;
//   sellingPrice: number;
//   mrpPrice: number;
//   buyingPrice: number;
//   sku: string;
//   stock: number;
//   brandId: string;
//   tags: string[];
//   status: "ACTIVE";
//   createdAt: string;
//   description: string;
//   productMedia:
//     | {
//         url: string;
//         fileType: string;
//         name: string;
//         isMain?: boolean;
//       }[]
//     | null;
//   productShipping:
//     | {
//         shippingType: "free" | "flat_rate";
//         shippingCost: number;
//         isQuantityMultiply?: boolean;
//         returnPolicy?: string;
//       }[]
//     | null;
//   productSeo:
//     | {
//         metaTitle?: string;
//         metaDescription?: string;
//         metaKeywords?: string;
//       }[]
//     | null;
//   variations:
//     | {
//         id: string;
//         color: string;
//         size: string;
//         price: number;
//         sku: string;
//       }[]
//     | null;
//   productOffer: {
//     offerStartDate: string;
//     offerEndDate: string;
//     discountPercentage: number;
//     flashSale: boolean;
//   } | null;
//   productVideo:
//     | {
//         videoUrl: string;
//       }[]
//     | null;
//   // ── Related Products ──────────────────────────────────────
//   relatedProducts?: {
//     id: string;
//     name: string;
//     slug: string;
//     sellingPrice: number;
//     mrpPrice: number;
//     productMedia: { url: string; fileType: string; name: string }[];
//   }[];
// }
// export interface ISelectOption {
//   value: string;
//   label: string;
// }

// types/AdminProducts/AdminProducts.interface.ts

export interface IPublicProduct {
  id: string;
  name: string;
  shortName?: string;
  slug: string;
  sku: string;

  // ── Pricing ────────────────────────────────────────────────
  sellingPrice: number | null; // ✅ null হতে পারে, discount না থাকলে
  mrpPrice: number;
  buyingPrice: number;

  // ── Stock & Purchase control ─────────────────────────────────
  stock: number;
  canPurchasable: boolean;
  showStockOut: boolean;
  maximumPurchaseQuantity: number;
  lowStockQuantityWarning: number;

  // ── Meta / classification ────────────────────────────────────
  brandId: string;
  tags: string[];
  status: "ACTIVE" | "INACTIVE"; // ✅ future-proof union
  warranty?: string;
  refundable: boolean;
  weight?: string;
  createdAt: string;
  description: string;

  // ── Media ─────────────────────────────────────────────────────
  productMedia:
    | {
        url: string;
        fileType: string;
        name: string;
        isMain?: boolean;
      }[]
    | null;

  // ── Shipping ──────────────────────────────────────────────────
  // ⚠️ raw console output এ single object দেখা গিয়েছিল, backend
  // response Network tab এ confirm করে নিও array না object সেটা।
  // Array ধরে নিচ্ছি; object হলে এখান থেকে [] সরিয়ে দাও।
  productShipping:
    | {
        shippingType: "free" | "flat_rate";
        shippingCost: number;
        isQuantityMultiply?: boolean;
        returnPolicy?: string;
      }[]
    | null;

  // ── SEO ───────────────────────────────────────────────────────
  productSeo:
    | {
        metaTitle?: string;
        metaDescription?: string;
        metaKeywords?: string;
      }[]
    | null;

  // ── Variations ────────────────────────────────────────────────
  variations:
    | {
        id: string;
        color: string;
        size: string;
        price: number;
        sku: string;
      }[]
    | null;

  // ── Flash Sale ────────────────────────────────────────────────
  // ✅ productOffer থেকে আলাদা করা হলো, raw data অনুযায়ী
  productFlashSale: {
    flashSale: boolean;
    flashSaleStartDate: string;
    flashSaleEndDate: string;
  } | null;

  // ── Offer ─────────────────────────────────────────────────────
  productOffer: {
    offerSale: boolean;
    offerStartDate: string;
    offerEndDate: string;
  } | null;

  // ── Video ─────────────────────────────────────────────────────
  // ⚠️ raw console output এ single object দেখা গিয়েছিল, এখানেও
  // confirm করে নিও array না object।
  productVideo:
    | {
        videoUrl: string;
      }[]
    | null;

  // ── Related Products ─────────────────────────────────────────
  relatedProducts?: {
    id: string;
    name: string;
    slug: string;
    sellingPrice: number | null;
    mrpPrice: number;
    productMedia: { url: string; fileType: string; name: string }[];
  }[];
}

export interface ISelectOption {
  value: string;
  label: string;
}
