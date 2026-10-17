import z from "zod";

export const productSchema = z
  .object({
    // ── Basic Information ──────────────────────────────────────────
    name: z.string().min(1, "Product full name is required"),
    shortName: z.string().min(1, "Short name is required"),
    slug: z.string().min(1, "Slug is required"),
    tittle: z.string().optional(),
    sku: z.string().min(1, "SKU is required"),
    barcode: z.string().optional(),
    categoryId: z.string().min(1, "Category is required"),
    unitId: z.string().min(1, "Unit is required"),
    brandId: z.string().optional(),
    taxId: z.string().optional(),

    // ── Pricing ────────────────────────────────────────────────────
    buyingPrice: z.coerce.number().min(1, "Buying price is required"),
    mrpPrice: z.coerce.number().min(1, "MRP is required"),
    sellingPrice: z.coerce
      .number()
      .min(1, "Selling price must be greater than 0")
      .optional()
      .or(z.literal(0).transform(() => undefined)), // ✅ 0 → undefined

    // ── Settings ───────────────────────────────────────────────────
    status: z.enum(["ACTIVE", "INACTIVE"]),
    canPurchasable: z.enum(["true", "false"]),
    showStockOut: z.enum(["true", "false"]),
    refundable: z.enum(["true", "false"]),

    // ── Stock ──────────────────────────────────────────────────────
    stock: z.coerce.number().min(1, "Stock must be at least 1"),

    maximumPurchaseQuantity: z.coerce
      .number()
      .min(1, "Maximum purchase quantity must be at least 1"),

    lowStockQuantityWarning: z.coerce
      .number()
      .min(0, "Low stock warning cannot be negative"),

    // ── Additional ─────────────────────────────────────────────────
    weight: z.string().optional(),
    warranty: z.string().optional(),
    tags: z.string().optional(),
    description: z.string().optional(),
  })
  // ── Cross-field validation ──────────────────────────────────────
  .refine((data) => !data.sellingPrice || data.sellingPrice <= data.mrpPrice, {
    message: "Selling price cannot be greater than MRP",
    path: ["sellingPrice"],
  })
  .refine(
    (data) => !data.sellingPrice || data.buyingPrice <= data.sellingPrice,
    {
      message: "Buying price cannot be greater than selling price",
      path: ["buyingPrice"],
    },
  )
  .refine((data) => data.maximumPurchaseQuantity <= data.stock, {
    message: "Max purchase quantity cannot exceed total stock",
    path: ["maximumPurchaseQuantity"],
  })
  .refine((data) => data.lowStockQuantityWarning < data.stock, {
    message: "Low stock warning must be less than total stock",
    path: ["lowStockQuantityWarning"],
  });
