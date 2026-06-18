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

export default function HomePage() {
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
        title="Ready to turn your next campaign into a visible experience?"
        description="Consult with our team to explore premium large-format printing, event branding, and custom production for your next project."
        primaryLabel="Request a Quote"
        primaryHref="/contact"
        secondaryLabel="View Catalog"
        secondaryHref="/catalog"
      />
    </>
  );
}
