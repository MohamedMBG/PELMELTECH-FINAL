"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import { useLanguage } from "@/i18n";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/80 backdrop-blur-xl p-12 rounded-2xl border border-black/5 shadow-xl text-center"
      >
        <CheckCircle size={48} className="text-cyan mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-on-surface mb-2">{t.contactForm.quoteRequestSent}</h3>
        <p className="text-on-surface-variant">{t.contactForm.teamWillContact}</p>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      onSubmit={handleSubmit}
      className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-2xl border border-black/5 shadow-xl space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-on-surface-variant">{t.contactForm.fullName}</label>
          <input
            type="text"
            required
            className="w-full bg-surface-container-low border border-black/10 text-on-surface rounded-lg p-4 focus:ring-2 focus:ring-cyan/20 focus:border-cyan/60 transition-all outline-none placeholder:text-on-surface-variant/40"
            placeholder={t.contactForm.placeholders.name}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-on-surface-variant">{t.contactForm.company}</label>
          <input
            type="text"
            className="w-full bg-surface-container-low border border-black/10 text-on-surface rounded-lg p-4 focus:ring-2 focus:ring-cyan/20 focus:border-cyan/60 transition-all outline-none placeholder:text-on-surface-variant/40"
            placeholder={t.contactForm.placeholders.company}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-on-surface-variant">{t.contactForm.workEmail}</label>
          <input
            type="email"
            required
            className="w-full bg-surface-container-low border border-black/10 text-on-surface rounded-lg p-4 focus:ring-2 focus:ring-cyan/20 focus:border-cyan/60 transition-all outline-none placeholder:text-on-surface-variant/40"
            placeholder={t.contactForm.placeholders.email}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-on-surface-variant">{t.contactForm.phone}</label>
          <input
            type="tel"
            className="w-full bg-surface-container-low border border-black/10 text-on-surface rounded-lg p-4 focus:ring-2 focus:ring-cyan/20 focus:border-cyan/60 transition-all outline-none placeholder:text-on-surface-variant/40"
            placeholder={t.contactForm.placeholders.phone}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-on-surface-variant">{t.contactForm.serviceType}</label>
        <select className="w-full bg-surface-container-low border border-black/10 text-on-surface rounded-lg p-4 focus:ring-2 focus:ring-cyan/20 focus:border-cyan/60 transition-all outline-none">
          {t.contactForm.serviceOptions.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-on-surface-variant">{t.contactForm.estimatedSize}</label>
          <input
            type="text"
            className="w-full bg-surface-container-low border border-black/10 text-on-surface rounded-lg p-4 focus:ring-2 focus:ring-cyan/20 focus:border-cyan/60 transition-all outline-none placeholder:text-on-surface-variant/40"
            placeholder={t.contactForm.placeholders.size}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-on-surface-variant">{t.contactForm.deadline}</label>
          <input
            type="text"
            className="w-full bg-surface-container-low border border-black/10 text-on-surface rounded-lg p-4 focus:ring-2 focus:ring-cyan/20 focus:border-cyan/60 transition-all outline-none placeholder:text-on-surface-variant/40"
            placeholder={t.contactForm.placeholders.deadline}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-on-surface-variant">{t.contactForm.projectDetails}</label>
        <textarea
          rows={4}
          className="w-full bg-surface-container-low border border-black/10 text-on-surface rounded-lg p-4 focus:ring-2 focus:ring-cyan/20 focus:border-cyan/60 transition-all outline-none placeholder:text-on-surface-variant/40 resize-none"
          placeholder={t.contactForm.placeholders.details}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-magenta text-white py-4 rounded-xl text-xs font-bold tracking-[0.15em] uppercase hover:bg-magenta-dark transition-all duration-200 shadow-lg shadow-magenta/15 active:scale-[0.98] active:-translate-y-px flex items-center justify-center gap-2"
      >
        {t.contactForm.sendQuoteRequest} <Send size={16} />
      </button>
    </motion.form>
  );
}
