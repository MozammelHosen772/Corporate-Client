"use client";

import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
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

import { TagsInput } from "@/modules/AdminDashboard/AdminProducts/components/TagsInput"; // ← path adjust করো যদি আলাদা হয়
import MediaUploader from "@/shared/mediaUploader/MediaUploader";

import {
  IBlog,
  ICreateBlogPayload,
  ISelectOption,
} from "@/types/adminBlog.interface";
import { IUploadedMediaWithMeta } from "@/types/mediaUpload.interface";
import { blogSchema } from "@/zod/admin.Validation";

// ── TiptapEditor — props: value / onChange ───────────────────────────────────
const TiptapEditor = dynamic(
  () => import("@/shared/tiptapEditor/tip-tap-editor"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[220px] animate-pulse rounded-xl bg-slate-100" />
    ),
  },
);

// ─── Types ────────────────────────────────────────────────────────────────────
type BlogFormValues = z.infer<typeof blogSchema>;
type FormErrors = Partial<Record<keyof BlogFormValues, string>>;

// ─── Props ────────────────────────────────────────────────────────────────────
interface BlogFormProps {
  initialData?: IBlog | null;
  onSubmit: (payload: ICreateBlogPayload) => Promise<void>;
  saving: boolean;
  categories?: ISelectOption[];
}

