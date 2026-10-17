import CategorySection from "@/modules/HomePages/CategorySection";
import { PublicBannerSliderFallBack } from "@/modules/HomePages/PublicBannerSliderFallBack";
import { PublicBannerSliderSection } from "@/modules/HomePages/PublicBannerSliderSection";
import { FlashSaleFallback } from "@/modules/PublicProducts/FlashSaleProducts/components/FlashSaleFallback";
import FlashSaleProducts from "@/modules/PublicProducts/FlashSaleProducts/FlashSaleProducts";
import { Suspense } from "react";

export default async function Page() {
  return (
    <main>
      <Suspense fallback={<PublicBannerSliderFallBack />}>
        <PublicBannerSliderSection />
      </Suspense>
      <CategorySection />
      <Suspense fallback={<FlashSaleFallback />}>
        <FlashSaleProducts />
      </Suspense>
    </main>
  );
}
