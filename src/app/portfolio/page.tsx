"use client";

import { motion } from "framer-motion";
import { Star, CheckCircle, Shield, Leaf, Award } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import PortfolioCard from "@/components/PortfolioCard";
import StatCard from "@/components/StatCard";
import CTASection from "@/components/CTASection";
import AnimatedBackground from "@/components/AnimatedBackground";
import { PORTFOLIO_PROJECTS, STATS, TESTIMONIALS } from "@/lib/constants";

export default function PortfolioPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-24 px-4 md:px-16 overflow-hidden">
        <AnimatedBackground />
        <div className="max-w-[1280px] mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-on-surface mb-6">
            Crafting Visual Impact
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            From global storefronts to immersive exhibition halls, PelmelTech translates
            brand visions into high-precision physical reality.
          </p>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-24 px-4 md:px-16 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <SectionHeader
            label="Craftsmanship"
            title="Projects & Print Realizations"
          />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Featured */}
            <div className="md:col-span-8 row-span-2">
              <PortfolioCard {...PORTFOLIO_PROJECTS[0]} index={0} />
            </div>
            <div className="md:col-span-4">
              <PortfolioCard {...PORTFOLIO_PROJECTS[1]} index={1} />
            </div>
            <div className="md:col-span-4">
              <PortfolioCard {...PORTFOLIO_PROJECTS[2]} index={2} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {PORTFOLIO_PROJECTS.slice(3).map((project, i) => (
              <PortfolioCard key={project.title} {...project} index={i + 3} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-surface-container-low border-y border-black/5">
        <div className="max-w-[1280px] mx-auto px-4 md:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {STATS.map((stat, i) => (
              <StatCard key={stat.label} {...stat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 md:px-16 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <SectionHeader
            label="Endorsements"
            title="Trusted by Industry Leaders"
            labelColor="cyan"
            center
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.author}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-surface-container-low p-8 rounded-2xl border border-black/5"
              >
                <div className="flex gap-1 text-magenta mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm text-on-surface-variant italic leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-light/50 border border-cyan/20 flex items-center justify-center text-cyan-dark text-xs font-bold">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">{t.author}</p>
                    <p className="text-xs text-on-surface-variant">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quality Badges */}
          <div className="mt-20 flex flex-wrap justify-center gap-12 opacity-40 hover:opacity-100 transition-all duration-700">
            {[
              { icon: CheckCircle, label: "ISO 9001 Certified" },
              { icon: Leaf, label: "FSC Certified" },
              { icon: Award, label: "Gold Medalist Studio" },
              { icon: Shield, label: "Secure Fulfillment" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <Icon size={28} className="text-on-surface" />
                <span className="text-xs font-bold tracking-[0.1em] uppercase text-on-surface">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-12 bg-surface-container-low border-b border-black/5">
        <div className="max-w-[1280px] mx-auto px-4 md:px-16 flex flex-wrap justify-between items-center opacity-30 hover:opacity-60 transition-all duration-500 gap-8">
          {[
            { name: "EVENTCORE", letter: "E", bg: "bg-cyan/10 text-cyan-dark" },
            { name: "BRANDSPACE", letter: "B", bg: "bg-magenta/10 text-magenta" },
            { name: "VISUALIZE", letter: "V", bg: "bg-cyan/10 text-cyan-dark" },
            { name: "PRINTSMART", letter: "P", bg: "bg-magenta/10 text-magenta" },
            { name: "TECHPRO", letter: "T", bg: "bg-cyan/10 text-cyan-dark" },
          ].map((brand) => (
            <div key={brand.name} className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg ${brand.bg} flex items-center justify-center`}>
                <span className="text-sm font-extrabold">{brand.letter}</span>
              </div>
              <span className="font-extrabold text-xl tracking-tighter text-on-surface">{brand.name}</span>
            </div>
          ))}
        </div>
      </section>

      <CTASection
        title="Ready for your next grand scale realization?"
        description="Consult with our senior technical advisors for large-format, multi-location, or complex architectural branding projects."
        primaryLabel="Start a Consultation"
        primaryHref="/contact"
        secondaryLabel="View Catalog"
        secondaryHref="/catalog"
      />
    </>
  );
}
