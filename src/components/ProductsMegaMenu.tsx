"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

type MegaMenuItem = {
  label: string;
  description: string;
  image: string;
  href: string;
};

type MegaMenuGroup = {
  title: string;
  items: MegaMenuItem[];
};

const GROUPS: MegaMenuGroup[] = [
  {
    title: "Printing Machines",
    items: [
      {
        label: "Standard Printers",
        description:
          "Reliable printers for everyday business and office needs.",
        image: "/images/pelmeltech/product-large-format-printer.webp",
        href: "/catalog?category=standard-printers",
      },
      {
        label: "Large-Format Printers",
        description:
          "High-performance machines for banners, posters, and signage.",
        image: "/images/pelmeltech/service-large-format.webp",
        href: "/catalog?category=large-format-printers",
      },
      {
        label: "Event Printers",
        description:
          "Printing solutions for events, stands, campaigns, and activations.",
        image: "/images/pelmeltech/service-event-printing.webp",
        href: "/catalog?category=event-printers",
      },
      {
        label: "Industrial Printers",
        description:
          "Professional machines for high-volume production workflows.",
        image: "/images/pelmeltech/catalog-hero.webp",
        href: "/catalog?category=industrial-printers",
      },
      {
        label: "Plotters",
        description:
          "Precision printing for plans, drawings, and technical layouts.",
        image: "/images/pelmeltech/product-vinyl-roll.webp",
        href: "/catalog?category=plotters",
      },
    ],
  },
  {
    title: "Printing Materials",
    items: [
      {
        label: "Banners & Mesh",
        description:
          "Durable banner solutions for indoor and outdoor visibility.",
        image: "/images/pelmeltech/service-banner-printing.webp",
        href: "/catalog?category=banners-and-mesh",
      },
      {
        label: "Rigid Panels",
        description:
          "Rigid panels for signage, displays, and professional branding.",
        image: "/images/pelmeltech/service-panel-printing.webp",
        href: "/catalog?category=rigid-panels",
      },
      {
        label: "Soft Signage",
        description:
          "High-quality fabric displays for backdrops and lightboxes.",
        image: "/images/pelmeltech/product-event-backdrop.webp",
        href: "/catalog?category=soft-signage",
      },
      {
        label: "Vinyl & Wraps",
        description:
          "Flexible materials for branding, decoration, and signage.",
        image: "/images/pelmeltech/product-vinyl-roll.webp",
        href: "/catalog?category=vinyl-and-wraps",
      },
      {
        label: "Exhibition Displays",
        description:
          "Portable display solutions for events and presentations.",
        image: "/images/pelmeltech/product-rollup-banner.webp",
        href: "/catalog?category=exhibition",
      },
    ],
  },
  {
    title: "Consumables",
    items: [
      {
        label: "Ink & Toner",
        description:
          "Essential ink and toner for professional printing equipment.",
        image: "/images/pelmeltech/services-print-materials.webp",
        href: "/catalog?category=ink-and-toner",
      },
      {
        label: "Paper & Rolls",
        description:
          "Media rolls for large-format and production printing.",
        image: "/images/pelmeltech/product-poster-set.webp",
        href: "/catalog?category=paper-and-rolls",
      },
      {
        label: "Printer Parts",
        description:
          "Replacement parts for maintenance and equipment support.",
        image: "/images/pelmeltech/services-print-materials.webp",
        href: "/catalog?category=printer-parts",
      },
      {
        label: "Maintenance Tools",
        description:
          "Tools and kits to keep equipment running smoothly.",
        image: "/images/pelmeltech/services-print-materials.webp",
        href: "/catalog?category=maintenance-tools",
      },
    ],
  },
];

const FEATURED_LINKS = [
  { label: "Best Sellers", href: "/catalog?filter=bestsellers" },
  { label: "New Arrivals", href: "/catalog?filter=new" },
  { label: "Full Catalog", href: "/catalog" },
  { label: "Request a Quote", href: "/contact" },
];

const DEFAULT_ITEM = GROUPS[0].items[1]; // Large-Format Printers

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ProductsMegaMenu({ onClose }: { onClose: () => void }) {
  const [active, setActive] = useState<MegaMenuItem>(DEFAULT_ITEM);

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
          {/* Main content: categories + preview */}
          <div className="grid grid-cols-12">
            {/* Category columns */}
            <div className="col-span-7 grid grid-cols-3 gap-0 divide-x divide-black/[0.04] py-6">
              {GROUPS.map((group) => (
                <div key={group.title} className="px-6">
                  <h3 className="text-[10px] font-bold tracking-[0.14em] uppercase text-on-surface-variant/50 mb-3">
                    {group.title}
                  </h3>
                  <ul className="space-y-0.5" role="group" aria-label={group.title}>
                    {group.items.map((item) => {
                      const isActive = active.label === item.label;
                      return (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            onClick={onClose}
                            onMouseEnter={() => setActive(item)}
                            onFocus={() => setActive(item)}
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

            {/* Preview panel */}
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
              <p className="text-sm font-bold text-on-surface mb-1.5">
                {active.label}
              </p>
              <p className="text-[13px] text-on-surface-variant leading-relaxed mb-5 flex-1">
                {active.description}
              </p>
              <Link
                href={active.href}
                onClick={onClose}
                className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.08em] uppercase text-magenta hover:text-magenta-dark transition-colors"
              >
                Explore {active.label}
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Featured strip */}
          <div className="border-t border-black/[0.05] px-6 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-6">
              {FEATURED_LINKS.map((link, i) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={onClose}
                  className={`text-[11px] font-semibold tracking-wide transition-colors ${
                    i === 0
                      ? "text-magenta hover:text-magenta-dark"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <Link
              href="/catalog"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 bg-on-surface text-white px-5 py-2 rounded-lg text-[10px] font-bold tracking-[0.1em] uppercase hover:bg-magenta transition-colors"
            >
              View Full Catalog
              <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Mobile accordion (used by Navbar)
// ---------------------------------------------------------------------------

export function MobileProductsAccordion({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="space-y-5 pb-2">
      {GROUPS.map((group) => (
        <div key={group.title}>
          <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-on-surface-variant/50 mb-2 pl-1">
            {group.title}
          </p>
          <div className="space-y-0.5">
            {group.items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
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

      {/* Featured + CTA */}
      <div className="border-t border-black/[0.06] pt-4 space-y-1">
        {FEATURED_LINKS.map((link, i) => (
          <Link
            key={link.label}
            href={link.href}
            onClick={onNavigate}
            className={`block py-2 px-1 text-sm transition-colors ${
              i === 0
                ? "text-magenta font-semibold"
                : "text-on-surface-variant hover:text-magenta"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <Link
        href="/catalog"
        onClick={onNavigate}
        className="flex items-center justify-center gap-2 bg-on-surface text-white px-5 py-3 rounded-xl text-[10px] font-bold tracking-[0.12em] uppercase hover:bg-magenta transition-all"
      >
        View Full Catalog
        <ArrowRight size={12} />
      </Link>
    </div>
  );
}