const DEFAULT_CATEGORIES: ISelectOption[] = [
  { label: "Tech Tips", value: "Tech Tips" },
  { label: "Product Updates", value: "Product Updates" },
  { label: "Repair Guides", value: "Repair Guides" },
  { label: "Announcements", value: "Announcements" },
  { label: "General", value: "General" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildInitialValues(data?: IBlog | null): BlogFormValues {
  return {
    title: data?.title ?? "",
    slug: data?.slug ?? "",
    excerpt: data?.excerpt ?? "",
    content: data?.content ?? "",
    thumbnail: data?.thumbnail ?? "",
    category: data?.category ?? "",
    tags: data?.tags?.join(", ") ?? "",
    status: data?.status ?? "DRAFT",
    metaTitle: data?.metaTitle ?? "",
    metaDescription: data?.metaDescription ?? "",
  };
}

// ⚠️ IUploadedMediaWithMeta এ url field এর actual নাম `url` না হলে এই লাইনটা বদলে দিও
function getUrl(item?: IUploadedMediaWithMeta): string | undefined {
  return item?.url;
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
export default function BlogForm({
  initialData,
  onSubmit,
  saving,
  categories = DEFAULT_CATEGORIES,
}: BlogFormProps) {
  const isEdit = !!initialData;

  const [values, setValues] = useState<BlogFormValues>(
    buildInitialValues(initialData),
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [images, setImages] = useState<IUploadedMediaWithMeta[]>(
    initialData?.thumbnail
      ? [{ url: initialData.thumbnail } as IUploadedMediaWithMeta]
      : [],
  );

  // ── Generic change handler ────────────────────────────────────────────────
  const set = useCallback(
    <K extends keyof BlogFormValues>(key: K, value: BlogFormValues[K]) => {
      setValues((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => {
        if (!prev[key]) return prev;
        return { ...prev, [key]: undefined };
      });
    },
    [],
  );

  // ── Title → slug ──────────────────────────────────────────────────────────
  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const title = e.target.value;
      const slug = title.toLowerCase().trim().replace(/\s+/g, "-");
      setValues((prev) => ({ ...prev, title, slug }));
      setErrors((prev) => {
        const next = { ...prev };
        if (next.title) delete next.title;
        if (next.slug) delete next.slug;
        return next;
      });
    },
    [],
  );

  // ── Media upload ───────────────────────────────────────────────────────────
  const handleUpload = useCallback(
    (files: IUploadedMediaWithMeta[]) => {
      setImages(files);
      const url = getUrl(files[0]);
      set("thumbnail", url ?? "");
    },
    [set],
  );

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = blogSchema.safeParse(values);

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof BlogFormValues;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);

      const firstKey = result.error.issues[0]?.path[0] as string;
      document.getElementById(`field-${firstKey}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    const v = result.data;
    const payload: ICreateBlogPayload = {
      title: v.title,
      excerpt: v.excerpt || undefined,
      content: v.content,
      thumbnail: v.thumbnail || undefined,
      status: v.status,
      category: v.category || undefined,
      tags: v.tags
        ? v.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : undefined,
      metaTitle: v.metaTitle || undefined,
      metaDescription: v.metaDescription || undefined,
    };

    await onSubmit(payload);
  };

  // ── Reset ─────────────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setValues(buildInitialValues(initialData));
    setImages(
      initialData?.thumbnail
        ? [{ url: initialData.thumbnail } as IUploadedMediaWithMeta]
        : [],
    );
    setErrors({});
  }, [initialData]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ── 4. SEO ────────────────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium text-slate-700">
            SEO
          </CardTitle>
          <Separator />
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldWrapper
            label={`Meta Title (${(values.metaTitle ?? "").length}/60)`}
            error={errors.metaTitle}
          >
            <Input
              placeholder="SEO title (optional, defaults to blog title)"
              value={values.metaTitle ?? ""}
              onChange={(e) => set("metaTitle", e.target.value)}
            />
          </FieldWrapper>

          <FieldWrapper
            label={`Meta Description (${(values.metaDescription ?? "").length}/160)`}
            error={errors.metaDescription}
          >
            <Input
              placeholder="SEO description for search engines..."
              value={values.metaDescription ?? ""}
              onChange={(e) => set("metaDescription", e.target.value)}
            />
          </FieldWrapper>
        </CardContent>
      </Card>

      {/* ── 1. Basic Information ──────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium text-slate-700">
            Basic Information
          </CardTitle>
          <Separator />
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div id="field-title">
            <FieldWrapper label="Title" required error={errors.title}>
              <Input
                placeholder="Blog title"
                value={values.title}
                onChange={handleTitleChange}
              />
            </FieldWrapper>
          </div>

          {/* Slug — auto generated, disabled */}
          <div id="field-slug">
            <FieldWrapper label="Slug" required error={errors.slug}>
              <Input disabled placeholder="blog-slug" value={values.slug} />
            </FieldWrapper>
          </div>

          {/* Category */}
          <FieldWrapper label="Category" error={errors.category}>
            <Select
              value={values.category ?? ""}
              onValueChange={(v) => set("category", v)}
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

          {/* Status */}
          <FieldWrapper label="Status" required error={errors.status}>
            <RadioGroup
              value={values.status}
              onValueChange={(v) => set("status", v as "DRAFT" | "PUBLISHED")}
              className="flex gap-4 pt-1"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="DRAFT" id="status-draft" />
                <Label
                  htmlFor="status-draft"
                  className="cursor-pointer font-normal"
                >
                  Draft
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="PUBLISHED" id="status-published" />
                <Label
                  htmlFor="status-published"
                  className="cursor-pointer font-normal"
                >
                  Published
                </Label>
              </div>
            </RadioGroup>
          </FieldWrapper>

          {/* Excerpt */}
          <div className="md:col-span-2 space-y-1.5">
            <Label className="text-xs uppercase tracking-wide text-slate-500">
              Excerpt
            </Label>
            <textarea
              value={values.excerpt ?? ""}
              onChange={(e) => set("excerpt", e.target.value)}
              placeholder="Short summary shown in blog listing..."
              rows={2}
              className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            {errors.excerpt && (
              <p className="text-[0.75rem] text-destructive flex items-center gap-1">
                <span>⚠</span> {errors.excerpt}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="md:col-span-2 space-y-1.5">
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
              onChange={(kws: string[]) => set("tags", kws.join(", "))}
            />
            {errors.tags && (
              <p className="text-[0.75rem] text-destructive flex items-center gap-1">
                <span>⚠</span> {errors.tags}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── 2. Thumbnail ──────────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium text-slate-700">
            Thumbnail
          </CardTitle>
          <Separator />
        </CardHeader>
        <CardContent>
          <MediaUploader
            key={images.length === 0 ? "empty" : "filled"}
            uploadType="image"
            multiple={false}
            label="Upload Blog Thumbnail"
            required={false}
            max="1mb"
            defaultValue={images}
            onChange={handleUpload}
          />
          {errors.thumbnail && (
            <p className="mt-1.5 text-[0.75rem] text-destructive flex items-center gap-1">
              <span>⚠</span> {errors.thumbnail}
            </p>
          )}
        </CardContent>
      </Card>

      {/* ── 3. Content ────────────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium text-slate-700">
            Content
          </CardTitle>
          <Separator />
        </CardHeader>
        <CardContent>
          <div id="field-content">
            <TiptapEditor
              value={values.content}
              onChange={(v: string) => set("content", v)}
              minHeight="280px"
              maxHeight="600px"
              showWordCount
              showCharacterCount
            />
          </div>
          {errors.content && (
            <p className="mt-1.5 text-[0.75rem] text-destructive flex items-center gap-1">
              <span>⚠</span> {errors.content}
            </p>
          )}
        </CardContent>
      </Card>

      {/* ── Submit ────────────────────────────────────────────────────────── */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button type="submit" disabled={saving} className="min-w-[140px]">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : isEdit ? (
            "Update Blog"
          ) : (
            "Submit All Data"
          )}
        </Button>
      </div>
    </form>
  );
}
