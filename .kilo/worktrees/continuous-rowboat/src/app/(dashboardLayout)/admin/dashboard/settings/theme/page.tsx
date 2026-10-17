import AdminTheme from "@/modules/AdminDashboard/AdminSettings/AdminTheme/AdminTheme";
import AdminThemeSkeleton from "@/modules/AdminDashboard/AdminSettings/AdminTheme/components/AdminThemeSkeleton";
import { getThemeSettings } from "@/services/settings/theme.service";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Theme Settings",
  description: "Manage your website branding assets",
};

async function ThemeContent() {
  const data = await getThemeSettings();
  return (
    <AdminTheme
      initialData={{
        logoUrl: data?.logoUrl ?? "",
        logoPublicId: data?.logoPublicId ?? "",
        faviconUrl: data?.faviconUrl ?? "",
        faviconPublicId: data?.faviconPublicId ?? "",
        footerLogoUrl: data?.footerLogoUrl ?? "",
        footerLogoPublicId: data?.footerLogoPublicId ?? "",
      }}
    />
  );
}

export default function ThemePage() {
  return (
    <section aria-label="Theme Settings">
      <Suspense fallback={<AdminThemeSkeleton />}>
        <ThemeContent />
      </Suspense>
    </section>
  );
}
