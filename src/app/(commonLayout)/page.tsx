import AboutSectionContainer from "@/modules/HomePage/AboutSectionContainer";
import EcosystemSection from "@/modules/HomePage/EcosystemSection";
import GlobalPresenceSection from "@/modules/HomePage/GlobalPresenceSection";
import HeroSectionContainer from "@/modules/HomePage/HeroSectionContainer";
import LeadershipGallerySectionContainer from "@/modules/HomePage/LeadershipGallerySectionContainer";
import MediaInsightsSectionContainer from "@/modules/HomePage/MediaInsightsSectionContainer";
import TestimonialsSection from "@/modules/HomePage/TestimonialsSection";

export default function HomePage() {
  return (
    <main>
      <HeroSectionContainer />
      <AboutSectionContainer />
      <EcosystemSection />
      <GlobalPresenceSection />
      <MediaInsightsSectionContainer />
      <TestimonialsSection />
      <LeadershipGallerySectionContainer />
    </main>
  );
}
