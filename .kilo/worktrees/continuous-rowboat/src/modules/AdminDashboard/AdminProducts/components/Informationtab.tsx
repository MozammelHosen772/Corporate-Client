"use client";

import { IProduct } from "@/types/AdminProducts/AdminProducts.interface";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 py-3 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-800">{value ?? "—"}</span>
    </div>
  );
}

function Badge({ value, active }: { value: string; active?: boolean }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      {value}
    </span>
  );
}

export default function InformationTab({ product }: { product: IProduct }) {
  return (
    <div className="space-y-5">
      {/* Main Info Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">Information</h2>
        </div>
        <div className="px-6 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
            {/* Left column */}
            <div>
              <Row
                label="Name"
                value={`${product.name.split(" ").slice(0, 20).join(" ")} ...`}
              />

              <Row label="Category" value={product.categoryId} />
              <Row label="Brand" value={product.brandId ?? "—"} />
              <Row
                label="Buying Price"
                value={`${product.buyingPrice?.toFixed(2)}`}
              />
              <Row
                label="Maximum Purchase Qty"
                value={product.maximumPurchaseQuantity}
              />
              <Row
                label="Low Stock Warning"
                value={product.lowStockQuantityWarning}
              />
              <Row label="Unit" value={product.unitId} />
              <Row
                label="Show Stock Out"
                value={product.showStockOut ? "Enable" : "Disable"}
              />
              <Row
                label="Status"
                value={
                  <Badge
                    value={product.status === "ACTIVE" ? "Active" : "Inactive"}
                    active={product.status === "ACTIVE"}
                  />
                }
              />
            </div>
            {/* Right column */}
            <div>
              <Row
                label="SKU"
                value={<span className="font-mono">{product.sku}</span>}
              />
              <Row label="Barcode" value={product.barcode ?? "—"} />
              <Row label="Tax" value={product.taxId ?? "—"} />
              <Row
                label="Selling Price"
                value={`${product.sellingPrice?.toFixed(2)}`}
              />
              <Row label="Warranty" value={product.warranty ?? "—"} />
              <Row
                label="Weight"
                value={product.weight ? `${product.weight} kg` : "—"}
              />
              <Row
                label="Purchasable"
                value={
                  <Badge
                    value={product.canPurchasable ? "Yes" : "No"}
                    active={product.canPurchasable}
                  />
                }
              />
              <Row
                label="Refundable"
                value={
                  <Badge
                    value={product.refundable ? "Yes" : "No"}
                    active={product.refundable}
                  />
                }
              />
              <Row
                label="Tags"
                value={
                  product.tags && product.tags.length > 0
                    ? product.tags.join(", ")
                    : "—"
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Description Card */}
      {product.description && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700">
              Description
            </h2>
          </div>
          <div
            className="
    px-6 py-4
    text-sm text-slate-600 leading-7
    max-w-full
    break-words
    whitespace-pre-wrap
    overflow-x-auto
  "
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      )}
    </div>
  );
}
