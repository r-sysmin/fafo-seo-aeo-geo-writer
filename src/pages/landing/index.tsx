import { Header04 } from "./components/header-04";
import { HeroSection } from "./components/hero-section";
import { FeatureShowcase, type Feature } from "./components/feature-showcase-01";
import { PagesListMockup, PlatformPreviewMockup, AiGenerateMockup } from "./components/mockups";

import { TestimonialsSection } from "./components/testimonials-section";
import { CtaBanner } from "./components/cta-banner";
import { FooterSection } from "./components/footer-section";
import { useDataProvider } from "@/lib/data-provider";
import { useMemo } from "react";

export default function Landing() {
  const { useFeatureTabs } = useDataProvider();
  const { data: featureTabs } = useFeatureTabs();

  const features: Feature[] = useMemo(() => featureTabs.map((tab) => {
    const mockupMap: Record<string, React.ReactNode> = {
      checklist: <PagesListMockup />,
      previews: <PlatformPreviewMockup />,
      ai: <AiGenerateMockup />,
    };
    return {
      key: tab.id,
      label: tab.label,
      heading: tab.description,
      mockup: mockupMap[tab.id] ?? <PagesListMockup />,
    };
  }), [featureTabs]);
  return (
    <>
      <Header04 />
      <HeroSection />
      <div id="features">
        <FeatureShowcase features={features} />
      </div>
      
      <div id="testimonials">
        <TestimonialsSection />
      </div>
      <CtaBanner />
      <FooterSection />
    </>
  );
}
