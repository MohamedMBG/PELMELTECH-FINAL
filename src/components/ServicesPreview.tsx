"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const SERVICES = [
  {
    title: "Large Format Printing",
    desc: "Architectural wraps and industrial-scale visuals engineered with sub-millimeter precision.",
    image: "/images/pelmeltech/service-large-format.webp",
    tag: "Signature",
  },
  {
    title: "Event Printing",
    desc: "Vibrant backdrops and dynamic signage for high-stakes corporate events and launches.",
    image: "/images/pelmeltech/service-event-printing.webp",
    tag: "Popular",
  },
  {
    title: "Banner Printing",
    desc: "Resilient vinyl and premium fabric solutions for outdoor and architectural branding.",
    image: "/images/pelmeltech/service-banner-printing.webp",
    tag: "Outdoor",
  },
  {
    title: "Panel Printing",
    desc: "Rigid substrate printing on Dibond and acrylic for gallery-grade installations.",
    image: "/images/pelmeltech/service-panel-printing.webp",
    tag: "Premium",
  },
];

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const slideVariants = {
  initial: (dir: number) => ({
    x: dir > 0 ? "40%" : "-40%",
    opacity: 0,
    scale: 0.94,
    filter: "blur(6px)",
  }),
  animate: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: (dir: number) => ({
    x: dir > 0 ? "-30%" : "30%",
    opacity: 0,
    scale: 0.96,
    filter: "blur(4px)",
  }),
};

function getIndex(current: number, offset: number) {
  return (current + offset + SERVICES.length) % SERVICES.length;
}

