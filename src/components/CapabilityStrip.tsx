"use client";

import { motion } from "framer-motion";
import { Printer, Flag, LayoutGrid, Image, Megaphone, Wrench } from "lucide-react";
import { useLanguage } from "@/i18n";

const ICONS = [Printer, Flag, LayoutGrid, Image, Megaphone, Wrench];

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function CapabilityStrip() {
  const { t } = useLanguage();

  return (
    <section className="py-6 border-y border-black/5 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 md:px-16">
        <div className="flex flex-wrap justify-center lg:justify-between items-center gap-x-6 sm:gap-x-10 gap-y-4">
          {t.capabilities.map((label, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06, ease }}
                className="flex items-center gap-3 text-on-surface-variant hover:text-on-surface transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center shrink-0 group-hover:bg-cyan/8 transition-colors">
                  <Icon size={16} className="text-cyan-dark" />
                </div>
                <span className="text-[10px] font-bold tracking-[0.12em] uppercase">{label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
