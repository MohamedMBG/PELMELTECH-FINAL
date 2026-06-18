"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { PRODUCT_MENU } from "@/lib/constants";

export default function ProductsMegaMenu({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="absolute top-full left-0 right-0 z-50"
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-16 pt-3 pb-4">
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-xl shadow-black/[0.06] overflow-hidden">
          <div className="grid grid-cols-4 divide-x divide-black/[0.05]">
            {/* Product categories */}
            {PRODUCT_MENU.categories.map((category) => (
              <div key={category.title} className="p-6">
                {/* Category image */}
                <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-4 bg-surface-container group/img">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover/img:scale-105"
                    sizes="280px"
                  />
                </div>

                {/* Category title + description */}
                <h3 className="text-[11px] font-bold tracking-[0.1em] uppercase text-on-surface mb-1">
                  {category.title}
                </h3>
                <p className="text-[11px] text-on-surface-variant/60 leading-relaxed mb-4">
                  {category.description}
                </p>

                {/* Item links */}
                <ul className="space-y-0.5">
                  {category.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="group flex items-center gap-2 text-[13px] text-on-surface-variant py-1.5 transition-colors hover:text-magenta"
                      >
                        <span className="w-1 h-1 rounded-full bg-black/10 group-hover:bg-magenta transition-colors shrink-0" />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Featured column */}
            <div className="p-6 bg-surface-container-low/50">
              {/* Featured image */}
              <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-4 bg-surface-container">
                <Image
                  src={PRODUCT_MENU.featured.image}
                  alt="Featured products"
                  fill
                  className="object-cover"
                  sizes="280px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                  <Sparkles size={12} className="text-white" strokeWidth={2.5} />
                  <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-white">
                    {PRODUCT_MENU.featured.title}
                  </span>
                </div>
              </div>

              {/* Featured links */}
              <ul className="space-y-0.5 mb-6">
                {PRODUCT_MENU.featured.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`group flex items-center gap-2 text-[13px] py-1.5 transition-colors ${
                        item.accent
                          ? "text-magenta font-semibold hover:text-magenta-dark"
                          : "text-on-surface-variant hover:text-magenta"
                      }`}
                    >
                      <span
                        className={`w-1 h-1 rounded-full shrink-0 transition-colors ${
                          item.accent
                            ? "bg-magenta group-hover:bg-magenta-dark"
                            : "bg-black/10 group-hover:bg-magenta"
                        }`}
                      />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={PRODUCT_MENU.featured.cta.href}
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full bg-on-surface text-white px-5 py-3 rounded-xl text-[10px] font-bold tracking-[0.12em] uppercase hover:bg-magenta transition-all duration-200 shadow-sm"
              >
                {PRODUCT_MENU.featured.cta.label}
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
