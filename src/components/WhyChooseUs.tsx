"use client";

import { motion, useInView } from "framer-motion";
import { Shield, Zap, Target, Award, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  { value: 500, suffix: "+", label: "Projects Delivered" },
  { value: 15, suffix: "+", label: "Years Experience" },
  { value: 10, suffix: "K+", label: "sqm Printed" },
  { value: 100, suffix: "%", label: "Quality Guarantee" },
];

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const startTime = performance.now();

    function update(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }, [inView, value]);

  return (
    <span ref={ref} className="text-3xl md:text-4xl font-extrabold text-on-surface block mb-1 tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

function ReasonCard({
  reason,
  index,
}: {
  reason: { icon: LucideIcon; title: string; desc: string };
  index: number;
}) {
  const delay = 0.15 + index * 0.12;
  const Icon = reason.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease }}
      className="group relative"
    >
      <div className="relative p-7 rounded-3xl border border-transparent hover:border-outline-variant/15 hover:bg-white/80 hover:shadow-[0_8px_48px_-12px_rgba(0,0,0,0.06)] hover:backdrop-blur-sm transition-all duration-500">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: delay + 0.1,
            scale: {
              type: "spring",
              damping: 14,
              stiffness: 200,
              delay: delay + 0.1,
            },
          }}
          className="relative w-11 h-11 mb-5"
        >
          <div className="absolute -inset-2 rounded-xl bg-magenta/0 group-hover:bg-magenta/[0.04] blur-xl transition-all duration-700" />
          <div className="relative w-11 h-11 rounded-xl bg-magenta/[0.04] group-hover:bg-magenta/[0.08] flex items-center justify-center transition-colors duration-500">
            <Icon
              size={20}
              className="text-magenta/60 group-hover:text-magenta transition-colors duration-500"
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h3
          className="text-[15px] font-semibold text-on-surface mb-2 group-hover:text-magenta-dark transition-colors duration-300"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: delay + 0.15, ease }}
        >
          {reason.title}
        </motion.h3>

        {/* Hover accent line */}
        <div className="mb-3 h-px w-0 group-hover:w-8 bg-magenta/20 transition-all duration-500 ease-out" />

        {/* Description */}
        <motion.p
          className="text-[13px] text-on-surface-variant/50 leading-relaxed group-hover:text-on-surface-variant/70 transition-colors duration-500"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: delay + 0.2, ease }}
        >
          {reason.desc}
        </motion.p>
      </div>
    </motion.div>
  );
}

export default function WhyChooseUs() {
  return (
    <section className="py-32 overflow-hidden relative bg-white">
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(226,0,116,0.012)_0%,transparent_70%)]" />

      <div className="relative max-w-[1280px] mx-auto px-4 md:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease }}
          className="text-center mb-20"
        >
          <motion.span
            className="text-magenta text-[11px] font-bold tracking-[0.25em] uppercase mb-4 block"
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.25em" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease }}
          >
            Why PelmelTech
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-on-surface leading-tight mb-4">
            Built for Quality at Scale
          </h2>
          <motion.p
            className="text-base text-on-surface-variant/60 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease }}
          >
            Industrial precision meets premium craftsmanship. Every project gets the same
            attention to detail, whether it&apos;s one banner or a thousand panels.
          </motion.p>
          <motion.div
            className="mt-6 mx-auto h-px bg-gradient-to-r from-transparent via-magenta/25 to-transparent"
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: 48, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5, ease }}
          />
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-2 mb-20">
          {REASONS.map((reason, i) => (
            <ReasonCard key={reason.title} reason={reason} index={i} />
          ))}
        </div>

        {/* Stats divider */}
        <motion.div
          className="mx-auto h-px mb-16 bg-gradient-to-r from-transparent via-outline-variant/20 to-transparent"
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: "100%", opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1.2, ease }}
        />

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease }}
              className="group text-center py-8 px-4 rounded-2xl border border-transparent hover:border-outline-variant/12 hover:shadow-[0_4px_32px_-8px_rgba(0,0,0,0.04)] transition-all duration-500"
            >
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-on-surface-variant/45 group-hover:text-on-surface-variant/65 transition-colors duration-500">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
