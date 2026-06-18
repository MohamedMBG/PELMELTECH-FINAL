"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getParentCategories, getSubcategories } from "@/lib/catalog";
import { useLanguage } from "@/i18n";

import categoriesData from "@/data/categories.json";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const staticCategories = (() => {
  const parents = (categoriesData as any[]).filter((c) => c.parentId === null && c.status === "published");
  return parents.flatMap((parent) =>
    (categoriesData as any[])
      .filter((c) => c.parentId === parent.id && c.status === "published")
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .slice(0, 2)
      .map((sub) => sub.name as string)
  );
})();

export default function CatalogPreview() {
  const [previewCategories, setPreviewCategories] = useState<string[]>(staticCategories);
  const { t } = useLanguage();

  useEffect(() => {
    const parents = getParentCategories();
    setPreviewCategories(
      parents.flatMap((parent) =>
        getSubcategories(parent.id).slice(0, 2).map((sub) => sub.name)
      )
    );
  }, []);

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
              {t.catalogPreview.tag}
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-on-surface leading-tight mb-6">
              {t.catalogPreview.title}{" "}
              <span className="text-magenta">{t.catalogPreview.titleAccent}</span>
            </h2>
            <p className="text-base md:text-lg text-on-surface-variant leading-relaxed mb-8">
              {t.catalogPreview.description}
            </p>

            <ul className="space-y-3 mb-10">
              {previewCategories.map((cat, i) => (
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
              {t.catalogPreview.browseCatalog} <ArrowRight size={16} className="rtl:rotate-180" />
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
