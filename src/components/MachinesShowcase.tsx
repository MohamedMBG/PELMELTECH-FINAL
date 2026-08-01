"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProducts, getProductPath, type CatalogProduct } from "@/lib/catalog";
import { useLanguage } from "@/i18n";
import { localizeProduct } from "@/lib/localized-catalog";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

function MachineCard({ product, discover }: { product: CatalogProduct; discover: string }) {
  const { locale, t } = useLanguage();
  const displayProduct = localizeProduct(product, locale);
  const ref = useRef<HTMLAnchorElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ rx: -py * 8, ry: px * 8 });
  }

  return (
    <Link
      ref={ref}
      href={getProductPath(product)}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ rx: 0, ry: 0 })}
      style={{ transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` }}
      className="group relative w-[280px] sm:w-[320px] shrink-0 rounded-3xl bg-white border border-black/5 shadow-sm hover:shadow-2xl hover:shadow-magenta/10 transition-shadow duration-500 overflow-hidden [transition:transform_.15s_ease-out]"
    >
      <div className="relative h-52 bg-gradient-to-b from-surface-container-high to-white flex items-center justify-center overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={t.productDetail.productImageAlt.replace("{name}", displayProduct.name)}
          fill
          className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
          sizes="320px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-magenta/0 via-magenta/0 to-cyan/0 group-hover:from-magenta/5 group-hover:to-cyan/5 transition-colors duration-500" />
        {product.badge && (
          <span
            className={`absolute top-3 start-3 text-[10px] font-bold tracking-widest uppercase text-white px-3 py-1 rounded-full shadow-md ${
              product.badgeColor === "cyan" ? "bg-cyan" : "bg-magenta"
            }`}
          >
            {product.badge}
          </span>
        )}
      </div>
      <div className="p-5">
        <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-cyan-dark mb-1.5 block">
          {displayProduct.subcategory}
        </span>
        <h3 className="text-base font-bold text-on-surface leading-snug mb-4 line-clamp-2 group-hover:text-magenta transition-colors">
          {displayProduct.name}
        </h3>
        <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wide text-on-surface-variant group-hover:text-magenta transition-colors">
          {discover}
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform rtl:rotate-180" />
        </span>
      </div>
    </Link>
  );
}

export default function MachinesShowcase() {
  const { t } = useLanguage();
  const [machines, setMachines] = useState<CatalogProduct[]>([]);

  useEffect(() => {
    let active = true;
    getProducts()
      .then((all) => {
        if (!active) return;
        const pool = all.filter((p) => p.type === "machine");
        const src = pool.length >= 4 ? pool : all;
        setMachines(src.sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, 10));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  if (machines.length === 0) return null;

  // Duplicate for seamless infinite marquee
  const row = [...machines, ...machines];

  return (
    <section className="section-y relative overflow-hidden bg-gradient-to-b from-surface-container to-background">
      {/* ambient glows */}
      <div className="pointer-events-none absolute -top-24 -start-24 w-96 h-96 rounded-full bg-magenta/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -end-24 w-96 h-96 rounded-full bg-cyan/10 blur-3xl" />

      <div className="relative max-w-[1280px] mx-auto px-4 md:px-16 mb-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            className="max-w-xl"
          >
            <span className="text-cyan-dark text-xs font-bold tracking-[0.2em] uppercase mb-3 block">
              {t.machines.tag}
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-on-surface leading-tight mb-4">
              {t.machines.title} <span className="text-magenta">{t.machines.titleAccent}</span>
            </h2>
            <p className="text-base md:text-lg text-on-surface-variant leading-relaxed">
              {t.machines.description}
            </p>
          </motion.div>

          <Link
            href="/catalog"
            className="inline-flex shrink-0 items-center gap-2 bg-on-surface text-white px-7 py-3.5 rounded-full text-xs font-bold tracking-[0.15em] uppercase hover:bg-magenta transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
          >
            {t.machines.viewAll} <ArrowRight size={16} className="rtl:rotate-180" />
          </Link>
        </div>
      </div>

      {/* infinite marquee */}
      <div className="relative group/marquee">
        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 start-0 w-16 md:w-32 z-10 bg-gradient-to-r from-surface-container to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 end-0 w-16 md:w-32 z-10 bg-gradient-to-l from-background to-transparent" />

        <div className="flex gap-6 w-max px-4 animate-marquee group-hover/marquee:[animation-play-state:paused]">
          {row.map((product, i) => (
            <MachineCard key={`${product.id}-${i}`} product={product} discover={t.machines.discover} />
          ))}
        </div>
      </div>
    </section>
  );
}
