"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  "Large Format Printers",
  "Banners & Mesh",
  "Rigid Panels",
  "Event Displays",
  "Print Materials",
];

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function CatalogPreview() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-[1280px] mx-auto px-4 md:px-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
          >
            <span className="text-cyan-dark text-xs font-bold tracking-[0.2em] uppercase mb-3 block">
              Product Catalog
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-on-surface leading-tight mb-6">
              Everything You Need,{" "}
              <span className="text-magenta">Ready to Print</span>
            </h2>
            <p className="text-base md:text-lg text-on-surface-variant leading-relaxed mb-8">
              Browse our complete range of premium print products, from industrial mesh
              banners to rigid aluminum panels and exhibition systems.
            </p>

            <ul className="space-y-3 mb-10">
              {CATEGORIES.map((cat, i) => (
                <motion.li
                  key={cat}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease }}
                  className="flex items-center gap-3"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan shrink-0" />
                  <span className="text-sm font-medium text-on-surface">{cat}</span>
                </motion.li>
              ))}
            </ul>

            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 bg-on-surface text-white px-8 py-4 rounded-full text-xs font-bold tracking-[0.15em] uppercase hover:bg-magenta transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
            >
              Browse Catalog <ArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
              <Image
                src="/images/pelmeltech/catalog-hero.webp"
                alt="PelmelTech product catalog"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
