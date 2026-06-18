"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Target, Award } from "lucide-react";

const REASONS = [
  {
    icon: Target,
    title: "Precision Color Matching",
    desc: "Sub-millimeter accuracy with certified ICC color profiles across every print run.",
  },
  {
    icon: Zap,
    title: "Fast Turnaround",
    desc: "From brief to delivery in days, not weeks. Rush production available for tight deadlines.",
  },
  {
    icon: Shield,
    title: "Durable Materials",
    desc: "UV-resistant inks, weather-proof substrates, and finishes built to last outdoors and indoors.",
  },
  {
    icon: Award,
    title: "End-to-End Service",
    desc: "Design preparation, printing, finishing, and professional on-site installation — all in-house.",
  },
];

const STATS = [
  { value: "500+", label: "Projects Delivered" },
  { value: "15+", label: "Years Experience" },
  { value: "10K+", label: "sqm Printed" },
  { value: "100%", label: "Quality Guarantee" },
];

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-16"
        >
          <span className="text-magenta text-xs font-bold tracking-[0.2em] uppercase mb-3 block">
            Why PelmelTech
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-on-surface leading-tight mb-4">
            Built for Quality at Scale
          </h2>
          <p className="text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Industrial precision meets premium craftsmanship. Every project gets the same
            attention to detail, whether it&apos;s one banner or a thousand panels.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {REASONS.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
              className="p-6 rounded-2xl border border-black/5 bg-surface-container-low hover:shadow-md transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-magenta/5 flex items-center justify-center mb-4">
                <reason.icon size={20} className="text-magenta" />
              </div>
              <h3 className="text-base font-bold text-on-surface mb-2">{reason.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{reason.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease }}
              className="text-center py-6 px-4 rounded-2xl bg-surface-container-low border border-black/5"
            >
              <span className="text-3xl md:text-4xl font-extrabold text-on-surface block mb-1">
                {stat.value}
              </span>
              <span className="text-xs font-semibold tracking-[0.1em] uppercase text-on-surface-variant">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
