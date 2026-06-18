"use client";

import HomeHero from "@/components/HomeHero";
import CapabilityStrip from "@/components/CapabilityStrip";
import ServicesPreview from "@/components/ServicesPreview";
import WhyChooseUs from "@/components/WhyChooseUs";
import CatalogPreview from "@/components/CatalogPreview";
import PortfolioPreview from "@/components/PortfolioPreview";
import ProcessSection from "@/components/ProcessSection";
import InvestorSection from "@/components/InvestorSection";
import CTASection from "@/components/CTASection";
import { useLanguage } from "@/i18n";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <>
      <HomeHero />
      <CapabilityStrip />
      <ServicesPreview />
      <WhyChooseUs />
      <CatalogPreview />
      <PortfolioPreview />
      <ProcessSection />
      <InvestorSection />
      <CTASection
        title={t.cta.homeTitle}
        description={t.cta.homeDescription}
        primaryLabel={t.hero.requestQuote}
        primaryHref="/contact"
        secondaryLabel={t.cta.homeSecondary}
        secondaryHref="/catalog"
      />
    </>
  );
}
