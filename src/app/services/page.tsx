"use client";

import SectionHeader from "@/components/SectionHeader";
import StackingServiceCards from "@/components/StackingServiceCards";
import CTASection from "@/components/CTASection";
import AnimatedBackground from "@/components/AnimatedBackground";
import { SERVICES } from "@/lib/constants";
import { motion } from "framer-motion";
import { MessageSquare, BarChart3, Layers, Printer as PrintIcon, Truck } from "lucide-react";

const WORKFLOW = [
  { title: "Consultation", desc: "Technical spec and material requirement alignment.", icon: MessageSquare, color: "text-cyan-dark" },
  { title: "Analysis", desc: "Art review for resolution and CMYK profile calibration.", icon: BarChart3, color: "text-magenta" },
  { title: "Preparation", desc: "Machine calibration and substrate surface preparation.", icon: Layers, color: "text-cyan-dark" },
  { title: "Production", desc: "High-speed, high-precision industrial execution.", icon: PrintIcon, color: "text-magenta" },
  { title: "Delivery", desc: "Secure industrial packaging and priority logistics.", icon: Truck, color: "text-cyan-dark" },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-24 px-4 md:px-16 overflow-hidden">
        <AnimatedBackground />
        <div className="max-w-[1280px] mx-auto relative z-10">
          <span className="text-cyan-dark text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
            The High-End CMYK Standard
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-on-surface leading-[1.1] mb-6">
            Precision Printing <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-magenta to-cyan">
              For The Bold.
            </span>
          </h1>
          <p className="text-lg text-on-surface-variant max-w-xl leading-relaxed">
            Industrial technical accuracy meets premium craftsmanship. We define quality
            through assets that command absolute attention.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-4 md:px-16 bg-surface-container-low">
        <div className="max-w-[1280px] mx-auto">
          <SectionHeader
            title="Full-Spectrum Print Solutions"
            description="Every service engineered for maximum impact, durability, and brand fidelity."
          />

          <StackingServiceCards services={SERVICES} />
        </div>
      </section>

      {/* Materials & Finishes Showcase */}
      <section className="py-24 px-4 md:px-16 bg-white border-b border-black/5">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="relative overflow-hidden rounded-3xl border border-black/5 shadow-xl group bg-surface-container-low p-2">
                <img
                  src="/images/pelmeltech/services-print-materials.webp"
                  alt="Flat lay arrangement of premium printed banners, rigid panels, posters, and vinyl rolls"
                  loading="lazy"
                  className="w-full h-[380px] object-cover rounded-2xl transition-transform duration-700 group-hover:scale-102"
                />
              </div>
            </div>
            <div className="lg:col-span-5">
              <span className="text-cyan text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Material Quality</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight mb-6">
                Tactile Excellence & Substrate Range
              </h2>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                Every product from PelmelTech undergoes strict calibration to guarantee vibrancy and high-fidelity output. We print on a wide range of surfaces, including weather-resistant vinyl mesh, rigid composite aluminum (Dibond), acrylic panels, photo-quality paper, and sustainable tension fabrics.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-surface-container-low border border-black/5">
                  <span className="text-magenta font-extrabold text-lg block">99.8%</span>
                  <span className="text-xs text-on-surface-variant font-bold tracking-wide uppercase">Color Match Accuracy</span>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-low border border-black/5">
                  <span className="text-cyan-dark font-extrabold text-lg block">10+ Years</span>
                  <span className="text-xs text-on-surface-variant font-bold tracking-wide uppercase">Outdoor Durability</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="py-24 px-4 md:px-16 bg-surface-container-low overflow-hidden">
        <div className="max-w-[1280px] mx-auto">
          <SectionHeader
            title="The Precision Workflow"
            description="A seamless industrial journey from initial spec to final site installation."
            center
          />

          <div className="relative">
            {/* Animated connecting line */}
            <motion.div
              className="hidden md:block absolute top-10 left-[10%] right-[10%] h-[2px] origin-left"
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="w-full h-full bg-gradient-to-r from-magenta/20 via-cyan-dark/30 to-magenta/20" />
              {/* Traveling light dot */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyan-dark/60 blur-[3px]"
                initial={{ left: "0%" }}
                whileInView={{ left: ["0%", "100%", "0%"] }}
                viewport={{ once: true }}
                transition={{ duration: 4, delay: 1.2, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {WORKFLOW.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.7,
                    delay: 0.2 + i * 0.15,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative z-10 text-center group"
                >
                  {/* Step number badge */}
                  <motion.div
                    className="absolute -top-2 left-1/2 -translate-x-1/2 z-20"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.6 + i * 0.15, type: "spring", stiffness: 300 }}
                  >
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-on-surface text-white text-[10px] font-bold shadow-md">
                      {i + 1}
                    </span>
                  </motion.div>

                  {/* Icon circle with pulse ring */}
                  <div className="relative mx-auto mb-6 w-20 h-20">
                    {/* Pulse ring on hover */}
                    <div className="absolute inset-0 rounded-full bg-transparent border-2 border-transparent group-hover:border-cyan-dark/20 group-hover:animate-[ping_1.5s_ease-in-out_1] transition-colors" />
                    {/* Subtle ambient ring */}
                    <motion.div
                      className="absolute -inset-1 rounded-full"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: [0, 0.5, 0] }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.8 + i * 0.15, ease: "easeInOut" }}
                      style={{
                        background: `radial-gradient(circle, ${i % 2 === 0 ? "rgba(0,150,150,0.15)" : "rgba(180,0,100,0.15)"} 0%, transparent 70%)`,
                      }}
                    />
                    <motion.div
                      className="relative w-20 h-20 bg-white border border-black/5 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-xl transition-all duration-500"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                      <motion.div
                        initial={{ rotate: -180, opacity: 0 }}
                        whileInView={{ rotate: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.5 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <step.icon size={28} className={`${step.color} transition-transform duration-300 group-hover:scale-110`} />
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Text content */}
                  <motion.h4
                    className="text-lg font-bold text-on-surface mb-2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.7 + i * 0.15 }}
                  >
                    {step.title}
                  </motion.h4>
                  <motion.p
                    className="text-sm text-on-surface-variant"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.8 + i * 0.15 }}
                  >
                    {step.desc}
                  </motion.p>

                  {/* Connector dot on the line */}
                  <motion.div
                    className="hidden md:block absolute top-10 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white bg-on-surface/20 group-hover:bg-cyan-dark transition-colors duration-300 shadow-sm z-20"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.9 + i * 0.15, type: "spring", stiffness: 500 }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Need a custom solution?"
        description="Our engineering team specializes in bespoke printing solutions for non-standard surfaces and specialized environments."
        primaryLabel="Consult Our Experts"
        primaryHref="/contact"
        secondaryLabel="View Catalog"
        secondaryHref="/catalog"
      />
    </>
  );
}
