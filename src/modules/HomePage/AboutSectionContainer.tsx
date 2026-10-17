import { getAllPublicAboutLeaders } from "@/services/mediaContentManagement/aboutLeader.service";
import AboutSection from "./AboutSection";

type AboutLeaderItem = Awaited<
  ReturnType<typeof getAllPublicAboutLeaders>
>["data"][number];

export default async function AboutSectionContainer() {
  let item: AboutLeaderItem | null = null;

  try {
    // Newest published item (backend returns newest first)
    const { data } = await getAllPublicAboutLeaders({
      isPublished: true,
      page: 1,
      limit: 1,
    });
    item = data[0] ?? null;
  } catch (error) {
    console.error(
      "[AboutSectionContainer] failed to load About Leader:",
      error,
    );
  }

  // item null hole AboutSection nijer default content dekhabe
  return (
    <AboutSection
      title={item?.title}
      description={item?.description}
      imageUrl={item?.imageUrl}
    />
  );
}
