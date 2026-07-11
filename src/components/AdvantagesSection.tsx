"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useLanguage } from "@/i18n";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function AdvantagesSection() {
  const { t } = useLanguage();

  return (
    <section className="section-y bg-on-surface relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-magenta/4 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan/4 rounded-full blur-[160px]" />
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="max-w-2xl mb-12"
        >
          <span className="text-cyan text-xs font-bold tracking-[0.2em] uppercase mb-3 block">
            {t.advantages.tag}
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight mb-6">
            {t.advantages.title}{" "}
            <span className="text-cyan">{t.advantages.titleAccent}</span>
          </h2>
          <p className="text-lg text-white/55 leading-relaxed">
            {t.advantages.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {t.advantages.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease }}
              className="flex items-start gap-4"
            >
              <span className="mt-1 flex-shrink-0 w-7 h-7 rounded-full bg-cyan/15 flex items-center justify-center">
                <Check size={14} className="text-cyan" />
              </span>
              <div>
                <h3 className="text-white font-bold mb-1">{item.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
