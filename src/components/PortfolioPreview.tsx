"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n";

const IMAGES = [
  "/images/pelmeltech/portfolio-corporate-event.webp",
  "/images/pelmeltech/portfolio-exhibition-panels.webp",
  "/images/pelmeltech/portfolio-outdoor-campaign.webp",
  "/images/pelmeltech/portfolio-retail-display.webp",
];

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function PortfolioPreview() {
  const { t } = useLanguage();

  return (
    <section className="section-y bg-surface-container-low">
      <div className="max-w-[1280px] mx-auto px-4 md:px-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 sm:mb-12 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
          >
            <span className="text-magenta text-xs font-bold tracking-[0.2em] uppercase mb-3 block">
              {t.portfolio.tag}
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-on-surface leading-tight">
              {t.portfolio.title}
            </h2>
          </motion.div>
          <Link
            href="/portfolio"
            className="text-cyan-dark text-xs font-bold tracking-[0.15em] uppercase flex items-center gap-2 hover:text-on-surface transition-colors border-b border-cyan/30 pb-1 shrink-0"
          >
            {t.portfolio.viewGallery} <ArrowRight size={14} className="rtl:rotate-180" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.portfolio.items.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease }}
              whileHover={{ y: -4 }}
              className="relative h-[320px] rounded-2xl overflow-hidden group cursor-pointer border border-black/5 shadow-sm hover:shadow-lg transition-all duration-500"
            >
              <Image
                src={IMAGES[i]}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/5 transition-opacity duration-500 group-hover:opacity-90" />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/60 mb-1">
                  {project.category}
                </span>
                <h3 className="text-lg font-bold text-white mb-2 transition-colors duration-300 group-hover:text-cyan">
                  {project.title}
                </h3>
                <p className="text-white/70 text-xs leading-relaxed line-clamp-2">{project.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
