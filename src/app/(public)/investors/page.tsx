"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  TrendingUp, Globe, Layers, Shield, Users,
  ArrowRight, CheckCircle,
} from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import StatCard from "@/components/StatCard";
import AnimatedBackground from "@/components/AnimatedBackground";

const OPPORTUNITIES = [
  {
    icon: TrendingUp,
    title: "Market Growth",
    description: "The global large format printing market is projected to reach $23.8B by 2028, with a 5.2% CAGR driven by retail, events, and architectural demand.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "PelmelTech operates across 12 countries with centralized production and distributed logistics, serving Fortune 500 clients consistently.",
  },
  {
    icon: Layers,
    title: "Scalable Operations",
    description: "Our modular production infrastructure scales linearly, adding capacity without proportional cost increases through standardized workflows.",
  },
  {
    icon: Shield,
    title: "Defensible Moat",
    description: "Proprietary CMYK calibration profiles, exclusive substrate partnerships, and ISO-certified processes create barriers to entry.",
  },
];

const PARTNERSHIP_TIERS = [
  {
    title: "Strategic Partner",
    features: ["Priority production slots", "Dedicated account manager", "Volume pricing tiers", "Co-branding opportunities"],
  },
  {
    title: "Technology Partner",
    features: ["Substrate R&D collaboration", "Joint product development", "Early access to innovations", "Technical advisory board seat"],
  },
  {
    title: "Investment Partner",
    features: ["Equity participation options", "Board observer rights", "Quarterly performance reviews", "Strategic direction input"],
  },
];

const INVESTOR_STATS = [
  { value: 250, suffix: "+", label: "Active Partners" },
  { value: 15, suffix: "%", label: "Annual Growth" },
  { value: 12, suffix: "", label: "Countries" },
  { value: 98, suffix: "%", label: "Client Retention" },
];