export default function ServicesPreview() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = useCallback((dir: number) => {
    setDirection(dir);
    setCurrent((prev) => (prev + dir + SERVICES.length) % SERVICES.length);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  const prevIdx = getIndex(current, -1);
  const nextIdx = getIndex(current, 1);
  const service = SERVICES[current];

  return (
    <section className="py-28 bg-background overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-14 px-0 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
          >
            <span className="text-cyan-dark text-xs font-bold tracking-[0.2em] uppercase mb-3 block">
              What We Do
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-on-surface leading-tight mb-3">
              Core Services
            </h2>
            <p className="text-base text-on-surface-variant max-w-lg leading-relaxed">
              End-to-end printing solutions built for scale, speed, and visual
              impact.
            </p>
          </motion.div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => paginate(-1)}
                className="w-12 h-12 rounded-full border-2 border-black/8 bg-white flex items-center justify-center text-on-surface hover:bg-cyan hover:text-white hover:border-cyan transition-all duration-300 shadow-sm hover:shadow-lg active:scale-90"
                aria-label="Previous service"
              >
                <ChevronLeft size={20} strokeWidth={2.5} />
              </button>
              <button
                onClick={() => paginate(1)}
                className="w-12 h-12 rounded-full border-2 border-black/8 bg-white flex items-center justify-center text-on-surface hover:bg-cyan hover:text-white hover:border-cyan transition-all duration-300 shadow-sm hover:shadow-lg active:scale-90"
                aria-label="Next service"
              >
                <ChevronRight size={20} strokeWidth={2.5} />
              </button>
            </div>

            <div className="w-px h-8 bg-black/10 hidden md:block" />

            <Link
              href="/services"
              className="text-cyan-dark text-xs font-bold tracking-[0.15em] uppercase flex items-center gap-2 hover:text-on-surface transition-colors border-b border-cyan/30 pb-1 shrink-0"
            >
              All Services <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative flex items-stretch gap-0 md:gap-5">
          {/* Previous card — peek */}
          <motion.div
            key={`prev-${prevIdx}`}
            onClick={() => paginate(-1)}
            initial={{ opacity: 0, x: -30, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 0.92 }}
            transition={{ duration: 0.5, ease }}
            className="hidden md:block relative w-[13%] flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer group/peek"
            style={{ filter: "brightness(0.7) saturate(0.5)" }}
            whileHover={{ scale: 0.95, filter: "brightness(0.85) saturate(0.7)" }}
          >
            <div className="absolute inset-0">
              <Image
                src={SERVICES[prevIdx].image}
                alt={SERVICES[prevIdx].title}
                fill
                className="object-cover"
                sizes="13vw"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-background/20" />
            <div className="absolute inset-0 flex items-center justify-end pr-3">
              <p
                className="text-[11px] font-bold text-on-surface/40 tracking-wide uppercase group-hover/peek:text-on-surface/70 transition-colors duration-300"
                style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
              >
                {SERVICES[prevIdx].title}
              </p>
            </div>
          </motion.div>

          {/* Active card */}
          <div className="relative flex-1 min-h-[440px] md:min-h-[420px] rounded-3xl overflow-hidden bg-white border border-black/5 shadow-2xl shadow-black/8 ring-1 ring-black/[0.03]">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.55, ease }}
                className="absolute inset-0 grid grid-cols-1 md:grid-cols-[1.15fr_1fr]"
              >
                {/* Image */}
                <div className="relative h-64 md:h-full overflow-hidden">
                  <motion.div
                    key={`img-${current}`}
                    initial={{ scale: 1.08 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8, ease }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 45vw"
                      priority
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/15 hidden md:block" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent md:hidden" />

                  {/* Tag */}
                  <motion.div
                    className="absolute top-5 left-5"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2, ease }}
                  >
                    <span className="px-3.5 py-1.5 bg-white/90 backdrop-blur-sm text-cyan-dark text-[10px] font-bold tracking-[0.15em] uppercase rounded-full shadow-md border border-white/50">
                      {service.tag}
                    </span>
                  </motion.div>

                  {/* Counter — mobile */}
                  <div className="absolute bottom-4 left-5 md:hidden">
                    <span className="text-white/90 text-xs font-bold tracking-wider">
                      {String(current + 1).padStart(2, "0")} /{" "}
                      {String(SERVICES.length).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16 bg-white">
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.12, ease }}
                  >
                    <div className="items-center gap-3 mb-8 hidden md:flex">
                      <div className="w-12 h-[2px] rounded-full bg-gradient-to-r from-cyan to-cyan/40" />
                      <span className="text-cyan-dark text-[11px] font-bold tracking-[0.2em] uppercase">
                        {String(current + 1).padStart(2, "0")} /{" "}
                        {String(SERVICES.length).padStart(2, "0")}
                      </span>
                    </div>
                  </motion.div>

                  <motion.h3
                    key={`title-${current}`}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.18, ease }}
                    className="text-2xl md:text-[2rem] lg:text-4xl font-extrabold text-on-surface mb-5 tracking-tight leading-[1.15]"
                  >
                    {service.title}
                  </motion.h3>

                  <motion.p
                    key={`desc-${current}`}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25, ease }}
                    className="text-[15px] md:text-base text-on-surface-variant leading-relaxed mb-10 max-w-md"
                  >
                    {service.desc}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.32, ease }}
                  >
                    <Link
                      href="/services"
                      className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-cyan text-white text-sm font-bold hover:bg-cyan-dark transition-colors duration-300 shadow-md hover:shadow-lg w-fit group/link"
                    >
                      Learn More
                      <ArrowRight
                        size={16}
                        className="transition-transform duration-300 group-hover/link:translate-x-1"
                      />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next card — peek */}
          <motion.div
            key={`next-${nextIdx}`}
            onClick={() => paginate(1)}
            initial={{ opacity: 0, x: 30, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 0.92 }}
            transition={{ duration: 0.5, ease }}
            className="hidden md:block relative w-[13%] flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer group/peek"
            style={{ filter: "brightness(0.7) saturate(0.5)" }}
            whileHover={{ scale: 0.95, filter: "brightness(0.85) saturate(0.7)" }}
          >
            <div className="absolute inset-0">
              <Image
                src={SERVICES[nextIdx].image}
                alt={SERVICES[nextIdx].title}
                fill
                className="object-cover"
                sizes="13vw"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-l from-background/90 via-background/50 to-background/20" />
            <div className="absolute inset-0 flex items-center justify-start pl-3">
              <p
                className="text-[11px] font-bold text-on-surface/40 tracking-wide uppercase group-hover/peek:text-on-surface/70 transition-colors duration-300"
                style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
              >
                {SERVICES[nextIdx].title}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Dot indicators + mobile arrows */}
        <div className="flex items-center justify-center gap-3 mt-10">
          <button
            onClick={() => paginate(-1)}
            className="w-9 h-9 rounded-full border border-black/10 bg-white flex items-center justify-center text-on-surface/60 hover:text-cyan transition-colors md:hidden active:scale-90"
            aria-label="Previous"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-2">
            {SERVICES.map((s, i) => (
              <button
                key={s.title}
                onClick={() => goTo(i)}
                aria-label={`Go to ${s.title}`}
                className="group/dot p-1.5"
              >
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    i === current
                      ? "w-10 bg-cyan shadow-sm shadow-cyan/30"
                      : "w-2 bg-black/12 group-hover/dot:bg-cyan/40"
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            onClick={() => paginate(1)}
            className="w-9 h-9 rounded-full border border-black/10 bg-white flex items-center justify-center text-on-surface/60 hover:text-cyan transition-colors md:hidden active:scale-90"
            aria-label="Next"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
