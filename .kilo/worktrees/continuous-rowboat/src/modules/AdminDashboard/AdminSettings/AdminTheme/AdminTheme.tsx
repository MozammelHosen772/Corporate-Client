"use client";

import { Button } from "@/components/ui/button";
import { saveThemeSettings } from "@/services/settings/theme.service";
import MediaUploader from "@/shared/mediaUploader/MediaUploader";
import { IUploadedMediaWithMeta } from "@/types/mediaUpload.interface";
import { CheckCircle2, Loader2, Palette } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

type ThemeInitialData = {
  logoUrl: string;
  logoPublicId: string;
  faviconUrl: string;
  faviconPublicId: string;
  footerLogoUrl: string;
  footerLogoPublicId: string;
};

type Props = {
  initialData: ThemeInitialData;
};

// URL থেকে IUploadedMediaWithMeta বানানোর helper
function toMediaItem(
  url: string,
  publicId: string,
  name: string,
): IUploadedMediaWithMeta[] {
  if (!url) return [];
  return [{ url, publicId, resourceType: "image", name, fileType: "image" }];
}

export default function AdminTheme({ initialData }: Props) {
  const [logo, setLogo] = useState<IUploadedMediaWithMeta[]>(
    toMediaItem(initialData.logoUrl, initialData.logoPublicId, "logo"),
  );
  const [favicon, setFavicon] = useState<IUploadedMediaWithMeta[]>(
    toMediaItem(initialData.faviconUrl, initialData.faviconPublicId, "favicon"),
  );
  const [footerLogo, setFooterLogo] = useState<IUploadedMediaWithMeta[]>(
    toMediaItem(
      initialData.footerLogoUrl,
      initialData.footerLogoPublicId,
      "footer-logo",
    ),
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveThemeSettings({
        logoUrl: logo[0]?.url ?? "",
        logoPublicId: logo[0]?.publicId ?? "",
        faviconUrl: favicon[0]?.url ?? "",
        faviconPublicId: favicon[0]?.publicId ?? "",
        footerLogoUrl: footerLogo[0]?.url ?? "",
        footerLogoPublicId: footerLogo[0]?.publicId ?? "",
      });
      toast.success("Theme settings সফলভাবে save হয়েছে।");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Save করা যায়নি।";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-2 md:px-4 py-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
          <Palette className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Theme Settings
          </h2>
          <p className="text-sm text-slate-500">
            Manage your website branding assets
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-4 p-2 md:p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Logo */}
          <MediaCard
            title="Website Logo"
            hint="Recommended size: 128 × 43 PX"
            label="Upload Logo"
            max="5mb"
            value={logo}
            onChange={setLogo}
            previewAlt="Logo Preview"
            previewClass="max-h-[80px] w-auto object-contain"
            previewSize={{ width: 500, height: 300 }}
          />

          {/* Favicon */}
          <MediaCard
            title="Favicon"
            hint="Recommended size: 120 × 120 PX"
            label="Upload Favicon"
            max="2mb"
            value={favicon}
            onChange={setFavicon}
            previewAlt="Favicon Preview"
            previewClass="h-16 w-16 object-contain"
            previewSize={{ width: 120, height: 120 }}
          />
        </div>

        {/* Footer Logo */}
        <MediaCard
          title="Footer Logo"
          hint="Recommended size: 144 × 48 PX"
          label="Upload Footer Logo"
          max="5mb"
          value={footerLogo}
          onChange={setFooterLogo}
          previewAlt="Footer Logo Preview"
          previewClass="max-h-[90px] w-auto object-contain"
          previewSize={{ width: 500, height: 300 }}
          previewHeight="h-[140px]"
        />

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="h-11 rounded-xl bg-orange-500 px-6 text-sm font-medium hover:bg-orange-600 disabled:opacity-70"
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="mr-2 h-4 w-4" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Reusable Media Upload Card ──────────────────────────────────────────────
type MediaCardProps = {
  title: string;
  hint: string;
  label: string;
  max: string;
  value: IUploadedMediaWithMeta[];
  onChange: (v: IUploadedMediaWithMeta[]) => void;
  previewAlt: string;
  previewClass: string;
  previewSize: { width: number; height: number };
  previewHeight?: string;
};

function MediaCard({
  title,
  hint,
  label,
  max,
  value,
  onChange,
  previewAlt,
  previewClass,
  previewSize,
  previewHeight = "h-[120px]",
}: MediaCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-2 md:p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
          {title}
        </h3>
        <p className="mt-1 text-xs text-slate-500">{hint}</p>
      </div>

      <MediaUploader
        uploadType="image"
        label={label}
        required
        max={max}
        onChange={onChange}
        defaultValue={value}
      />

      <div
        className={`mt-5 flex ${previewHeight} items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white`}
      >
        {value[0]?.url ? (
          <Image
            src={value[0].url}
            alt={previewAlt}
            width={previewSize.width}
            height={previewSize.height}
            className={previewClass}
            priority
          />
        ) : (
          <p className="text-sm text-slate-400">No image uploaded</p>
        )}
      </div>
    </div>
  );
}
