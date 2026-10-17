import AboutComponent from "@/modules/footer/footerPages/AboutComponent";
import { getAboutPublic } from "@/services/settings/adminAbout.service";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutPublic();
  return {
    title: about?.metaTitle || "About Us",
    description: about?.metaDescription || "",
    keywords: about?.metaKeywords || "",
  };
}

export default async function AboutPage() {
  const about = await getAboutPublic();
  return <AboutComponent about={about} />;
}
