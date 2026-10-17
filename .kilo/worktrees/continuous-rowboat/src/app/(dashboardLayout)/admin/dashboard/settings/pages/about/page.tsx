import AdminAboutPages from "@/modules/AdminDashboard/AdminSettings/AdminPages/AdminAbout/AdminAbout";
import { AboutPageSkeleton } from "@/modules/AdminDashboard/AdminSettings/AdminPages/AdminAbout/components/AboutPageSkeleton";
import { getAbout } from "@/services/settings/adminAbout.service";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "About Management",
  description: "Manage about page content",
};

async function AboutContent() {
  const data = await getAbout();
  return <AdminAboutPages initialData={data ?? null} />;
}

export default function AdminAboutPage() {
  return (
    <section aria-label="About Management">
      <Suspense fallback={<AboutPageSkeleton />}>
        <AboutContent />
      </Suspense>
    </section>
  );
}
