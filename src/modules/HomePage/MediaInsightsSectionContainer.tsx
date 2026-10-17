import {
  getAllPublicIdeaBrighters,
  type IIdeaBrighter,
} from "@/services/mediaContentManagement/ideaBrighter.service";

import MediaInsightsSection, { type InsightPost } from "./MediaInsightsSection";

// Rich text (Tiptap) theke card er jonno plain text excerpt
const stripHtml = (html?: string | null) =>
  (html ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export default async function MediaInsightsSectionContainer() {
  let items: IIdeaBrighter[] = [];

  try {
    // Backend newest first pathay; amra sob published item anbo
    const { data } = await getAllPublicIdeaBrighters({
      isPublished: true,
      page: 1,
      limit: 100,
    });

    // Reverse: je ta sobar age add hoyeche seta first (featured) hobe
    items = [...(data ?? [])].reverse();
  } catch (error) {
    console.error(
      "[MediaInsightsSectionContainer] failed to load Idea Brighters:",
      error,
    );
  }

  const posts: InsightPost[] = items.flatMap((item) => {
    const title = item.title?.trim();
    if (!title) return [];

    return [
      {
        title,
        text: stripHtml(item.description),
        image: item.imageUrl?.trim() || "",
        href: `/insights/${item.id}`,
      },
    ];
  });

  // posts empty hole MediaInsightsSection nijer default content dekhabe
  return <MediaInsightsSection posts={posts} />;
}
