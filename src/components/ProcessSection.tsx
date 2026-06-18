"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/i18n";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];
const NUMS = ["01", "02", "03", "04"];

function StepCard({ step, index, total }: { step: { title: string; desc: string }; index: number; total: number }) {
  const delay = 0.15 + index * 0.13;
  const isLast = index === total - 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease }}
      className="group relative"
    >
      {!isLast && (
        <div className="hidden lg:block absolute top-[74px] left-[calc(50%+38px)] right-0 h-px z-0">
          <motion.div
            className="w-full h-full"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: delay + 0.5, ease }}
            style={{ transformOrigin: "left" }}
          >
            <div className="w-full h-full bg-gradient-to-r from-outline-variant/20 to-outline-variant/5" />
          </motion.div>
        </div>
      )}

      {index > 0 && (
        <div className="hidden lg:block absolute top-[74px] left-0 right-[calc(50%+38px)] h-px z-0">
          <motion.div
            className="w-full h-full"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: delay + 0.4, ease }}
            style={{ transformOrigin: "right" }}
          >
            <div className="w-full h-full bg-gradient-to-l from-outline-variant/20 to-outline-variant/5" />
          </motion.div>
        </div>
      )}

      <div className="relative rounded-3xl px-6 py-10 text-center transition-all duration-500 border border-transparent hover:border-outline-variant/15 hover:bg-white/80 hover:shadow-[0_8px_48px_-12px_rgba(0,0,0,0.06)] hover:backdrop-blur-sm">
        <motion.div
          className="relative mx-auto mb-7 w-[68px] h-[68px] group-hover:scale-105 transition-transform duration-500"
          initial={{ scale: 0.3, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: delay + 0.1, scale: { type: "spring", damping: 14, stiffness: 200, delay: delay + 0.1 } }}
        >
          <div className="absolute -inset-4 rounded-full bg-magenta/0 group-hover:bg-magenta/[0.04] blur-2xl transition-all duration-700" />
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 68 68">
            <circle cx="34" cy="34" r="32" fill="none" strokeWidth="1" className="stroke-outline-variant/8" />
            <motion.circle
              cx="34" cy="34" r="32" fill="none" strokeWidth="1.5" strokeLinecap="round"
              className="stroke-magenta/25 group-hover:stroke-magenta/50 transition-colors duration-500"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, delay: delay + 0.25, ease }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[13px] font-mono font-bold tracking-[0.15em] text-on-surface/20 group-hover:text-magenta transition-colors duration-500">
              {NUMS[index]}
            </span>
          </div>
        </motion.div>

        <motion.h3
          className="text-[15px] font-semibold text-on-surface mb-2 group-hover:text-magenta-dark transition-colors duration-300"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: delay + 0.2, ease }}
        >
          {step.title}
        </motion.h3>

        <div className="mx-auto mb-3 h-px w-0 group-hover:w-8 bg-magenta/20 transition-all duration-500 ease-out" />

        <motion.p
          className="text-[13px] text-on-surface-variant/50 leading-relaxed max-w-[200px] mx-auto group-hover:text-on-surface-variant/70 transition-colors duration-500"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: delay + 0.3, ease }}
        >
          {step.desc}
        </motion.p>
      </div>
    </motion.div>
  );
}

export default function ProcessSection() {
  const { t } = useLanguage();

  return (
    <section className="py-32 overflow-hidden relative bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(226,0,116,0.015)_0%,transparent_70%)]" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative max-w-[1280px] mx-auto px-4 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease }}
          className="text-center mb-20"
        >
          <motion.span
            className="text-cyan-dark text-[11px] font-bold tracking-[0.25em] uppercase mb-4 block"
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.25em" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease }}
          >
            {t.process.tag}
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-on-surface leading-tight">
            {t.process.title}
          </h2>
          <motion.div
            className="mt-5 mx-auto h-px bg-gradient-to-r from-transparent via-magenta/25 to-transparent"
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: 48, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5, ease }}
          />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-2">
          {t.process.steps.map((step, i) => (
            <StepCard key={i} step={step} index={i} total={t.process.steps.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
