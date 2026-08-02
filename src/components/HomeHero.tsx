"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function HomeHero() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();

  const stats = [
    { value: "120+", label: t.hero.stats.projects },
    { value: "98%", label: t.hero.stats.satisfaction },
    { value: "24h", label: t.hero.stats.turnaround },
  ];

  const headline = [
    `${t.hero.headline[0]} ${t.hero.headline[1]}`,
    `${t.hero.headline[2]} ${t.hero.headline[3]}`,
  ];

  const machines = [
    { image: "/images/pelmeltech/hero-large-format-printer.webp", label: t.hero.machineMoments.dtf },
    { image: "/images/pelmeltech/service-large-format.webp", label: t.hero.machineMoments.ecoSolvent },
    { image: "/images/pelmeltech/service-repair-maintenance.png", label: t.hero.machineMoments.uvFlatbed },
    { image: "/images/pelmeltech/hero-large-format-printer.webp", label: t.hero.machineMoments.uvRoll },
    { image: "/images/pelmeltech/service-large-format.webp", label: t.hero.machineMoments.sublimation },
    { image: "/images/pelmeltech/service-repair-maintenance.png", label: t.hero.machineMoments.cutting },
  ];
  const machineRow = [...machines, ...machines];

  return (
    <section className="relative isolate overflow-hidden">
      {/* ── Mobile: immersive "press proof" hero ── */}
      <div className="relative flex min-h-[calc(100dvh-4rem)] flex-col justify-end overflow-hidden bg-[#150a10] [contain:paint] lg:hidden">
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0"
            animate={reduceMotion ? undefined : { scale: [1.06, 1.14, 1.06] }}
            transition={reduceMotion ? undefined : { duration: 18, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/images/pelmeltech/hero-large-format-printer.webp"
              alt="PelmelTech large-format printer in production"
              fill
              priority
              sizes="100vw"
              className="object-cover object-[62%_center]"
            />
          </motion.div>
          <div className="absolute inset-0 bg-[#150a10]/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#150a10] via-[#150a10]/50 to-[#150a10]/10" />
          <div className="absolute inset-0 bg-[url('/images/pelmeltech/bg-halftone-pattern.svg')] opacity-[0.07] mix-blend-overlay" />
        </div>

        {/* proof-sheet furniture: registration corners + CMYK calibration strip */}
        <div aria-hidden className="absolute start-4 top-4 z-10 h-4 w-4 border-s border-t border-white/40" />
        <div aria-hidden className="absolute end-4 top-4 z-10 h-4 w-4 border-e border-t border-white/40" />
        <div aria-hidden className="absolute end-4 top-1/3 z-10 flex flex-col gap-1">
          {["#00abec", "#e20074", "#ffd400", "#1a1a2b"].map((c) => (
            <span key={c} className="h-2.5 w-2.5 rounded-[1px] ring-1 ring-white/25" style={{ backgroundColor: c }} />
          ))}
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 pt-5"
        >
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/60">Pelmeltech</span>
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/60">CMYK · N°01</span>
        </motion.div>

        <div className="relative z-10 px-5 pb-7 pt-36">
          <h1 className="text-[clamp(2.5rem,11vw,3.6rem)] font-extrabold leading-[0.95] tracking-[-0.045em] text-white">
            {headline.map((line, index) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                {/* LCP text: rendered visible at first paint, not gated behind JS/animation */}
                <span className={`block ${index === 1 ? "text-[#ff3d94]" : ""}`}>
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease }}
            className="mt-4 max-w-[44ch] text-sm font-semibold leading-6 text-white"
          >
            {t.hero.tagline}
          </motion.p>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease }}
            className="mt-3 max-w-[46ch] text-[13.5px] leading-6 text-white/70"
          >
            {t.hero.description}
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.58, ease }}
            className="mt-6 flex flex-col gap-2.5"
          >
            <Link
              href="/contact"
              className="group inline-flex h-[52px] items-center justify-center gap-3 rounded-full bg-magenta text-xs font-bold uppercase tracking-[0.14em] text-white transition active:scale-[0.98]"
            >
              {t.hero.requestQuote}
              <ArrowRight size={16} strokeWidth={2} className="transition-transform duration-300 group-active:translate-x-1 rtl:rotate-180" />
            </Link>
            <Link
              href="/catalog"
              className="inline-flex h-[52px] items-center justify-center rounded-full border border-white/25 bg-white/5 text-xs font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm transition active:scale-[0.98]"
            >
              {t.hero.exploreWork}
            </Link>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="mt-7 grid grid-cols-3 border-t border-white/15 pt-4"
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className={`min-w-0 ${index > 0 ? "border-s border-white/10 ps-4" : ""}`}>
                <strong className="block text-[22px] font-extrabold tracking-[-0.04em] text-white">{stat.value}</strong>
                <span className="mt-0.5 block truncate text-[9px] font-bold uppercase tracking-[0.12em] text-white/50">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Mobile: swipeable machine reel ── */}
      <div className="relative overflow-hidden bg-[#150a10] pb-9 pt-2 [contain:paint] lg:hidden">
        <div className="mb-4 flex items-center gap-3 px-5">
          <span className="h-1.5 w-1.5 rounded-full bg-magenta" />
          <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/50">
            {t.hero.machineMoments.title}
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
        </div>
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {machines.map((machine, index) => (
            <div key={machine.label} className="relative h-36 w-[13rem] shrink-0 snap-start overflow-hidden rounded-2xl">
              <Image src={machine.image} alt={machine.label} fill sizes="208px" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#150a10]/90 via-[#150a10]/15 to-transparent" />
              <span className="absolute start-3 top-2.5 text-[9px] font-bold tracking-[0.2em] text-white/45">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="absolute inset-x-3 bottom-2.5 truncate text-[10px] font-bold uppercase tracking-[0.1em] text-white">
                {machine.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Desktop: original layout, unchanged ── */}
      <div className="pointer-events-none absolute -end-40 top-0 -z-10 hidden h-[34rem] w-[34rem] rounded-full bg-magenta/[0.045] blur-[120px] lg:block" />

      <div className="mx-auto hidden min-h-[calc(100dvh-5rem)] w-full max-w-[1400px] flex-col items-center justify-center px-5 py-10 sm:px-8 sm:py-12 lg:flex lg:px-12 lg:py-8 xl:px-16">
        <div className="grid w-full items-center gap-10 md:gap-12 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-14 xl:gap-20">
          <div className="relative z-10 max-w-[630px] lg:py-8">
            <h1 className="text-[clamp(2.7rem,6.1vw,5.8rem)] font-extrabold leading-[0.94] tracking-[-0.055em] text-on-surface">
              {headline.map((line, index) => (
                <span key={line} className="block overflow-hidden pb-[0.08em]">
                  {/* LCP text: rendered visible at first paint, not gated behind JS/animation */}
                  <span className={`block ${index === 1 ? "text-magenta" : ""}`}>
                    {line}
                  </span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.42, ease }}
              className="mt-6 max-w-[48ch] text-sm font-semibold leading-6 text-on-surface sm:text-[15px] lg:mt-7"
            >
              {t.hero.tagline}
            </motion.p>

            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.5, ease }}
              className="mt-4 max-w-[52ch] text-[15px] leading-7 text-on-surface-variant sm:text-base"
            >
              {t.hero.description}
            </motion.p>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.56, ease }}
              className="mt-7 flex flex-wrap items-center gap-3 sm:mt-8"
            >
              <Link
                href="/contact"
                className="group inline-flex min-h-12 items-center gap-3 whitespace-nowrap rounded-full bg-on-surface px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-surface-lowest transition duration-300 hover:-translate-y-0.5 hover:bg-magenta active:translate-y-px sm:px-7"
              >
                {t.hero.requestQuote}
                <ArrowRight
                  size={16}
                  strokeWidth={2}
                  className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                />
              </Link>
              <Link
                href="/catalog"
                className="inline-flex min-h-12 items-center whitespace-nowrap rounded-full border border-outline-variant/70 px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-on-surface transition duration-300 hover:-translate-y-0.5 hover:border-magenta hover:text-magenta active:translate-y-px sm:px-7"
              >
                {t.hero.exploreWork}
              </Link>
            </motion.div>
          </div>

          <motion.div
            // Static container: the hero image (a desktop LCP candidate) must be
            // painted at first render, never gated behind hydration/animation.
            // The inner "breathing" scale animation below is purely decorative.
            initial={false}
            className="relative mx-auto w-full max-w-[760px] lg:mx-0"
          >
            <div className="relative overflow-hidden rounded-[24px] bg-surface-container shadow-[0_30px_80px_rgba(45,29,39,0.16)] sm:rounded-[28px]">
              <div className="relative aspect-[3/4] min-h-[420px] sm:min-h-[560px] lg:aspect-[3/4] lg:max-h-[860px] xl:min-h-[640px]">
                <motion.div
                  className="absolute inset-0"
                  animate={reduceMotion ? undefined : { scale: [1, 1.035, 1] }}
                  transition={reduceMotion ? undefined : { duration: 10, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Image
                    src="/images/pelmeltech/hero-large-format-printer.webp"
                    alt="PelmelTech large-format printer in production"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 56vw"
                    className="object-cover object-center"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/25 via-transparent to-white/5" />
              </div>

              <div className="absolute inset-x-3 bottom-3 rounded-2xl border border-white/50 bg-white/90 p-4 shadow-[0_16px_40px_rgba(26,26,43,0.12)] backdrop-blur-xl sm:inset-x-5 sm:bottom-5 sm:p-5">
                <div className="grid grid-cols-3">
                  {stats.map((stat, index) => (
                    <div
                      key={stat.label}
                      className={`min-w-0 px-2 sm:px-4 ${index > 0 ? "border-s border-on-surface/10" : ""}`}
                    >
                      <strong className="block text-xl font-extrabold tracking-[-0.04em] text-on-surface sm:text-2xl">
                        {stat.value}
                      </strong>
                      <span className="mt-1 block truncate text-[9px] font-bold uppercase tracking-[0.11em] text-on-surface-variant/70 sm:text-[10px]">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute -bottom-4 -end-4 -z-10 h-28 w-28 rounded-[28px] border border-magenta/15 sm:-bottom-6 sm:-end-6 sm:h-40 sm:w-40" />
          </motion.div>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.75, ease }}
          className="relative mt-12 w-full lg:mt-16"
        >
          <div className="mb-5 flex items-center gap-4">
            <span className="h-1.5 w-1.5 rounded-full bg-magenta" />
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-on-surface-variant/60">
              {t.hero.machineMoments.title}
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-outline-variant/50 via-outline-variant/20 to-transparent" />
          </div>

          <div className="group/marquee relative">
            <div
              className="animate-marquee flex w-max gap-5 py-3 group-hover/marquee:[animation-play-state:paused] sm:gap-6"
              style={{ animationDuration: "38s" }}
            >
              {machineRow.map((machine, index) => (
                <motion.div
                  key={`${machine.label}-${index}`}
                  animate={reduceMotion ? undefined : { y: [0, index % 2 === 0 ? -7 : 7, 0] }}
                  transition={
                    reduceMotion
                      ? undefined
                      : { duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: (index % machines.length) * 0.35 }
                  }
                  className="group/card relative shrink-0 rounded-[20px] bg-gradient-to-br from-magenta/35 via-outline-variant/25 to-cyan/35 p-px shadow-[0_14px_36px_rgba(45,29,39,0.10)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_26px_60px_rgba(214,31,105,0.22)]"
                >
                  <div className="relative h-32 w-44 overflow-hidden rounded-[19px] bg-surface-container sm:h-40 sm:w-56">
                    <motion.div
                      className="absolute inset-0"
                      animate={reduceMotion ? undefined : { scale: [1, 1.09, 1] }}
                      transition={
                        reduceMotion
                          ? undefined
                          : { duration: 9, repeat: Infinity, ease: "easeInOut", delay: (index % machines.length) * 0.8 }
                      }
                    >
                      <Image
                        src={machine.image}
                        alt={machine.label}
                        fill
                        sizes="224px"
                        className="scale-[1.18] object-cover object-center saturate-[0.85] transition-[filter] duration-700 group-hover/card:saturate-125"
                      />
                    </motion.div>

                    <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-on-surface/25 to-on-surface/45" />

                    {/* shine sweep on hover */}
                    <div className="pointer-events-none absolute inset-0 -translate-x-[130%] skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 ease-out group-hover/card:translate-x-[130%]" />

                    <div className="absolute inset-x-2.5 bottom-2.5 flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 backdrop-blur-md transition-colors duration-500 group-hover/card:border-white/40 group-hover/card:bg-white/20">
                      <span className="h-1 w-1 shrink-0 rounded-full bg-magenta shadow-[0_0_6px_rgba(214,31,105,0.9)]" />
                      <span className="truncate text-[9px] font-bold uppercase tracking-[0.1em] text-white sm:text-[10px]">
                        {machine.label}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
