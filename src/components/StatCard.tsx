"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface StatCardProps {
  value: number;
  suffix: string;
  label: string;
  index: number;
}

export default function StatCard({ value, suffix, label, index }: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current * 100) / 100);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, value]);

  const isDecimal = value < 1;
  const displayValue = isDecimal ? count.toFixed(2) : Math.floor(count).toString();
  const colors = [
    "text-cyan",
    "text-magenta",
    "text-cyan-dark",
    "text-magenta-dark",
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="text-center md:text-left space-y-2"
    >
      <div className={`text-4xl md:text-5xl font-extrabold tracking-tight ${colors[index % colors.length]}`}>
        {displayValue}<span>{suffix}</span>
      </div>
      <p className="text-xs font-bold tracking-[0.15em] uppercase text-on-surface">{label}</p>
    </motion.div>
  );
}
