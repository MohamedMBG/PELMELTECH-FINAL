"use client";

import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Technical Print Grid Overlay */}
      <div className="absolute inset-0 bg-[url('/images/pelmeltech/bg-print-grid.svg')] bg-repeat opacity-40 z-0" />

      {/* Halftone Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('/images/pelmeltech/bg-halftone-pattern.svg')] bg-repeat opacity-50 z-0" />

      {/* CMYK decorative blurs */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-[10%] w-72 h-72 bg-magenta/5 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ y: [10, -15, 10], rotate: [0, -3, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-[5%] w-96 h-96 bg-cyan/5 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ y: [-5, 8, -5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 right-[30%] w-48 h-48 bg-magenta/3 rounded-full blur-[80px]"
        />
      </div>
    </div>
  );
}
