import { getPublicHeroSliders } from "@/services/settings/bannerSlider.service";
import FetchErrorState from "@/shared/FetchErrorState";
import { PublicBannerSlider } from "./PublicBannerSlider";

export const PublicBannerSliderSection = async () => {
  const sliders = await getPublicHeroSliders();
  if (sliders === null) {
    return (
      <div className="w-full max-w-[1400px] mx-auto px-2 md:px-4 py-4">
        <FetchErrorState
          title="স্লাইডার লোড করা যায়নি"
          message="সার্ভারের সাথে সংযোগ করা যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।"
        />
      </div>
    );
  }
  if (!sliders.length) {
    return null;
  }

  const centerSliders = sliders.filter((item) => item.position === "center");

  const leftSliders = sliders.filter((item) => item.position === "left");

  return (
    <PublicBannerSlider
      centerSliders={centerSliders}
      leftSliders={leftSliders}
    />
  );
};
