import AdminSlider from "@/modules/AdminDashboard/AdminSettings/AdminSlider/AdminSlider";
import { Metadata } from "next";
import { Suspense } from "react";

import AdminSliderSkeleton from "@/modules/AdminDashboard/AdminSettings/AdminSlider/components/Adminsliderskeleton";
import { getAllSliders } from "@/services/settings/bannerSlider.service";

export const metadata: Metadata = {
  title: "Slider Management",
  description: "Manage homepage banner sliders",
};

async function SliderContent() {
  const initialSliders = await getAllSliders();
  return <AdminSlider initialSliders={initialSliders ?? []} />;
}

export default function AdminSliderPage() {
  return (
    <section aria-label="Slider Management">
      <Suspense fallback={<AdminSliderSkeleton />}>
        <SliderContent />
      </Suspense>
    </section>
  );
}
