"use client";

import { motion } from "framer-motion";
import { Printer, Flag, LayoutGrid, Image, Megaphone, Wrench } from "lucide-react";

const CAPABILITIES = [
  { icon: Printer, label: "Printers" },
  { icon: Flag, label: "Large Banners" },
  { icon: LayoutGrid, label: "Event Panels" },
  { icon: Image, label: "Posters" },
  { icon: Megaphone, label: "Marketing" },
  { icon: Wrench, label: "Custom Production" },
];

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function CapabilityStrip() {
  return (
    <section className="py-6 border-y border-black/5 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 md:px-16">
        <div className="flex flex-wrap justify-center lg:justify-between items-center gap-x-10 gap-y-4">
          {CAPABILITIES.map((cap, i) => (
            <motion.div
              key={cap.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06, ease }}
              className="flex items-center gap-3 text-on-surface-variant hover:text-on-surface transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center shrink-0 group-hover:bg-cyan/8 transition-colors">
                <cap.icon size={16} className="text-cyan-dark" />
              </div>
              <span className="text-[10px] font-bold tracking-[0.12em] uppercase">{cap.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
