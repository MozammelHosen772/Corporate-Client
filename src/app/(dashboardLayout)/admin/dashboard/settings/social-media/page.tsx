import { Metadata } from "next";
import { Suspense } from "react";

import AdminSocialMedia from "@/modules/AdminDashboard/AdminSettings/AdminSocialMedia/AdminSocialMedia";
import AdminSocialMediaSkeleton from "@/modules/AdminDashboard/AdminSettings/AdminSocialMedia/components/AdminSocialMediaSkeleton";
import { getSocialMedia } from "@/services/settings/socialMedia.service";

export const metadata: Metadata = {
  title: "Social Media Settings",
  description: "Manage your social media links",
};

async function SocialMediaContent() {
  const social = await getSocialMedia();

  return (
    <AdminSocialMedia
      initialData={{
        facebook: social?.facebook ?? "",
        youtube: social?.youtube ?? "",
        instagram: social?.instagram ?? "",
        twitter: social?.twitter ?? "",
      }}
    />
  );
}

export default function SocialMedia() {
  return (
    <section aria-label="Social Media Settings">
      <Suspense fallback={<AdminSocialMediaSkeleton />}>
        <SocialMediaContent />
      </Suspense>
    </section>
  );
}