export default function InvestorsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-24 px-4 md:px-16 overflow-hidden">
        <AnimatedBackground />
        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left: Content */}
            <div className="lg:col-span-7">
              <span className="text-cyan-dark text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
                Partnership & Investment
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-on-surface leading-[1.1] mb-6">
                Scale with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-magenta to-cyan">
                  PelmelTech
                </span>
              </h1>
              <p className="text-lg text-on-surface-variant max-w-xl leading-relaxed mb-10">
                We don&apos;t just print. We architect global brand legacies. Join a partnership
                network that provides exclusive infrastructure for consistency across continents.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="bg-magenta text-white px-10 py-4 rounded-full text-xs font-bold tracking-[0.15em] uppercase hover:brightness-110 transition-all shadow-lg shadow-magenta/10 active:scale-95"
                >
                  Discuss Partnership
                </Link>
                <a
                  href="#opportunities"
                  className="border border-black/10 text-on-surface px-10 py-4 rounded-full text-xs font-bold tracking-[0.15em] uppercase hover:bg-surface-container transition-all"
                >
                  Learn More
                </a>
              </div>
            </div>

            {/* Right: Premium Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 relative group"
            >
              <div className="relative rounded-3xl overflow-hidden border border-black/5 bg-white p-2 shadow-2xl">
                <img
                  src="/images/pelmeltech/investor-partnership.webp"
                  alt="Corporate partnership discussion detailing industrial print production metrics"
                  className="w-full h-[320px] object-cover rounded-2xl transition-transform duration-700 group-hover:scale-102"
                />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-tr from-cyan to-magenta rounded-3xl blur-2xl opacity-10 group-hover:opacity-15 transition-opacity" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-white border-y border-black/5">
        <div className="max-w-[1280px] mx-auto px-4 md:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {INVESTOR_STATS.map((stat, i) => (
              <StatCard key={stat.label} {...stat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Opportunities */}
      <section id="opportunities" className="py-24 px-4 md:px-16 bg-surface-container-low">
        <div className="max-w-[1280px] mx-auto">
          <SectionHeader
            title="Why PelmelTech"
            description="A proven platform in a growing market with strong fundamentals and defensible competitive advantages."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {OPPORTUNITIES.map((opp, i) => (
              <motion.div
                key={opp.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm hover:shadow-lg transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-light/50 text-cyan-dark flex items-center justify-center shrink-0 group-hover:bg-cyan group-hover:text-white transition-colors">
                    <opp.icon size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-on-surface mb-2">{opp.title}</h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed">{opp.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Tiers */}
      <section className="py-24 px-4 md:px-16 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <SectionHeader
            title="Partnership Tiers"
            description="Structured pathways for strategic alignment at every level."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PARTNERSHIP_TIERS.map((tier, i) => (
              <motion.div
                key={tier.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className={`p-8 rounded-2xl border shadow-sm transition-all ${
                  i === 2
                    ? "bg-gradient-to-br from-magenta/5 to-cyan/5 border-magenta/20 shadow-lg"
                    : "bg-surface-container-low border-black/5"
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Users size={20} className={i === 2 ? "text-magenta" : "text-cyan-dark"} />
                  <h3 className="text-xl font-bold text-on-surface">{tier.title}</h3>
                </div>
                <ul className="space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-on-surface-variant">
                      <CheckCircle size={14} className={i === 2 ? "text-magenta" : "text-cyan"} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`mt-8 flex items-center gap-2 text-xs font-bold tracking-wide uppercase transition-colors ${
                    i === 2 ? "text-magenta hover:text-magenta-dark" : "text-cyan-dark hover:text-on-surface"
                  }`}
                >
                  Apply Now <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ESG */}
      <section className="py-24 px-4 md:px-16 bg-surface-container-low">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <span className="text-magenta text-xs font-bold tracking-[0.2em] uppercase">Sustainability</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight">
                ESG-Forward Operations
              </h2>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                Our commitment to environmental, social, and governance excellence isn&apos;t just policy:
                it&apos;s embedded in our production DNA, from eco-certified inks to carbon-neutral logistics.
              </p>
              <div className="space-y-4">
                {[
                  "FSC-certified paper and recyclable substrates",
                  "Carbon-neutral shipping across all markets",
                  "Zero-waste production target by 2026",
                  "ISO 14001 environmental management certified",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-on-surface-variant">
                    <CheckCircle size={14} className="text-cyan shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative bg-white rounded-2xl border border-black/5 shadow-xl overflow-hidden"
            >
              {/* Subtle top accent line */}
              <div className="h-[2px] bg-gradient-to-r from-cyan via-magenta to-cyan" />

              <div className="p-10">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-cyan-dark mb-2">
                      Revenue Performance
                    </p>
                    <h3 className="text-2xl font-extrabold text-on-surface tracking-tight">
                      Growth Trajectory
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan/10 to-magenta/10 flex items-center justify-center">
                    <TrendingUp size={18} className="text-cyan-dark" />
                  </div>
                </div>

                {/* Vertical bar chart */}
                <div className="flex items-end justify-between gap-3 h-[180px] mb-6 px-2">
                  {[
                    { year: "2022", pct: 60, value: "$4.2M" },
                    { year: "2023", pct: 75, value: "$5.8M" },
                    { year: "2024", pct: 85, value: "$7.1M" },
                    { year: "2025", pct: 95, value: "$8.6M", projected: true },
                  ].map(({ year, pct, value, projected }, i) => (
                    <div key={year} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-[11px] font-bold text-on-surface">{value}</span>
                      <div className="w-full relative rounded-t-lg overflow-hidden bg-surface-container-high/50"
                        style={{ height: "140px" }}
                      >
                        <motion.div
                          initial={{ height: 0 }}
                          whileInView={{ height: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.3 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                          className={`absolute bottom-0 w-full rounded-t-lg ${
                            projected
                              ? "bg-gradient-to-t from-magenta/80 to-magenta/40"
                              : "bg-gradient-to-t from-cyan to-cyan/60"
                          }`}
                        />
                        {projected && (
                          <div className="absolute inset-0 rounded-t-lg"
                            style={{
                              backgroundImage: "repeating-linear-gradient(135deg, transparent, transparent 3px, rgba(255,255,255,0.1) 3px, rgba(255,255,255,0.1) 6px)",
                            }}
                          />
                        )}
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-bold text-on-surface-variant">{year}</span>
                        {projected && (
                          <span className="block text-[9px] font-medium text-magenta tracking-wide uppercase">
                            proj.
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Growth indicator strip */}
                <div className="flex items-center justify-between pt-6 border-t border-black/5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan" />
                    <span className="text-[11px] text-on-surface-variant font-medium">Actual</span>
                    <div className="w-2 h-2 rounded-full bg-magenta ml-3" />
                    <span className="text-[11px] text-on-surface-variant font-medium">Projected</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-cyan/10 px-3 py-1.5 rounded-full">
                    <TrendingUp size={12} className="text-cyan-dark" />
                    <span className="text-[11px] font-bold text-cyan-dark">+21% YoY</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-[1280px] mx-auto bg-gradient-to-br from-on-surface via-on-surface to-on-surface/90 p-12 md:p-20 rounded-3xl text-center"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
            Let&apos;s Build Together
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Whether you&apos;re a strategic partner, technology provider, or investor,
            PelmelTech offers structured pathways to mutual growth.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-magenta text-white px-10 py-4 rounded-full text-xs font-bold tracking-[0.15em] uppercase hover:brightness-110 transition-all shadow-lg shadow-magenta/30 active:scale-95"
          >
            Start the Conversation <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>
    </>
  );
}
