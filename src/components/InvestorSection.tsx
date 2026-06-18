"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Users, Briefcase, Handshake } from "lucide-react";
import { useLanguage } from "@/i18n";

const PARTNER_ICONS = [Building2, Users, Briefcase, Handshake];

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function InvestorSection() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-on-surface relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-magenta/4 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan/4 rounded-full blur-[160px]" />
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease }}
            >
              <span className="text-cyan text-xs font-bold tracking-[0.2em] uppercase mb-3 block">
                {t.investor.tag}
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight mb-6">
                {t.investor.title}{" "}
                <span className="text-cyan">{t.investor.titleAccent}</span>
              </h2>
              <p className="text-lg text-white/55 leading-relaxed mb-10">
                {t.investor.description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease }}
              className="grid grid-cols-2 gap-4 mb-10"
            >
              {t.investor.partners.map((label, i) => {
                const Icon = PARTNER_ICONS[i];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/8 hover:bg-white/8 transition-colors"
                  >
                    <Icon size={18} className="text-cyan" />
                    <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/80">
                      {label}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4, ease }}
            >
              <Link
                href="/investors"
                className="inline-flex items-center gap-2 bg-magenta text-white px-10 py-4 rounded-full text-xs font-bold tracking-[0.15em] uppercase hover:brightness-110 transition-all shadow-lg shadow-magenta/15 active:scale-95"
              >
                {t.investor.cta} <ArrowRight size={16} className="rtl:rotate-180" />
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/8 bg-white/5 p-1.5 shadow-2xl">
              <Image
                src="/images/pelmeltech/investor-partnership.webp"
                alt="Strategic business partnership at PelmelTech"
                width={600}
                height={400}
                className="w-full h-[300px] sm:h-[380px] object-cover rounded-xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
