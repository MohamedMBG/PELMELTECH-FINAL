"use client";

import HomeHero from "@/components/HomeHero";
import CapabilityStrip from "@/components/CapabilityStrip";
import ServicesPreview from "@/components/ServicesPreview";
import WhyChooseUs from "@/components/WhyChooseUs";
import CatalogPreview from "@/components/CatalogPreview";
import MachinesShowcase from "@/components/MachinesShowcase";
import ProcessSection from "@/components/ProcessSection";
import AdvantagesSection from "@/components/AdvantagesSection";
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
      <MachinesShowcase />
      <ProcessSection />
      <AdvantagesSection />
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
