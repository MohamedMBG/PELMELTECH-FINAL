"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Download } from "lucide-react";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import CTASection from "@/components/CTASection";
import { getProducts, getAllSubcategories, type CatalogProduct } from "@/lib/catalog";
import { useLanguage } from "@/i18n";

export default function CatalogPage() {
  const [allProducts, setAllProducts] = useState<CatalogProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [activeFinish, setActiveFinish] = useState("");
  const { t } = useLanguage();

  useEffect(() => {
    const products = getProducts();
    setAllProducts(products);
    setCategories([t.catalog.allSolutions, ...getAllSubcategories()]);
    setActiveCategory(t.catalog.allSolutions);
    setActiveFinish(t.catalog.allFinishes);
  }, [t.catalog.allSolutions, t.catalog.allFinishes]);

  const filtered = activeCategory === t.catalog.allSolutions
    ? allProducts
    : allProducts.filter((p) => p.subcategory === activeCategory);

  return (
    <>
      <section className="bg-surface-container-low py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 end-0 w-1/3 h-full bg-gradient-to-l from-magenta/5 to-transparent rtl:bg-gradient-to-r" />
          <div className="absolute bottom-0 end-[10%] w-[300px] h-[300px] bg-cyan/5 rounded-full blur-[100px]" />
        </div>

        <div className="px-4 md:px-16 max-w-[1280px] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <span className="text-magenta text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
                {t.catalog.heroTag}
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-on-surface leading-[1.1] mb-6 max-w-2xl">
                {t.catalog.heroTitle}<span className="text-cyan">.</span>
              </h1>
              <p className="text-lg text-on-surface-variant max-w-xl leading-relaxed">
                {t.catalog.heroDescription}
              </p>
            </div>
            <div className="lg:col-span-5 relative group">
              <div className="relative rounded-3xl overflow-hidden border border-black/5 bg-white p-2 shadow-2xl">
                <Image
                  src="/images/pelmeltech/catalog-hero.webp"
                  alt="PelmelTech product catalog"
                  width={720}
                  height={420}
                  priority
                  className="h-[300px] w-full rounded-2xl object-cover transition-transform duration-700 group-hover:scale-102"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 md:px-16">
        <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-12">
          <aside className="w-full lg:w-72 shrink-0 space-y-10 lg:sticky lg:top-28 h-fit">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm"
            >
              <h3 className="text-lg font-bold text-on-surface mb-6">{t.catalog.categories}</h3>
              <div className="space-y-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full text-start text-sm py-2 px-3 rounded-lg transition-all ${
                      activeCategory === cat
                        ? "bg-magenta/10 text-magenta font-bold"
                        : "text-on-surface-variant hover:bg-surface-container"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-black/5">
                <h3 className="text-lg font-bold text-on-surface mb-6">{t.catalog.materialFinish}</h3>
                <div className="space-y-3">
                  {t.catalog.finishes.map((f) => (
                    <button
                      key={f}
                      onClick={() => setActiveFinish(f)}
                      className={`w-full text-start text-sm py-2 px-3 rounded-lg transition-all ${
                        activeFinish === f
                          ? "bg-cyan/10 text-cyan-dark font-bold"
                          : "text-on-surface-variant hover:bg-surface-container"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => { setActiveCategory(t.catalog.allSolutions); setActiveFinish(t.catalog.allFinishes); }}
                className="w-full mt-8 flex items-center justify-center gap-2 border border-black/10 text-on-surface-variant py-3 rounded-xl text-xs font-bold tracking-wide uppercase hover:bg-surface-container-low transition-colors"
              >
                <RotateCcw size={14} /> {t.catalog.resetFilters}
              </button>
            </motion.div>
          </aside>

          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <p className="text-sm text-on-surface-variant">
                {t.catalog.showing} <span className="font-bold text-on-surface">{filtered.length}</span> {t.catalog.professionalResults}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 md:px-16">
        <div className="max-w-[1280px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-surface-container-high rounded-3xl p-12 md:p-20 border border-black/5 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 end-0 w-[400px] h-[400px] bg-cyan/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 rtl:-translate-x-1/2" />
            <div className="absolute bottom-0 start-0 w-[300px] h-[300px] bg-magenta/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 rtl:translate-x-1/2" />

            <div className="relative z-10 max-w-xl">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface leading-tight mb-6">
                {t.catalog.downloadTitle} <br /><span className="text-cyan">{t.catalog.downloadTitleAccent}</span>
              </h2>
              <p className="text-lg text-on-surface-variant leading-relaxed mb-8">
                {t.catalog.downloadDescription}
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                {t.catalog.tags.map((tag) => (
                  <span key={tag} className="bg-white rounded-full px-5 py-2 text-xs font-bold tracking-wide border border-black/5 shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>
              <button className="bg-gradient-to-r from-magenta to-magenta-dark text-white px-10 py-4 rounded-full text-xs font-bold tracking-[0.15em] uppercase hover:shadow-lg hover:shadow-magenta/20 transition-all flex items-center gap-3 active:scale-95">
                {t.catalog.downloadButton} <Download size={16} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <CTASection
        title={t.catalog.cantFind}
        description={t.catalog.cantFindDescription}
        primaryLabel={t.catalog.consultExperts}
        primaryHref="/contact"
      />
    </>
  );
}
