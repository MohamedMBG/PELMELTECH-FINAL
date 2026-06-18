"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import {
  Ruler, PartyPopper, Flag, LayoutGrid, Image, Megaphone, Settings,
} from "lucide-react";

const ICON_MAP = {
  Ruler, PartyPopper, Flag, LayoutGrid, Image, Megaphone, Settings,
} as const;

interface ServiceItem {
  title: string;
  description: string;
  features: readonly string[];
  icon: keyof typeof ICON_MAP;
  accent: "cyan" | "magenta";
  image: string;
}

const STACK_GAP = 40;
const FIRST_TOP = 100;
const WIDTH_STEP = 2.5;

const SPRING = { stiffness: 200, damping: 30, mass: 0.5 };
const SPRING_LOOSE = { stiffness: 120, damping: 25, mass: 0.6 };

function StackingCard({ service, index, total }: { service: ServiceItem; index: number; total: number }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const Icon = ICON_MAP[service.icon];
  const isCyan = service.accent === "cyan";
  const isEven = index % 2 === 0;
  const isLast = index === total - 1;

  const stickyTop = FIRST_TOP + index * STACK_GAP;
  const cardWidth = 100 - index * WIDTH_STEP;

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end start"],
  });

  const rawScale = useTransform(scrollYProgress, [0.25, 0.8], [1, 0.95]);
  const scale = useSpring(rawScale, SPRING);

  const rawDim = useTransform(scrollYProgress, [0.2, 0.75], [0, 0.25]);
  const dimOverlay = useSpring(rawDim, SPRING);

  const rawImageY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const imageY = useSpring(rawImageY, SPRING_LOOSE);

  return (
    <div
      ref={wrapperRef}
      className={`mb-6 md:mb-0 ${isLast ? "" : "md:h-[520px]"}`}
    >
      <motion.div
        className="md:sticky mx-auto max-md:w-full! rounded-3xl overflow-hidden bg-white will-change-transform relative"
        style={{
          top: stickyTop,
          width: `${cardWidth}%`,
          zIndex: index + 1,
          scale: isLast ? undefined : scale,
          transformOrigin: "top center",
          boxShadow: `
            0 ${1 + index}px ${6 + index * 2}px rgba(0,0,0,${(0.02 + index * 0.006).toFixed(3)}),
            0 ${4 + index * 3}px ${18 + index * 8}px ${index}px rgba(0,0,0,${(0.05 + index * 0.016).toFixed(3)})
          `,
        }}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Accent bar — visible in stack peek between cards */}
        <div className={`h-1 ${
          isCyan
            ? "bg-gradient-to-r from-cyan via-cyan-dark to-cyan"
            : "bg-gradient-to-r from-magenta via-magenta-dark to-magenta"
        }`} />

        <div className={`flex flex-col md:flex-row border-x border-b border-black/[0.06] rounded-b-3xl ${!isEven ? "md:flex-row-reverse" : ""}`}>
          {/* Image with parallax */}
          <div className="md:w-[42%] h-48 md:h-[320px] overflow-hidden relative">
            <motion.div
              className="absolute -top-8 -bottom-8 left-0 right-0"
              style={{ y: imageY }}
            >
              <img
                src={service.image}
                alt={service.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className={`absolute inset-0 mix-blend-multiply opacity-20 ${
              isCyan
                ? "bg-gradient-to-br from-cyan-dark/30 to-transparent"
                : "bg-gradient-to-br from-magenta-dark/30 to-transparent"
            }`} />
            <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 z-10">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase text-white/90 backdrop-blur-md ${
                isCyan ? "bg-cyan-dark/50" : "bg-magenta-dark/50"
              }`}>
                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="md:w-[58%] p-7 md:p-10 lg:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                isCyan ? "bg-cyan/10 text-cyan-dark" : "bg-magenta/10 text-magenta"
              }`}>
                <Icon size={22} />
              </div>
              <div className={`h-px flex-1 ${isCyan ? "bg-cyan/15" : "bg-magenta/15"}`} />
            </div>

            <h3 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-on-surface tracking-tight mb-3">
              {service.title}
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6 max-w-lg">
              {service.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {service.features.map((feature) => (
                <span
                  key={feature}
                  className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-full border ${
                    isCyan
                      ? "border-cyan/15 text-cyan-dark bg-cyan/5"
                      : "border-magenta/15 text-magenta-dark bg-magenta/5"
                  }`}
                >
                  <span className={`w-1 h-1 rounded-full ${isCyan ? "bg-cyan" : "bg-magenta"}`} />
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Smooth dim overlay — darkens as card gets buried */}
        {!isLast && (
          <motion.div
            className="absolute inset-0 bg-black pointer-events-none rounded-3xl hidden md:block"
            style={{ opacity: dimOverlay }}
          />
        )}
      </motion.div>
    </div>
  );
}

export default function StackingServiceCards({ services }: { services: readonly ServiceItem[] }) {
  return (
    <div className="relative">
      {services.map((service, i) => (
        <StackingCard
          key={service.title}
          service={service}
          index={i}
          total={services.length}
        />
      ))}
    </div>
  );
}
