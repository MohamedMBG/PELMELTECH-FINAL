"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n";

const GROUP_IMAGES = [
  [
    "/images/pelmeltech/product-large-format-printer.webp",
    "/images/pelmeltech/service-large-format.webp",
    "/images/pelmeltech/service-event-printing.webp",
    "/images/pelmeltech/catalog-hero.webp",
    "/images/pelmeltech/product-vinyl-roll.webp",
  ],
  [
    "/images/pelmeltech/service-banner-printing.webp",
    "/images/pelmeltech/service-panel-printing.webp",
    "/images/pelmeltech/product-event-backdrop.webp",
    "/images/pelmeltech/product-vinyl-roll.webp",
    "/images/pelmeltech/product-rollup-banner.webp",
  ],
  [
    "/images/pelmeltech/services-print-materials.webp",
    "/images/pelmeltech/product-poster-set.webp",
    "/images/pelmeltech/services-print-materials.webp",
    "/images/pelmeltech/services-print-materials.webp",
  ],
];

const GROUP_HREFS = [
  [
    "/catalog?category=standard-printers",
    "/catalog?category=large-format-printers",
    "/catalog?category=event-printers",
    "/catalog?category=industrial-printers",
    "/catalog?category=plotters",
  ],
  [
    "/catalog?category=banners-and-mesh",
    "/catalog?category=rigid-panels",
    "/catalog?category=soft-signage",
    "/catalog?category=vinyl-and-wraps",
    "/catalog?category=exhibition",
  ],
  [
    "/catalog?category=ink-and-toner",
    "/catalog?category=paper-and-rolls",
    "/catalog?category=printer-parts",
    "/catalog?category=maintenance-tools",
  ],
];

const FEATURED_HREFS = [
  "/catalog?filter=bestsellers",
  "/catalog?filter=new",
  "/catalog",
  "/contact",
];

type ActiveItem = { label: string; description: string; image: string; href: string };

