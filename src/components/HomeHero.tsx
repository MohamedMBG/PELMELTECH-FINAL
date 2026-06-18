"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const HEADLINE = [
  { text: "Print", accent: false },
  { text: "experiences", accent: false },
  { text: "built for", accent: true },
  { text: "brands.", accent: true },
];

const STATS = [
  { value: "120+", label: "Projects" },
  { value: "98%", label: "Satisfaction" },
  { value: "24h", label: "Turnaround" },
];

export default function HomeHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[calc(100dvh-80px)] flex items-center overflow-hidden"
    >
      {/* ── Background texture ── */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: "url(/images/pelmeltech/bg-halftone-pattern.svg)",
          backgroundSize: "280px",
        }}
      />

      {/* ── Decorative vertical accent ── */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.8, delay: 0.15, ease }}
        className="absolute left-[5.5%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-magenta/10 to-transparent origin-top hidden xl:block"
      />

      {/* ── Ambient floating orb ── */}
      <motion.div
        animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[15%] right-[8%] w-[340px] h-[340px] bg-cyan/[0.03] rounded-full blur-[100px] pointer-events-none"
      />

      <motion.div style={{ opacity: opacityFade }} className="w-full">
        <div className="max-w-[1400px] w-full mx-auto px-6 md:px-12 lg:px-16 xl:px-20 py-10 lg:py-0">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-14 items-center">
            {/* ════════════ Image Column ════════════ */}
            <div className="lg:col-span-6 relative order-2 lg:order-1">
              {/* Ambient glow behind image */}
              <motion.div
                animate={{ opacity: [0.35, 0.65, 0.35] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -inset-10 bg-gradient-to-br from-magenta/[0.05] via-transparent to-cyan/[0.04] rounded-[32px] blur-3xl -z-10"
              />

              {/* Clip-path reveal wrapper */}
              <motion.div
                initial={{ clipPath: "inset(8% round 28px)" }}
                animate={{ clipPath: "inset(0% round 20px)" }}
                transition={{ duration: 1.5, delay: 0.1, ease }}
              >
                <div className="relative rounded-[20px] overflow-hidden aspect-[3/4] shadow-2xl shadow-black/10">
                  {/* Parallax image */}
                  <motion.div
                    className="absolute -inset-[12%] will-change-transform"
                    style={{ y: imageY, scale: imageScale }}
                  >
                    <Image
                      src="/images/pelmeltech/hero-large-format-printer.webp"
                      alt="PelmelTech large format printer producing premium prints"
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </motion.div>

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-on-surface/15 via-on-surface/[0.02] to-transparent" />

                  {/* ── Stats glass card ── */}
                  <motion.div
                    initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.9, delay: 1.5, ease }}
                    className="absolute bottom-5 left-5 right-5 z-10"
                  >
                    <div className="bg-white/85 backdrop-blur-2xl rounded-2xl px-6 py-4 shadow-xl shadow-black/[0.06] border border-white/40">
                      <div className="flex items-center justify-between">
                        {STATS.map((stat, i) => (
                          <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.5,
                              delay: 1.75 + i * 0.12,
                              ease,
                            }}
                            className={
                              i > 0
                                ? "border-l border-on-surface/[0.06] pl-5"
                                : ""
                            }
                          >
                            <span className="block text-lg font-extrabold text-on-surface tracking-tight leading-none">
                              {stat.value}
                            </span>
                            <span className="block text-[8px] font-bold tracking-[0.2em] uppercase text-on-surface-variant/45 mt-1.5">
                              {stat.label}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Crop marks */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.6, ease }}
                className="hidden lg:block"
              >
                <div className="absolute -top-3 -left-3 w-5 h-5 border-t border-l border-magenta/15" />
                <div className="absolute -top-3 -right-3 w-5 h-5 border-t border-r border-magenta/15" />
                <div className="absolute -bottom-3 -left-3 w-5 h-5 border-b border-l border-magenta/15" />
                <div className="absolute -bottom-3 -right-3 w-5 h-5 border-b border-r border-magenta/15" />
              </motion.div>
            </div>

            {/* ════════════ Text Column ════════════ */}
            <div className="lg:col-span-6 flex flex-col justify-center order-1 lg:order-2 lg:pl-4 xl:pl-6">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.25, ease }}
                className="flex items-center gap-3 mb-8 lg:mb-12"
              >
                <motion.span
                  className="w-2 h-2 rounded-full bg-magenta"
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <span className="text-[10px] font-bold tracking-[0.24em] text-on-surface-variant/45 uppercase">
                  Premium Printing Solutions
                </span>
              </motion.div>

              {/* Headline with 3D reveal */}
              <div className="mb-8 lg:mb-10" style={{ perspective: "900px" }}>
                <h1>
                  {HEADLINE.map((line, i) => (
                    <span key={line.text} className="block overflow-hidden">
                      <motion.span
                        initial={{ y: "130%", rotateX: 40 }}
                        animate={{ y: "0%", rotateX: 0 }}
                        transition={{
                          duration: 1.1,
                          delay: 0.3 + i * 0.1,
                          ease,
                        }}
                        className={`block text-[clamp(2.5rem,5.8vw,5.25rem)] font-extrabold tracking-[-0.04em] leading-[1.08] ${
                          line.accent ? "text-magenta" : "text-on-surface"
                        }`}
                        style={{ transformOrigin: "center bottom", willChange: "transform" }}
                      >
                        {line.text}
                      </motion.span>
                    </span>
                  ))}
                </h1>
              </div>

              {/* Double accent line */}
              <div className="flex items-center gap-3 mb-7">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.9, delay: 0.85, ease }}
                  className="w-14 h-[2px] bg-magenta origin-left"
                />
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, delay: 1.05, ease }}
                  className="w-8 h-px bg-on-surface/8 origin-left"
                />
              </div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.05, ease }}
                className="text-[15px] md:text-base text-on-surface-variant leading-[1.85] max-w-[400px] mb-10"
              >
                Large-format banners, exhibition panels, and event branding
                &mdash; engineered with precision for brands that demand impact.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2, ease }}
                className="flex flex-wrap items-center gap-5"
              >
                <Link
                  href="/portfolio"
                  className="group relative inline-flex items-center gap-2.5 bg-on-surface text-surface-lowest px-8 py-4 rounded-full text-[10px] font-bold tracking-[0.18em] uppercase overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-magenta/15 hover:-translate-y-0.5"
                >
                  <span className="absolute inset-0 bg-magenta origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]" />
                  <span className="relative flex items-center gap-2.5">
                    Explore Our Work
                    <ArrowRight
                      size={14}
                      strokeWidth={2.5}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </Link>

                <Link
                  href="/contact"
                  className="group inline-flex items-center text-[10px] font-bold tracking-[0.18em] uppercase text-on-surface-variant/55 hover:text-magenta transition-colors duration-300 px-4 py-4"
                >
                  <span className="relative pb-0.5">
                    Request a Quote
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-magenta group-hover:w-full transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]" />
                  </span>
                </Link>
              </motion.div>

              {/* Scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 2.0, ease }}
                className="hidden lg:flex items-center gap-3 mt-16 xl:mt-20"
              >
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-5 h-8 rounded-full border border-on-surface-variant/15 flex items-start justify-center pt-1.5"
                >
                  <motion.span
                    animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-[3px] h-[3px] rounded-full bg-on-surface-variant/30"
                  />
                </motion.div>
                <span className="text-[9px] font-semibold tracking-[0.22em] uppercase text-on-surface-variant/25">
                  Scroll to explore
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom gradient divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
    </section>
  );
}
