"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  labelColor?: "magenta" | "cyan";
  center?: boolean;
}

export default function SectionHeader({ label, title, description, labelColor = "magenta", center = false }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`mb-16 ${center ? "text-center" : ""}`}
    >
      {label && (
        <span className={`text-xs font-bold tracking-[0.2em] uppercase mb-4 block ${
          labelColor === "magenta" ? "text-magenta" : "text-cyan-dark"
        }`}>
          {label}
        </span>
      )}
      <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface leading-tight mb-4">
        {title}
      </h2>
      {description && (
        <p className={`text-lg text-on-surface-variant leading-relaxed ${center ? "max-w-2xl mx-auto" : "max-w-xl"}`}>
          {description}
        </p>
      )}
    </motion.div>
  );
}
