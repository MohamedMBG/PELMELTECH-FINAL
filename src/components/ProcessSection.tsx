"use client";

import { motion } from "framer-motion";

const STEPS = [
  { num: "01", title: "Brief", desc: "Share your project requirements and vision with our team." },
  { num: "02", title: "Design & Prepare", desc: "We create print-ready artwork and material specifications." },
  { num: "03", title: "Print & Finish", desc: "Industrial production with precision calibration and quality control." },
  { num: "04", title: "Deliver & Install", desc: "Professional delivery and on-site installation when needed." },
];

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function ProcessSection() {
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
          <span className="text-cyan-dark text-xs font-bold tracking-[0.2em] uppercase mb-3 block">
            How It Works
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-on-surface leading-tight">
            Our Process
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12, ease }}
              className="relative text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-surface-container-low border border-black/5 flex items-center justify-center mx-auto mb-5">
                <span className="text-lg font-extrabold tracking-tight text-magenta">
                  {step.num}
                </span>
              </div>

              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-7 left-[calc(50%+36px)] w-[calc(100%-72px)] h-px">
                  <div className="w-full h-full bg-gradient-to-r from-outline-variant/40 to-outline-variant/10" />
                </div>
              )}

              <h3 className="text-base font-bold text-on-surface mb-2">{step.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed max-w-[220px] mx-auto">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
