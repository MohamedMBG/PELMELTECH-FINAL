"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getProductPath } from "@/lib/products";

interface ProductCardProps {
  name: string;
  category: string;
  description: string;
  price: string;
  badge: string | null;
  badgeColor: "magenta" | "cyan" | null;
  index: number;
  image: string;
}

export default function ProductCard({ name, category, description, price, badge, badgeColor, index, image }: ProductCardProps) {
  const productPath = getProductPath({ name });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className={`bg-white p-4 rounded-3xl border border-black/5 shadow-sm transition-all duration-500 group ${
        badgeColor === "cyan" ? "hover:shadow-lg hover:shadow-cyan/8" : "hover:shadow-lg hover:shadow-magenta/8"
      }`}
    >
      <div className="h-52 rounded-2xl bg-surface-container-low relative overflow-hidden flex items-center justify-center border border-black/5">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        {badge && (
          <span className={`absolute top-3 left-3 text-[10px] font-bold tracking-widest uppercase text-white px-3 py-1 rounded-full shadow-md z-10 ${
            badgeColor === "cyan" ? "bg-cyan" : "bg-magenta"
          }`}>
            {badge}
          </span>
        )}
      </div>

      <div className="p-4">
        <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-on-surface-variant/60 mb-1 block">
          {category}
        </span>
        <h4 className="text-lg font-bold text-on-surface mb-2 group-hover:text-magenta transition-colors">
          {name}
        </h4>
        <p className="text-sm text-on-surface-variant leading-relaxed mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between pt-4 border-t border-black/5">
          <span className="text-magenta font-extrabold text-lg">{price}</span>
          <Link href={productPath} className="flex items-center gap-1 text-xs font-bold tracking-wide text-on-surface-variant hover:text-magenta transition-colors">
            Details <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
