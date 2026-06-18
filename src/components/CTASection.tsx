"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
  title: string;
  description: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export default function CTASection({
  title,
  description,
  primaryLabel = "Start a Consultation",
  primaryHref = "/contact",
  secondaryLabel,
  secondaryHref,
}: CTASectionProps) {
  return (
    <section className="py-24 px-4 md:px-16 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-[1280px] mx-auto relative bg-white shadow-xl p-8 md:p-20 rounded-3xl border border-black/5 overflow-hidden"
      >
        <div className="absolute -right-24 -bottom-24 w-[300px] h-[300px] bg-cyan/6 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -left-24 -top-24 w-[300px] h-[300px] bg-magenta/6 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-on-surface mb-6">
            {title}
          </h2>
          <p className="text-base md:text-lg text-on-surface-variant leading-relaxed mb-10">
            {description}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={primaryHref}
              className="bg-magenta text-white px-10 py-4 rounded-full text-xs font-bold tracking-[0.15em] uppercase hover:brightness-110 transition-all shadow-lg shadow-magenta/10 active:scale-95 flex items-center gap-2"
            >
              {primaryLabel} <ArrowRight size={16} />
            </Link>
            {secondaryLabel && secondaryHref && (
              <Link
                href={secondaryHref}
                className="border border-black/10 text-on-surface px-10 py-4 rounded-full text-xs font-bold tracking-[0.15em] uppercase hover:bg-surface-container transition-all"
              >
                {secondaryLabel}
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
