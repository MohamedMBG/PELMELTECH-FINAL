"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { Shield, Zap, Target, Award, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { useLanguage } from "@/i18n";

const ICONS: LucideIcon[] = [Target, Zap, Shield, Award];

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

function ReasonCard({
  reason,
  index,
  icon: Icon,
}: {
  reason: { title: string; desc: string };
  index: number;
  icon: LucideIcon;
}) {
  const delay = 0.15 + index * 0.12;

  return (
    <motion.div
      initial={{ opacity: 0, y: 42, rotateX: 8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease }}
      className="group relative h-full [perspective:1000px]"
    >
      <div className="relative h-full min-h-[210px] overflow-hidden rounded-[1.35rem] border border-magenta/10 bg-white p-4 shadow-[0_18px_60px_-44px_rgba(26,26,43,0.7)] transition-all duration-500 hover:-translate-y-1 hover:border-magenta/30 hover:shadow-[0_28px_80px_-36px_rgba(226,0,116,0.45)] sm:min-h-[240px] sm:p-6">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-magenta via-cyan to-magenta opacity-80" />
        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full border border-magenta/10 bg-[linear-gradient(135deg,rgba(226,0,116,0.10),rgba(0,171,236,0.06))]" />
        <div className="absolute bottom-0 left-0 h-16 w-full bg-[linear-gradient(180deg,transparent,rgba(226,0,116,0.035))]" />

        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: delay + 0.1, scale: { type: "spring", damping: 14, stiffness: 200, delay: delay + 0.1 } }}
          className="relative mb-5 h-11 w-11"
        >
          <div className="absolute -inset-2 rounded-2xl bg-magenta/[0.08] opacity-0 blur-xl transition-all duration-700 group-hover:opacity-100" />
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-on-surface text-white shadow-[0_14px_32px_-18px_rgba(26,26,43,0.9)] transition-colors duration-500 group-hover:bg-magenta">
            <Icon size={20} strokeWidth={1.8} />
          </div>
        </motion.div>

        <motion.h3
          className="relative mb-2 text-[14px] font-extrabold leading-tight text-on-surface transition-colors duration-300 group-hover:text-magenta-dark sm:text-lg"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: delay + 0.15, ease }}
        >
          {reason.title}
        </motion.h3>

        <div className="mb-3 h-px w-10 bg-gradient-to-r from-magenta/55 to-cyan/35 transition-all duration-500 ease-out group-hover:w-16" />

        <motion.p
          className="relative text-[12px] leading-relaxed text-on-surface-variant/75 transition-colors duration-500 group-hover:text-on-surface-variant sm:text-sm"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: delay + 0.2, ease }}
        >
          {reason.desc}
        </motion.p>
      </div>
    </motion.div>
  );
}

function AnimatedProofPanel() {
  const { t } = useLanguage();
  const chipReasons = t.whyChooseUs.reasons;
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 24 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease }}
      className="relative min-h-[360px] overflow-hidden rounded-[1.75rem] border border-white/50 bg-on-surface p-5 text-white shadow-[0_36px_110px_-54px_rgba(26,26,43,0.95)] sm:min-h-[430px] sm:p-7"
    >
      <Image
        src="/images/pelmeltech/why-choose-us.png"
        alt={t.whyChooseUs.tag}
        fill
        className="object-cover"
        priority={false}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-on-surface/85 via-on-surface/60 to-on-surface/90" />
      <motion.div
        className="absolute -left-1/3 top-12 h-24 w-[150%] bg-gradient-to-r from-transparent via-cyan/30 to-transparent blur-sm"
        animate={shouldReduceMotion ? undefined : { x: ["-18%", "18%", "-18%"] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-x-8 top-1/2 h-px bg-gradient-to-r from-transparent via-magenta to-transparent"
        animate={shouldReduceMotion ? undefined : { opacity: [0.25, 0.95, 0.25], scaleX: [0.7, 1, 0.7] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 flex h-full min-h-[320px] flex-col justify-between sm:min-h-[376px]">
        <div className="flex items-center justify-between gap-4">
          <div className="rounded-2xl bg-white px-4 py-3 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.75)]">
            <Image
              src="/images/pelmeltech/logo_pelmeltech.png"
              alt="PelmelTech"
              width={132}
              height={40}
              className="h-9 w-auto object-contain"
              priority={false}
            />
          </div>
          <div className="text-right">
            <span className="block text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-light/80">
              {t.whyChooseUs.tag}
            </span>
            <span className="text-2xl font-extrabold tabular-nums">4x</span>
          </div>
        </div>

        <div className="my-8" />

        <div className="grid grid-cols-2 gap-2">
          {chipReasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.35 + index * 0.09, ease }}
              className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 backdrop-blur-sm"
            >
              <span className="block truncate text-[11px] font-bold text-white/90">{reason.title}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function WhyChooseUs() {
  const { t } = useLanguage();

  return (
    <section className="section-y-lg relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#fff7fb_46%,#ffffff_100%)]" />
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "url(/images/pelmeltech/bg-print-grid.svg)" }} />

      <div className="relative max-w-[1280px] mx-auto px-4 md:px-16">
        <div className="mb-12 grid items-center gap-8 lg:mb-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease }}
            className="max-w-2xl"
          >
            <motion.span
              className="mb-4 block text-[11px] font-bold uppercase tracking-[0.25em] text-magenta"
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              whileInView={{ opacity: 1, letterSpacing: "0.25em" }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease }}
            >
              {t.whyChooseUs.tag}
            </motion.span>
            <h2 className="mb-5 text-4xl font-extrabold leading-[0.98] tracking-tight text-on-surface sm:text-5xl lg:text-6xl">
              {t.whyChooseUs.title}
            </h2>
            <motion.p
              className="max-w-xl text-base leading-relaxed text-on-surface-variant/70 sm:text-lg"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3, ease }}
            >
              {t.whyChooseUs.description}
            </motion.p>
            <motion.div
              className="mt-7 h-1 rounded-full bg-gradient-to-r from-magenta via-cyan to-transparent"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 180, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5, ease }}
            />
          </motion.div>

          <AnimatedProofPanel />
        </div>

        <div className="mb-12 grid grid-cols-2 gap-3 sm:mb-16 sm:gap-4 lg:mb-20 lg:grid-cols-4 lg:gap-5">
          {t.whyChooseUs.reasons.map((reason, i) => (
            <ReasonCard key={i} reason={reason} index={i} icon={ICONS[i]} />
          ))}
        </div>

        <motion.div
          className="mx-auto h-px mb-10 lg:mb-16 bg-gradient-to-r from-transparent via-outline-variant/20 to-transparent"
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: "100%", opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1.2, ease }}
        />
      </div>
    </section>
  );
}
