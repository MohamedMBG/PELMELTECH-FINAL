"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    num: "01",
    title: "Brief",
    desc: "Share your project requirements and vision with our team.",
  },
  {
    num: "02",
    title: "Design & Prepare",
    desc: "We create print-ready artwork and material specifications.",
  },
  {
    num: "03",
    title: "Print & Finish",
    desc: "Industrial production with precision calibration and quality control.",
  },
  {
    num: "04",
    title: "Deliver & Install",
    desc: "Professional delivery and on-site installation when needed.",
  },
];

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

function StepRing({ num, delay }: { num: string; delay: number }) {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease }}
      className="relative mx-auto mb-7 w-16 h-16"
    >
      <svg
        className="absolute inset-0 w-full h-full -rotate-90"
        viewBox="0 0 64 64"
      >
        <circle
          cx="32"
          cy="32"
          r="30"
          fill="none"
          strokeWidth="1"
          className="stroke-outline-variant/15"
        />
        <motion.circle
          cx="32"
          cy="32"
          r="30"
          fill="none"
          strokeWidth="1.5"
          className="stroke-magenta/40"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: delay + 0.2, ease }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[13px] font-mono font-bold tracking-widest text-on-surface/30 group-hover:text-magenta transition-colors duration-500">
          {num}
        </span>
      </div>
    </motion.div>
  );
}

function ConnectorDot({ delay }: { delay: number }) {
  return (
    <motion.div
      className="hidden lg:flex absolute top-8 -right-[calc(12.5%+4px)] w-2 h-2 items-center justify-center z-10"
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay, ease }}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-magenta/25" />
    </motion.div>
  );
}

export default function ProcessSection() {
  return (
    <section className="py-32 bg-white overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="text-center mb-20"
        >
          <motion.span
            className="text-cyan-dark text-[11px] font-bold tracking-[0.25em] uppercase mb-4 block"
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.25em" }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease }}
          >
            How It Works
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-on-surface leading-tight">
            Our Process
          </h2>
        </motion.div>

        <div className="relative">
          <motion.div
            className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.6, delay: 0.4, ease }}
            style={{ transformOrigin: "left" }}
          >
            <div className="w-full h-full bg-gradient-to-r from-magenta/15 via-outline-variant/20 to-transparent" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-14 lg:gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.15, ease }}
                className="group relative text-center"
              >
                <StepRing num={step.num} delay={0.25 + i * 0.15} />

                {i < STEPS.length - 1 && (
                  <ConnectorDot delay={0.6 + i * 0.15} />
                )}

                <motion.h3
                  className="text-[15px] font-semibold text-on-surface mb-2.5 group-hover:text-magenta-dark transition-colors duration-300"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.45 + i * 0.15, ease }}
                >
                  {step.title}
                </motion.h3>

                <motion.p
                  className="text-[13px] text-on-surface-variant/60 leading-relaxed max-w-[200px] mx-auto"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.55 + i * 0.15, ease }}
                >
                  {step.desc}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
