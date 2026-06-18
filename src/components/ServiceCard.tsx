"use client";

import { motion } from "framer-motion";
import {
  Ruler, PartyPopper, Flag, LayoutGrid, Image, Megaphone, Settings,
} from "lucide-react";

const ICON_MAP = {
  Ruler, PartyPopper, Flag, LayoutGrid, Image, Megaphone, Settings,
} as const;

interface ServiceCardProps {
  title: string;
  description: string;
  features: readonly string[];
  icon: keyof typeof ICON_MAP;
  accent: "cyan" | "magenta";
  index: number;
  image: string;
}

export default function ServiceCard({ title, description, features, icon, accent, index, image }: ServiceCardProps) {
  const Icon = ICON_MAP[icon];
  const isCyan = accent === "cyan";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className={`bg-white rounded-3xl overflow-hidden border border-black/5 shadow-sm transition-all duration-500 hover:shadow-xl group ${
        isCyan ? "hover:shadow-cyan/10 border-t-4 border-t-cyan" : "hover:shadow-magenta/10 border-t-4 border-t-magenta"
      }`}
    >
      {/* Premium Image Header */}
      <div className="h-48 w-full overflow-hidden relative border-b border-black/5 bg-surface-container-low">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className={`absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:rotate-12 ${
          isCyan
            ? "bg-cyan text-white"
            : "bg-magenta text-white"
        }`}>
          <Icon size={20} />
        </div>
      </div>

      <div className="p-8">
        <h3 className="text-xl font-bold text-on-surface mb-3">{title}</h3>
        <p className="text-sm text-on-surface-variant leading-relaxed mb-6">{description}</p>

        <ul className="space-y-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-xs text-on-surface-variant">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isCyan ? "bg-cyan" : "bg-magenta"}`} />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
