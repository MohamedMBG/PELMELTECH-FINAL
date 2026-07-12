"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  RotateCcw, 
  Download,
  Shirt, 
  Box, 
  Image as ImageIcon, 
  Sparkles, 
  Scissors, 
  Tag, 
  Flame, 
  Layers,
  Printer,
  Grid,
  Search,
  SlidersHorizontal
} from "lucide-react";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import CTASection from "@/components/CTASection";
import { getProducts, getCategories, type CatalogProduct, type CatalogCategory } from "@/lib/catalog";
import { useLanguage } from "@/i18n";
import { localizeCategory, localizeProduct, localizeSubcategory } from "@/lib/localized-catalog";

const IconMap = {
  Shirt,
  Box,
  Image: ImageIcon,
  Sparkles,
  Scissors,
  Tag,
  Flame,
  Layers,
  Printer,
  SquareScissors: Scissors
};

function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = IconMap[name as keyof typeof IconMap] || Grid;
  return <IconComponent className={className} />;
}

export default function CatalogPage() {
  const [allProducts, setAllProducts] = useState<CatalogProduct[]>([]);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [activeSubcategory, setActiveSubcategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { locale, t } = useLanguage();

  useEffect(() => {
    let active = true;
    Promise.all([getProducts(), getCategories()])
      .then(([products, cats]) => {
        if (!active) return;
        setAllProducts(products);
        setCategories(cats);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const getProductCount = (categoryId: string) => {
    return allProducts.filter(p => p.categoryId === categoryId).length;
  };

  const activeCategoryObj = categories.find(c => c.id === activeCategory);
  const displayActiveCategory = activeCategoryObj ? localizeCategory(activeCategoryObj, locale) : null;

  // Available subcategories for the active category
  const availableSubcategories = activeCategory
    ? Array.from(new Set(allProducts.filter(p => p.categoryId === activeCategory).map(p => p.subcategory)))
    : [];

  const filtered = allProducts.filter((p) => {
    const displayProduct = localizeProduct(p, locale);
    const matchesCategory = !activeCategory || p.categoryId === activeCategory;
    const matchesSubcategory = !activeSubcategory || p.subcategory === activeSubcategory;
    const matchesSearch = searchQuery.trim() === "" ||
      displayProduct.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      displayProduct.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      displayProduct.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.specifications && Object.values(p.specifications).some((val) => 
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      ));
    return matchesCategory && matchesSubcategory && matchesSearch;
  });

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
    setActiveSubcategory("");
  };

  const newArrivals = allProducts.filter((p) => p.newArrival).slice(0, 6);

  return (
    <>
      {/* Premium Hero Banner */}
      <section className="bg-surface-container-low py-14 sm:py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 end-0 w-1/3 h-full bg-gradient-to-l from-magenta/5 to-transparent rtl:bg-gradient-to-r" />
          <div className="absolute bottom-0 end-[10%] w-[300px] h-[300px] bg-cyan/5 rounded-full blur-[100px]" />
        </div>

        <div className="px-4 md:px-16 max-w-[1280px] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-7">
              <span className="text-magenta text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
                {t.catalog.heroTag}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-on-surface leading-[1.1] mb-6 max-w-2xl">
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

      {/* New Arrivals Section */}
      {newArrivals.length > 0 && (
        <section className="py-12 px-4 md:px-16 bg-white border-b border-black/[0.03]">
          <div className="max-w-[1280px] mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
              <div>
                <span className="text-cyan-dark text-xs font-bold tracking-[0.2em] uppercase mb-2 block">
                  {t.catalog.newArrivalsEyebrow}
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface">
                  {t.megaMenu.newArrivals}
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
              {newArrivals.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Catalog View */}
      <section className="py-10 sm:py-12 lg:py-16 px-4 md:px-16 bg-slate-50/50">
        <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Desktop Left Sidebar: Premium Category Cards */}
          <aside className="hidden lg:block w-full lg:w-80 shrink-0 space-y-8 lg:sticky lg:top-28 h-fit">
            <div className="bg-white p-6 rounded-3xl border border-black/[0.04] shadow-md shadow-slate-100/50">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/[0.03]">
                <h3 className="text-lg font-extrabold text-on-surface flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-magenta" />
                  {t.catalog.categories}
                </h3>
                {activeCategory && (
                  <button
                    onClick={() => { setActiveCategory(""); setActiveSubcategory(""); }}
                    className="text-xs font-bold text-magenta hover:underline"
                  >
                    {t.catalog.reset}
                  </button>
                )}
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={() => handleCategorySelect("")}
                  className={`w-full flex items-center justify-between text-start text-sm py-3 px-4 rounded-2xl transition-all duration-300 font-bold ${
                    activeCategory === ""
                      ? "bg-gradient-to-r from-magenta to-magenta-dark text-white shadow-lg shadow-magenta/15"
                      : "text-on-surface-variant hover:bg-slate-50 hover:text-on-surface"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Grid size={18} />
                    <span>{t.catalog.allSolutions}</span>
                  </div>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full ${activeCategory === "" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                    {allProducts.length}
                  </span>
                </button>

                {categories.map((cat) => {
                  const count = getProductCount(cat.id);
                  if (count === 0) return null;
                  const isActive = activeCategory === cat.id;
                  const displayCategory = localizeCategory(cat, locale);
                  
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`w-full flex items-center justify-between text-start text-sm py-3 px-4 rounded-2xl transition-all duration-300 ${
                        isActive
                          ? "bg-magenta/10 text-magenta font-extrabold border border-magenta/20"
                          : "text-on-surface-variant hover:bg-slate-50 hover:text-on-surface border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CategoryIcon name={cat.icon || ""} className={`transition-transform duration-300 ${isActive ? "scale-110" : ""}`} />
                        <span>{displayCategory.name}</span>
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full transition-all duration-300 ${
                        isActive ? "bg-magenta text-white" : "bg-slate-100 text-slate-500"
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Right Product Grid Column */}
          <div className="flex-grow">
            
            {/* Mobile Category Selector: Horizontal Scrollable Premium Chips */}
            <div className="lg:hidden -mx-4 px-4 mb-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex gap-2.5 w-max py-1">
                <button
                  onClick={() => handleCategorySelect("")}
                  className={`shrink-0 flex items-center gap-2 text-xs font-bold tracking-wide px-5 py-3 rounded-2xl border transition-all active:scale-95 shadow-sm ${
                    activeCategory === ""
                      ? "bg-magenta text-white border-magenta shadow-magenta/10"
                      : "bg-white text-on-surface-variant border-black/[0.04]"
                  }`}
                >
                  <Grid size={14} />
                  {t.catalog.allSolutions}
                </button>
                {categories.map((cat) => {
                  const count = getProductCount(cat.id);
                  if (count === 0) return null;
                  const isActive = activeCategory === cat.id;
                  const displayCategory = localizeCategory(cat, locale);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`shrink-0 flex items-center gap-2 text-xs font-bold tracking-wide px-5 py-3 rounded-2xl border transition-all active:scale-95 shadow-sm ${
                        isActive
                          ? "bg-magenta text-white border-magenta shadow-magenta/10"
                          : "bg-white text-on-surface-variant border-black/[0.04]"
                      }`}
                    >
                      <CategoryIcon name={cat.icon || ""} />
                      {displayCategory.name}
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Premium Search & Information Bar */}
            <div className="bg-white rounded-3xl p-5 border border-black/[0.04] shadow-sm mb-6 lg:mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2.5 self-start md:self-auto">
                <div className="p-2 rounded-xl bg-cyan/10 text-cyan-dark">
                  <Grid size={18} />
                </div>
                <div>
                  <h4 className="font-extrabold text-on-surface text-base">
                    {displayActiveCategory ? displayActiveCategory.name : t.catalog.allSolutions}
                  </h4>
                  <p className="text-xs text-on-surface-variant/70">
                    {t.catalog.showing} <span className="font-bold text-on-surface">{filtered.length}</span> {t.catalog.professionalResults}
                  </p>
                </div>
              </div>
              
              <div className="w-full md:w-80 relative">
                <input
                  type="text"
                  placeholder={t.catalog.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 text-sm rounded-2xl border border-black/[0.06] focus:border-magenta focus:ring-1 focus:ring-magenta focus:outline-none transition-all shadow-inner bg-slate-50/50"
                />
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/40" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-magenta text-xs font-bold"
                  >
                    {t.catalog.clearSearch}
                  </button>
                )}
              </div>
            </div>

            {/* Dynamic Subcategory Filter Pills (rendered only when category is active) */}
            {activeCategory && availableSubcategories.length > 1 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-2 mb-6"
              >
                <button
                  onClick={() => setActiveSubcategory("")}
                  className={`text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm ${
                    activeSubcategory === ""
                      ? "bg-cyan text-white shadow-cyan/10"
                      : "bg-white text-on-surface-variant border border-black/[0.03] hover:bg-slate-50"
                  }`}
                >
                  {t.catalog.all}
                </button>
                {availableSubcategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setActiveSubcategory(sub)}
                    className={`text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm ${
                      activeSubcategory === sub
                        ? "bg-cyan text-white shadow-cyan/10"
                        : "bg-white text-on-surface-variant border border-black/[0.03] hover:bg-slate-50"
                    }`}
                  >
                    {localizeSubcategory(sub, locale)}
                  </button>
                ))}
              </motion.div>
            )}

            {/* Products Grid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-black/[0.03] shadow-sm">
                <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                  <Grid size={24} />
                </div>
                <h3 className="text-lg font-bold text-on-surface mb-2">{t.catalog.noProductsFound}</h3>
                <p className="text-sm text-on-surface-variant max-w-sm mx-auto leading-relaxed">
                  {t.catalog.noProductsDescription}
                </p>
                <button 
                  onClick={() => { setActiveCategory(""); setActiveSubcategory(""); setSearchQuery(""); }}
                  className="mt-6 inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase bg-magenta text-white px-6 py-3 rounded-full hover:shadow-lg hover:shadow-magenta/20 transition-all"
                >
                  <RotateCcw size={14} /> {t.catalog.resetFilters}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Catalog Technical Fiche Callout */}
      <section className="section-y px-4 md:px-16 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-surface-container-high rounded-3xl p-8 sm:p-12 md:p-20 border border-black/5 shadow-xl relative overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: "url('/images/pelmeltech/catalog-callout.png')" }}
          >
            {/* left scrim keeps text readable over the product image */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent rtl:bg-gradient-to-l" />

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
