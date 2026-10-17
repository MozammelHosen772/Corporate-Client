"use client";

import { Loader2, RefreshCw } from "lucide-react";
import { useCallback, useState } from "react";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import TiptapEditor from "@/shared/tiptapEditor/tip-tap-editor";
import {
  ICreateProductPayload,
  IProduct,
  ISelectOption,
} from "@/types/AdminProducts/AdminProducts.interface";
import { productSchema } from "@/zod/adminProducts.validation";
import { TagsInput } from "./TagsInput";

// ─── Types ────────────────────────────────────────────────────────────────────
type ProductFormValues = z.infer<typeof productSchema>;
type FormErrors = Partial<Record<keyof ProductFormValues, string>>;

// ─── Props ────────────────────────────────────────────────────────────────────
interface ProductFormProps {
  initialData?: IProduct | null;
  onSubmit: (payload: ICreateProductPayload) => Promise<void>;
  saving: boolean;
  categories?: ISelectOption[];
  barcodes?: ISelectOption[];
  taxes?: ISelectOption[];
  brands?: ISelectOption[];
  units?: ISelectOption[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function generateSKU(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

function buildInitialValues(data?: IProduct | null): ProductFormValues {
  return {
    name: data?.name ?? "",
    shortName: data?.shortName ?? "",
    slug: data?.slug ?? "",
    tittle: data?.tittle ?? "",
    sku: data?.sku ?? generateSKU(),
    barcode: data?.barcode ?? "",
    categoryId: data?.categoryId ?? "",
    buyingPrice: data?.buyingPrice ?? 0,
    sellingPrice: data?.sellingPrice ?? 0,

    mrpPrice: data?.mrpPrice ?? 0,
    taxId: data?.taxId ?? "",
    brandId: data?.brandId ?? "",
    status: data?.status ?? "ACTIVE",
    canPurchasable: data?.canPurchasable ? "true" : "false",
    showStockOut: data?.showStockOut ? "true" : "false",
    refundable: data?.refundable ? "true" : "false",
    stock: data?.stock ?? 1,
    maximumPurchaseQuantity: data?.maximumPurchaseQuantity ?? 1,
    lowStockQuantityWarning: data?.lowStockQuantityWarning ?? 0,
    unitId: data?.unitId ?? "",
    weight: data?.weight ?? "",
    warranty: data?.warranty ?? "",
    tags: data?.tags?.join(", ") ?? "",
    description: data?.description ?? "",
  };
}

// ─── Field Wrapper ────────────────────────────────────────────────────────────
function FieldWrapper({
  label,
  required,
  error,
  children,
  className,
  action,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <div className="flex items-center justify-between">
        <Label className="text-xs uppercase tracking-wide text-slate-500">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
        {action}
      </div>
      {/* ✅ error থাকলে child-কে error class দেওয়ার জন্য wrapper div */}
      <div
        className={
          error
            ? "[&_input]:border-destructive [&_[data-slot=select-trigger]]:border-destructive"
            : ""
        }
      >
        {children}
      </div>
      {error && (
        <p className="text-[0.75rem] text-destructive flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ProductForm({
  initialData,
  onSubmit,
  saving,
  categories = [],
  barcodes = [],
  taxes = [],
  brands = [],
  units = [],
}: ProductFormProps) {
  const isEdit = !!initialData;

  const [values, setValues] = useState<ProductFormValues>(
    buildInitialValues(initialData),
  );
  const [errors, setErrors] = useState<FormErrors>({});

  // ── Generic change handler ────────────────────────────────────────────────
  const set = useCallback(
    <K extends keyof ProductFormValues>(
      key: K,
      value: ProductFormValues[K],
    ) => {
      setValues((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => {
        if (!prev[key]) return prev;
        return { ...prev, [key]: undefined };
      });
    },
    [],
  );

  // ── Name → slug ───────────────────────────────────────────────────────────
  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const name = e.target.value;
      const slug = name.toLowerCase().trim().replace(/\s+/g, "-");
      setValues((prev) => ({ ...prev, name, slug }));
      setErrors((prev) => {
        const next = { ...prev };
        if (next.name) delete next.name;
        if (next.slug) delete next.slug;
        return next;
      });
    },
    [],
  );

  // ── Number helper ─────────────────────────────────────────────────────────
  const setNumber = useCallback(
    (key: keyof ProductFormValues, raw: string, fallback: number) => {
      set(key as never, (raw === "" ? fallback : Number(raw)) as never);
    },
    [set],
  );

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = productSchema.safeParse(values);

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof ProductFormValues;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);

      // ✅ প্রথম error field-এ scroll করো
      const firstKey = result.error.issues[0]?.path[0] as string;
      document.getElementById(`field-${firstKey}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    const v = result.data;
    const payload: ICreateProductPayload = {
      name: v.name,
      shortName: v.shortName,
      slug: v.slug,
      sku: v.sku,
      tittle: v.tittle || undefined,
      barcode: v.barcode || undefined,
      categoryId: v.categoryId,
      buyingPrice: v.buyingPrice,
      // sellingPrice: v.sellingPrice || undefined,
      sellingPrice: v.sellingPrice ?? undefined,
      mrpPrice: v.mrpPrice,
      taxId: v.taxId || undefined,
      brandId: v.brandId || undefined,
      status: v.status,
      canPurchasable: v.canPurchasable === "true",
      showStockOut: v.showStockOut === "true",
      refundable: v.refundable === "true",
      stock: v.stock,
      maximumPurchaseQuantity: v.maximumPurchaseQuantity,
      lowStockQuantityWarning: v.lowStockQuantityWarning,
      unitId: v.unitId,
      weight: v.weight || undefined,
      warranty: v.warranty || undefined,
      tags: v.tags
        ? v.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : undefined,
      description: v.description || undefined,
    };

    await onSubmit(payload);
  };

  // ── Reset ─────────────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setValues(buildInitialValues(initialData));
    setErrors({});
  }, [initialData]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ── 1. Basic Information ──────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium text-slate-700">
            Basic Information
          </CardTitle>
          <Separator />
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div id="field-name">
            <FieldWrapper label="Name" required error={errors.name}>
              <Input
                placeholder="Product name"
                value={values.name}
                onChange={handleNameChange}
              />
            </FieldWrapper>
          </div>

          {/* Short Name */}
          <div id="field-shortName">
            <FieldWrapper label="Short Name" required error={errors.shortName}>
              <Input
                placeholder="Short product name"
                value={values.shortName}
                onChange={(e) => set("shortName", e.target.value)}
              />
            </FieldWrapper>
          </div>

          {/* Slug — auto generated, disabled */}
          <div id="field-slug">
            <FieldWrapper label="Slug" required error={errors.slug}>
              <Input disabled placeholder="product-slug" value={values.slug} />
            </FieldWrapper>
          </div>

          {/* Title */}
          <FieldWrapper label="Title" error={errors.tittle}>
            <Input
              placeholder="Title product name"
              value={values.tittle}
              onChange={(e) => set("tittle", e.target.value)}
            />
          </FieldWrapper>

          {/* SKU */}
          <div id="field-sku">
            <FieldWrapper label="SKU" required error={errors.sku}>
              <div className="flex gap-2">
                <Input
                  placeholder="SKU"
                  value={values.sku}
                  onChange={(e) => set("sku", e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  title="Regenerate SKU"
                  onClick={() => set("sku", generateSKU())}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </FieldWrapper>
          </div>

          {/* Category */}
          <div id="field-categoryId">
            <FieldWrapper label="Category" required error={errors.categoryId}>
              <Select
                value={values.categoryId}
                onValueChange={(v) => set("categoryId", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="max-h-[250px] overflow-y-auto">
                  {categories.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldWrapper>
          </div>

          {/* Barcode */}
          <FieldWrapper label="Barcode" error={errors.barcode}>
            <Select
              value={values.barcode ?? ""}
              onValueChange={(v) => set("barcode", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="--" />
              </SelectTrigger>
              <SelectContent>
                {barcodes.map((b) => (
                  <SelectItem key={b.value} value={b.value}>
                    {b.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldWrapper>

          {/* Purchase Price */}
          <div id="field-buyingPrice">
            <FieldWrapper
              label="Purchase Price (Wholesale)"
              required
              error={errors.buyingPrice}
            >
              <Input
                type="number"
                min={0}
                step="0.01"
                placeholder="0.00"
                value={values.buyingPrice === 0 ? "" : values.buyingPrice}
                onChange={(e) => {
                  setNumber("buyingPrice", e.target.value, 0);
                  setErrors((prev) => ({ ...prev, sellingPrice: undefined })); // ✅
                }}
              />
            </FieldWrapper>
          </div>

          {/* MRP */}
          <div id="field-mrpPrice">
            <FieldWrapper
              label="MRP (Market Retail Price)"
              required
              error={errors.mrpPrice}
            >
              <Input
                type="number"
                min={0}
                step="0.01"
                placeholder="0.00"
                value={values.mrpPrice === 0 ? "" : values.mrpPrice}
                onChange={(e) => {
                  setNumber("mrpPrice", e.target.value, 0);
                  setErrors((prev) => ({
                    ...prev,
                    sellingPrice: undefined,
                    buyingPrice: undefined,
                  })); // ✅
                }}
              />
            </FieldWrapper>
          </div>

          {/* Selling Price */}
          <div id="field-sellingPrice">
            <FieldWrapper
              label="Selling Price"
              required
              error={errors.sellingPrice}
            >
              <Input
                type="number"
                min={0}
                step="0.01"
                placeholder="0.00"
                value={values.sellingPrice === 0 ? "" : values.sellingPrice}
                onChange={(e) => {
                  setNumber("sellingPrice", e.target.value, 0);
                  setErrors((prev) => ({ ...prev, buyingPrice: undefined })); // ✅
                }}
              />
            </FieldWrapper>
          </div>

          {/* Tax */}
          <FieldWrapper label="Tax" error={errors.taxId}>
            <Select
              value={values.taxId ?? ""}
              onValueChange={(v) => set("taxId", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="--" />
              </SelectTrigger>
              <SelectContent>
                {taxes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldWrapper>

          {/* Brand */}
          <FieldWrapper label="Brand" error={errors.brandId}>
            <Select
              value={values.brandId ?? ""}
              onValueChange={(v) => set("brandId", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="--" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((b) => (
                  <SelectItem key={b.value} value={b.value}>
                    {b.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldWrapper>

          {/* Unit */}
          <div id="field-unitId">
            <FieldWrapper label="Unit" required error={errors.unitId}>
              <Select
                value={values.unitId ?? ""}
                onValueChange={(v) => set("unitId", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="--" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldWrapper>
          </div>
        </CardContent>
      </Card>

      {/* ── 2. Settings ───────────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium text-slate-700">
            Settings
          </CardTitle>
          <Separator />
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status */}
          <FieldWrapper label="Status" required error={errors.status}>
            <RadioGroup
              value={values.status}
              onValueChange={(v) => set("status", v as "ACTIVE" | "INACTIVE")}
              className="flex gap-4 pt-1"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="ACTIVE" id="status-active" />
                <Label
                  htmlFor="status-active"
                  className="cursor-pointer font-normal"
                >
                  Active
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="INACTIVE" id="status-inactive" />
                <Label
                  htmlFor="status-inactive"
                  className="cursor-pointer font-normal"
                >
                  Inactive
                </Label>
              </div>
            </RadioGroup>
          </FieldWrapper>

          {/* Can Purchasable */}
          <FieldWrapper
            label="Can Purchasable"
            required
            error={errors.canPurchasable}
          >
            <RadioGroup
              value={values.canPurchasable}
              onValueChange={(v) =>
                set("canPurchasable", v as "true" | "false")
              }
              className="flex gap-4 pt-1"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="true" id="purchasable-yes" />
                <Label
                  htmlFor="purchasable-yes"
                  className="cursor-pointer font-normal"
                >
                  Yes
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="false" id="purchasable-no" />
                <Label
                  htmlFor="purchasable-no"
                  className="cursor-pointer font-normal"
                >
                  No
                </Label>
              </div>
            </RadioGroup>
          </FieldWrapper>

          {/* Show Stock Out */}
          <FieldWrapper
            label="Show Stock Out"
            required
            error={errors.showStockOut}
          >
            <RadioGroup
              value={values.showStockOut}
              onValueChange={(v) => set("showStockOut", v as "true" | "false")}
              className="flex gap-4 pt-1"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="true" id="stock-enable" />
                <Label
                  htmlFor="stock-enable"
                  className="cursor-pointer font-normal"
                >
                  Enable
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="false" id="stock-disable" />
                <Label
                  htmlFor="stock-disable"
                  className="cursor-pointer font-normal"
                >
                  Disable
                </Label>
              </div>
            </RadioGroup>
          </FieldWrapper>

          {/* Refundable */}
          <FieldWrapper label="Refundable" required error={errors.refundable}>
            <RadioGroup
              value={values.refundable}
              onValueChange={(v) => set("refundable", v as "true" | "false")}
              className="flex gap-4 pt-1"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="true" id="refund-yes" />
                <Label
                  htmlFor="refund-yes"
                  className="cursor-pointer font-normal"
                >
                  Yes
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="false" id="refund-no" />
                <Label
                  htmlFor="refund-no"
                  className="cursor-pointer font-normal"
                >
                  No
                </Label>
              </div>
            </RadioGroup>
          </FieldWrapper>

          {/* Stock */}
          <div id="field-stock">
            <FieldWrapper label="Total Stock" required error={errors.stock}>
              <Input
                type="number"
                min={1}
                placeholder="1"
                value={values.stock === 0 ? "" : values.stock}
                onChange={(e) => setNumber("stock", e.target.value, 0)}
              />
            </FieldWrapper>
          </div>

          {/* Maximum Purchase Quantity */}
          <div id="field-maximumPurchaseQuantity">
            <FieldWrapper
              label="Maximum Purchase Quantity"
              required
              error={errors.maximumPurchaseQuantity}
            >
              <Input
                type="number"
                min={1}
                placeholder="1"
                value={
                  values.maximumPurchaseQuantity === 0
                    ? ""
                    : values.maximumPurchaseQuantity
                }
                onChange={(e) =>
                  setNumber("maximumPurchaseQuantity", e.target.value, 0)
                }
              />
            </FieldWrapper>
          </div>

          {/* Low Stock Warning */}
          <div id="field-lowStockQuantityWarning">
            <FieldWrapper
              label="Low Stock Quantity Warning"
              required
              error={errors.lowStockQuantityWarning}
            >
              <Input
                type="number"
                min={0}
                placeholder="0"
                value={
                  values.lowStockQuantityWarning === 0
                    ? ""
                    : values.lowStockQuantityWarning
                }
                onChange={(e) =>
                  setNumber("lowStockQuantityWarning", e.target.value, 0)
                }
              />
            </FieldWrapper>
          </div>
        </CardContent>
      </Card>

      {/* ── 3. Additional Information ──────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium text-slate-700">
            Additional Information
          </CardTitle>
          <Separator />
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Weight */}
          {/* <FieldWrapper label="Weight (kg)" error={errors.weight}>
            <Input
              type="number"
              min={0}
              step="0.01"
              placeholder="e.g. 1.5"
              value={values.weight === 0 ? "" : values.weight} // ✅ fix
              onChange={(e) => setNumber("weight", e.target.value, 0)} // ✅ fix
            />
          </FieldWrapper> */}
          <FieldWrapper label="Weight (kg)" error={errors.weight}>
            <Input
              placeholder="e.g. 1.5 or N/A"
              value={values.weight ?? ""}
              onChange={(e) => set("weight", e.target.value)}
            />
          </FieldWrapper>
          {/* Warranty */}
          <FieldWrapper label="Warranty" error={errors.warranty}>
            <Input
              placeholder="e.g. 1 Year"
              value={values.warranty ?? ""}
              onChange={(e) => set("warranty", e.target.value)}
            />
          </FieldWrapper>

          {/* Tags */}
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wide text-slate-500">
              Tags
            </Label>
            <TagsInput
              keywords={
                values.tags
                  ? values.tags
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                  : []
              }
              onChange={(kws) => set("tags", kws.join(", "))}
            />
            {errors.tags && (
              <p className="text-[0.75rem] text-destructive flex items-center gap-1">
                <span>⚠</span> {errors.tags}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="col-span-1 md:col-span-2 space-y-1.5">
            <Label className="text-xs uppercase tracking-wide text-slate-500">
              Description
            </Label>
            <TiptapEditor
              value={values.description ?? ""}
              onChange={(v) => set("description", v)}
              minHeight="120px"
              maxHeight="220px"
              showWordCount
              showCharacterCount
            />
            {errors.description && (
              <p className="text-[0.75rem] text-destructive flex items-center gap-1">
                <span>⚠</span> {errors.description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Submit ────────────────────────────────────────────────────────── */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button type="submit" disabled={saving} className="min-w-[120px]">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : isEdit ? (
            "Update Product"
          ) : (
            "Create Product"
          )}
        </Button>
      </div>
    </form>
  );
}
