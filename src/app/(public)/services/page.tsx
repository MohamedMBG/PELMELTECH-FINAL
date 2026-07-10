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
            {/* Connector track spans only between the first and last node centers (1/8 → 7/8) */}
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-[2px] -translate-y-1/2">
              <div className="absolute inset-0 bg-black/5" />
              <motion.div
                className="absolute inset-0 origin-left bg-gradient-to-r from-magenta/40 via-cyan-dark/50 to-magenta/40"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
              {/* Traveling pulse conveys "process flow" */}
              <motion.div
                className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-cyan-dark shadow-[0_0_12px_2px_rgba(0,180,216,0.6)]"
                initial={{ left: "0%", opacity: 0 }}
                whileInView={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 2, delay: 0.6, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.5 }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {t.process.steps.map((step, i) => {
                const Icon = WORKFLOW_ICONS[i] || WORKFLOW_ICONS[0];
                const color = WORKFLOW_COLORS[i] || WORKFLOW_COLORS[0];
                const delay = 0.2 + i * 0.15;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10 text-center group"
                  >
                    <motion.div
                      className="relative mx-auto mb-6 w-20 h-20"
                      initial={{ scale: 0.3, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ type: "spring", stiffness: 220, damping: 15, delay: delay + 0.15 }}
                    >
                      <motion.div
                        className="relative z-10 w-20 h-20 bg-white border border-black/5 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-xl transition-all duration-500"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      >
                        <Icon size={28} className={`${color} transition-transform duration-300 group-hover:scale-110`} />
                      </motion.div>
                      {/* Draw-in ring */}
                      <svg className="absolute inset-0 w-full h-full -rotate-90 z-0" viewBox="0 0 80 80">
                        <motion.circle
                          cx="40" cy="40" r="39" fill="none" strokeWidth="2" strokeLinecap="round"
                          className="stroke-magenta/40"
                          initial={{ pathLength: 0 }}
                          whileInView={{ pathLength: 1 }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{ duration: 1, delay: delay + 0.25, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </svg>
                      {/* Step number badge */}
                      <motion.span
                        className="absolute -top-1 -right-1 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-on-surface text-white text-[11px] font-bold shadow-md"
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ type: "spring", stiffness: 400, damping: 14, delay: delay + 0.4 }}
                      >
                        {i + 1}
                      </motion.span>
                    </motion.div>
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
