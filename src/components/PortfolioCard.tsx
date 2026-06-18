"use client";

import { motion } from "framer-motion";

interface PortfolioCardProps {
  title: string;
  category: string;
  description: string;
  featured?: boolean;
  index: number;
  image: string;
}

export default function PortfolioCard({ title, category, description, featured = false, index, image }: PortfolioCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden rounded-3xl group cursor-pointer border border-black/5 shadow-sm hover:shadow-xl ${
        featured ? "md:col-span-2 md:row-span-2 h-[400px] md:h-full" : "h-[280px]"
      }`}
    >
      <img
        src={image}
        alt={title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />

      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
        <div className={`pl-4 ${featured ? "border-l-4 border-magenta" : "border-l-4 border-cyan"}`}>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/70 mb-1 block">
            {category}
          </span>
          <h3 className={`text-white font-bold mb-2 group-hover:text-cyan transition-colors duration-300 ${featured ? "text-2xl md:text-3xl" : "text-lg"}`}>
            {title}
          </h3>
          {featured && (
            <p className="text-white/80 text-sm max-w-md leading-relaxed">{description}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