export default function ProductsMegaMenu({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();

  const defaultItem: ActiveItem = {
    label: t.megaMenu.groups[0].items[1].label,
    description: t.megaMenu.groups[0].items[1].description,
    image: GROUP_IMAGES[0][1],
    href: GROUP_HREFS[0][1],
  };

  const [active, setActive] = useState<ActiveItem>(defaultItem);

  const featuredLabels = [
    t.megaMenu.bestSellers,
    t.megaMenu.newArrivals,
    t.megaMenu.fullCatalog,
    t.megaMenu.requestQuote,
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className="absolute top-full left-0 right-0 z-50"
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-16 pt-2 pb-4">
        <div
          className="bg-white rounded-2xl border border-black/[0.06] shadow-xl shadow-black/[0.05] overflow-hidden"
          role="menu"
        >
          <div className="grid grid-cols-12">
            <div className="col-span-7 grid grid-cols-3 gap-0 divide-x divide-black/[0.04] py-6 rtl:divide-x-reverse">
              {t.megaMenu.groups.map((group, gi) => (
                <div key={gi} className="px-6">
                  <h3 className="text-[10px] font-bold tracking-[0.14em] uppercase text-on-surface-variant/50 mb-3">
                    {group.title}
                  </h3>
                  <ul className="space-y-0.5" role="group" aria-label={group.title}>
                    {group.items.map((item, ii) => {
                      const isActive = active.label === item.label;
                      const image = GROUP_IMAGES[gi]?.[ii] || GROUP_IMAGES[0][0];
                      const href = GROUP_HREFS[gi]?.[ii] || "/catalog";
                      return (
                        <li key={ii}>
                          <Link
                            href={href}
                            onClick={onClose}
                            onMouseEnter={() => setActive({ label: item.label, description: item.description, image, href })}
                            onFocus={() => setActive({ label: item.label, description: item.description, image, href })}
                            role="menuitem"
                            className={`group/item flex items-center gap-2.5 py-2 px-2.5 -mx-2.5 rounded-lg text-[13px] transition-all duration-150 ${
                              isActive
                                ? "bg-magenta/[0.06] text-magenta font-semibold"
                                : "text-on-surface-variant hover:text-on-surface hover:bg-black/[0.02]"
                            }`}
                          >
                            <span
                              className={`w-1 h-1 rounded-full shrink-0 transition-all duration-150 ${
                                isActive
                                  ? "bg-magenta scale-125"
                                  : "bg-black/[0.12] group-hover/item:bg-black/[0.25]"
                              }`}
                            />
                            {item.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            <div className="col-span-5 bg-surface-container-low/60 p-6 flex flex-col">
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-surface-container mb-5">
                <Image
                  key={active.image}
                  src={active.image}
                  alt={active.label}
                  fill
                  sizes="460px"
                  className="object-cover transition-opacity duration-300"
                  priority
                />
              </div>
              <p className="text-sm font-bold text-on-surface mb-1.5">{active.label}</p>
              <p className="text-[13px] text-on-surface-variant leading-relaxed mb-5 flex-1">{active.description}</p>
              <Link
                href={active.href}
                onClick={onClose}
                className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.08em] uppercase text-magenta hover:text-magenta-dark transition-colors"
              >
                {t.megaMenu.explore} {active.label}
                <ArrowRight size={13} className="rtl:rotate-180" />
              </Link>
            </div>
          </div>

          <div className="border-t border-black/[0.05] px-6 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-6">
              {featuredLabels.map((label, i) => (
                <Link
                  key={i}
                  href={FEATURED_HREFS[i]}
                  onClick={onClose}
                  className={`text-[11px] font-semibold tracking-wide transition-colors ${
                    i === 0
                      ? "text-magenta hover:text-magenta-dark"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
            <Link
              href="/catalog"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 bg-on-surface text-white px-5 py-2 rounded-lg text-[10px] font-bold tracking-[0.1em] uppercase hover:bg-magenta transition-colors"
            >
              {t.megaMenu.viewFullCatalog}
              <ArrowRight size={11} className="rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function MobileProductsAccordion({ onNavigate }: { onNavigate: () => void }) {
  const { t } = useLanguage();

  const featuredLabels = [
    t.megaMenu.bestSellers,
    t.megaMenu.newArrivals,
    t.megaMenu.fullCatalog,
    t.megaMenu.requestQuote,
  ];

  return (
    <div className="space-y-5 pb-2">
      {t.megaMenu.groups.map((group, gi) => (
        <div key={gi}>
          <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-on-surface-variant/50 mb-2 ps-1">
            {group.title}
          </p>
          <div className="space-y-0.5">
            {group.items.map((item, ii) => (
              <Link
                key={ii}
                href={GROUP_HREFS[gi]?.[ii] || "/catalog"}
                onClick={onNavigate}
                className="flex items-center gap-3 py-2.5 px-1 text-sm text-on-surface-variant hover:text-magenta transition-colors"
              >
                <span className="w-1 h-1 rounded-full bg-black/10 shrink-0" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ))}

      <div className="border-t border-black/[0.06] pt-4 space-y-1">
        {featuredLabels.map((label, i) => (
          <Link
            key={i}
            href={FEATURED_HREFS[i]}
            onClick={onNavigate}
            className={`block py-2 px-1 text-sm transition-colors ${
              i === 0
                ? "text-magenta font-semibold"
                : "text-on-surface-variant hover:text-magenta"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      <Link
        href="/catalog"
        onClick={onNavigate}
        className="flex items-center justify-center gap-2 bg-on-surface text-white px-5 py-3 rounded-xl text-[10px] font-bold tracking-[0.12em] uppercase hover:bg-magenta transition-all"
      >
        {t.megaMenu.viewFullCatalog}
        <ArrowRight size={12} className="rtl:rotate-180" />
      </Link>
    </div>
  );
}
