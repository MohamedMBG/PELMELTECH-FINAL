"use client";

import SectionHeader from "@/components/SectionHeader";
import StackingServiceCards from "@/components/StackingServiceCards";
import CTASection from "@/components/CTASection";
import AnimatedBackground from "@/components/AnimatedBackground";
import { motion } from "framer-motion";
import { MessageSquare, BarChart3, Layers, Printer as PrintIcon, Truck } from "lucide-react";
import { useLanguage } from "@/i18n";

const WORKFLOW_ICONS = [MessageSquare, BarChart3, Layers, PrintIcon, Truck];
const WORKFLOW_COLORS = ["text-cyan-dark", "text-magenta", "text-cyan-dark", "text-magenta", "text-cyan-dark"];

const SERVICE_ICONS = ["Ruler", "PartyPopper", "Flag", "LayoutGrid", "Image", "Megaphone", "Settings"] as const;
const SERVICE_ACCENTS = ["cyan", "magenta", "cyan", "magenta", "cyan", "magenta", "cyan"] as const;
const SERVICE_IMAGES = [
  "/images/pelmeltech/service-large-format.webp",
  "/images/pelmeltech/service-event-printing.webp",
  "/images/pelmeltech/service-banner-printing.webp",
  "/images/pelmeltech/service-panel-printing.webp",
  "/images/pelmeltech/product-poster-set.webp",
  "/images/pelmeltech/product-marketing-kit.webp",
  "/images/pelmeltech/services-print-materials.webp",
];

export default function ServicesPage() {
  const { t } = useLanguage();

  const services = t.servicesPage.items.map((item, i) => ({
    title: item.title,
    description: item.description,
    features: item.features as unknown as readonly string[],
    icon: SERVICE_ICONS[i],
    accent: SERVICE_ACCENTS[i],
    image: SERVICE_IMAGES[i],
  }));

  const workflow = [
    { title: t.process.steps[0].title, desc: t.process.steps[0].desc },
    { title: t.process.steps[1].title, desc: t.process.steps[1].desc },
    { title: t.process.steps[2].title, desc: t.process.steps[2].desc },
    { title: t.process.steps[2].title, desc: t.process.steps[2].desc },
    { title: t.process.steps[3].title, desc: t.process.steps[3].desc },
  ];

  return (
    <>
      <section className="relative section-y px-4 md:px-16 overflow-hidden">
        <AnimatedBackground />
        <div className="max-w-[1280px] mx-auto relative z-10">
          <span className="text-cyan-dark text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
            {t.services.tag}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-on-surface leading-[1.1] mb-6">
            {t.services.title}
          </h1>
          <p className="text-lg text-on-surface-variant max-w-xl leading-relaxed">
            {t.services.description}
          </p>
        </div>
      </section>

      <section className="section-y px-4 md:px-16 bg-surface-container-low">
        <div className="max-w-[1280px] mx-auto">
          <SectionHeader
            title={t.services.title}
            description={t.services.description}
          />
          <StackingServiceCards services={services} />
        </div>
      </section>

      <section className="section-y px-4 md:px-16 bg-white border-b border-black/5">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="relative overflow-hidden rounded-3xl border border-black/5 shadow-xl group bg-surface-container-low p-2">
                <img
                  src="/images/pelmeltech/services-print-materials.webp"
                  alt="Premium printed materials"
                  loading="lazy"
                  className="w-full h-[380px] object-cover rounded-2xl transition-transform duration-700 group-hover:scale-102"
                />
              </div>
            </div>
            <div className="lg:col-span-5">
              <span className="text-cyan text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
                {t.whyChooseUs.reasons[2].title}
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight mb-6">
                {t.whyChooseUs.title}
              </h2>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                {t.whyChooseUs.description}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-surface-container-low border border-black/5">
                  <span className="text-magenta font-extrabold text-lg block">99.8%</span>
                  <span className="text-xs text-on-surface-variant font-bold tracking-wide uppercase">{t.whyChooseUs.reasons[0].title}</span>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-low border border-black/5">
                  <span className="text-cyan-dark font-extrabold text-lg block">10+</span>
                  <span className="text-xs text-on-surface-variant font-bold tracking-wide uppercase">{t.whyChooseUs.stats[1].label}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y px-4 md:px-16 bg-surface-container-low overflow-hidden">
        <div className="max-w-[1280px] mx-auto">
          <SectionHeader
            title={t.process.title}
            description={t.services.description}
            center
          />

          <div className="relative">
            <motion.div
              className="hidden md:block absolute top-10 left-[10%] right-[10%] h-[2px] origin-left"
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="w-full h-full bg-gradient-to-r from-magenta/20 via-cyan-dark/30 to-magenta/20" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {t.process.steps.map((step, i) => {
                const Icon = WORKFLOW_ICONS[i] || WORKFLOW_ICONS[0];
                const color = WORKFLOW_COLORS[i] || WORKFLOW_COLORS[0];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 40, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.7, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10 text-center group"
                  >
                    <div className="relative mx-auto mb-6 w-20 h-20">
                      <motion.div
                        className="relative w-20 h-20 bg-white border border-black/5 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-xl transition-all duration-500"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      >
                        <Icon size={28} className={`${color} transition-transform duration-300 group-hover:scale-110`} />
                      </motion.div>
                    </div>
                    <h4 className="text-lg font-bold text-on-surface mb-2">{step.title}</h4>
                    <p className="text-sm text-on-surface-variant">{step.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title={t.catalog.cantFind}
        description={t.catalog.cantFindDescription}
        primaryLabel={t.catalog.consultExperts}
        primaryHref="/contact"
        secondaryLabel={t.cta.homeSecondary}
        secondaryHref="/catalog"
      />
    </>
  );
}
