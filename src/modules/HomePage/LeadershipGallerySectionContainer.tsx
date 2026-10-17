import {
  getAllPublicTheGrounds,
  type ITheGround,
} from "@/services/mediaContentManagement/theGround.service";

import LeadershipGallerySection, {
  type GalleryPhoto,
} from "./LeadershipGallerySection";

export default async function LeadershipGallerySectionContainer() {
  let items: ITheGround[] = [];

  try {
    // Backend newest first pathay; amra sob published item anbo
    const { data } = await getAllPublicTheGrounds({
      isPublished: true,
      page: 1,
      limit: 100,
    });

    // Reverse: je ta sobar age add hoyeche seta first (boro card) hobe
    items = [...(data ?? [])].reverse();
  } catch (error) {
    console.error(
      "[LeadershipGallerySectionContainer] failed to load The Ground items:",
      error,
    );
  }

  const photos: GalleryPhoto[] = items.flatMap((item) => {
    const title = item.title?.trim();
    const src = item.imageUrl?.trim() || "";

    // Chobi o nei, title o nei hole tobei bad
    if (!src && !title) return [];

    return [
      {
        id: item.id,
        src,
        alt: title || "Gallery photo",
      },
    ];
  });

  // photos empty hole LeadershipGallerySection nijer default content dekhabe
  return <LeadershipGallerySection photos={photos} />;
}
