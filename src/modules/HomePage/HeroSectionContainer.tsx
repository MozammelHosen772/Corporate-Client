import { getAllPublicAiExplores } from "@/services/mediaContentManagement/aiExplore.service";
import HeroSection from "./HeroSection";

export default async function HeroSectionContainer() {
  let item:
    | Awaited<ReturnType<typeof getAllPublicAiExplores>>["data"][number]
    | null = null;

  try {
    // Newest published item (backend returns newest first)
    const { data } = await getAllPublicAiExplores({
      isPublished: true,
      page: 1,
      limit: 1,
    });
    item = data.find((i) => i.isPublished) ?? null;
  } catch (error) {
    // Error log kora hocche jate silent failure na hoy (terminal-e dekhabe)
    console.error("[HeroSectionContainer] failed to load AI Explore:", error);
    item = null; // default hero content dekhabe
  }

  console.log("[HeroSectionContainer] item:", item);

  return (
    <HeroSection
      title={item?.title}
      description={item?.description}
      imageUrl={item?.imageUrl}
    />
  );
}
