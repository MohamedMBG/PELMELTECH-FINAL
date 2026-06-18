"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useLanguage } from "@/i18n";

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <>
      <section className="relative section-y px-4 md:px-16 overflow-hidden">
        <AnimatedBackground />
        <div className="max-w-[1280px] mx-auto relative z-10 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-on-surface mb-6">
            {t.contact.heroTitle}
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            {t.contact.heroDescription}
          </p>
        </div>
      </section>

      <section className="pb-16 sm:pb-20 lg:pb-24 px-4 md:px-16">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="bg-white p-8 rounded-2xl border border-black/5 shadow-lg"
            >
              <h3 className="text-xl font-bold text-magenta mb-6">{t.contact.directContact}</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-light/50 flex items-center justify-center text-cyan shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-wide uppercase text-on-surface-variant/60 mb-1">{t.contact.phone}</p>
                    <p className="text-on-surface font-semibold">+1 (555) 012-3456</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-magenta-light/50 flex items-center justify-center text-magenta shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-wide uppercase text-on-surface-variant/60 mb-1">{t.contact.email}</p>
                    <p className="text-on-surface font-semibold">projects@pelmeltech.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-light/50 flex items-center justify-center text-cyan shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-wide uppercase text-on-surface-variant/60 mb-1">{t.contact.productionHub}</p>
                    <p className="text-on-surface font-semibold">
                      88 Print Avenue, Industrial Zone West,<br />Design District, CA 90210
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <a
                  href="#"
                  className="flex items-center justify-center gap-3 w-full bg-magenta text-white py-4 rounded-xl text-xs font-bold tracking-wide uppercase hover:brightness-110 transition-all shadow-lg shadow-magenta/10"
                >
                  <MessageCircle size={18} />
                  {t.contact.chatWhatsApp}
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="relative h-[300px] rounded-3xl overflow-hidden border border-black/5 shadow-xl group bg-surface-container-low"
            >
              <img
                src="/images/pelmeltech/contact-map.svg"
                alt="PelmelTech showroom and production hub map visual coordinates"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-cyan/5 mix-blend-multiply pointer-events-none" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-magenta p-3 rounded-full shadow-2xl animate-bounce">
                  <MapPin size={24} className="text-white" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl text-xs font-bold text-on-surface border border-black/5 shadow-sm">
                <span>{t.contact.showroom}</span>
                <span className="text-magenta tracking-wide uppercase text-[10px]">{t.contact.visitUs}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-y bg-surface-container-low">
        <div className="max-w-[1280px] mx-auto px-4 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-5 bg-white p-10 rounded-2xl border border-black/5 shadow-lg hover:-translate-y-1 transition-transform"
            >
              <div className="w-14 h-14 rounded-2xl bg-cyan/10 text-cyan-dark flex items-center justify-center mb-6">
                <span className="text-2xl font-bold">P</span>
              </div>
              <h4 className="text-xl font-bold text-on-surface mb-3">{t.contact.highPrecision}</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {t.contact.highPrecisionDesc}
              </p>
            </motion.div>

            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm hover:-translate-y-1 transition-transform"
              >
                <div className="w-12 h-12 rounded-xl bg-magenta/10 text-magenta flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold">S</span>
                </div>
                <h4 className="text-lg font-bold text-on-surface mb-2">{t.contact.sustainableMaterials}</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">{t.contact.sustainableMaterialsDesc}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm hover:-translate-y-1 transition-transform"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan/10 text-cyan-dark flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold">Q</span>
                </div>
                <h4 className="text-lg font-bold text-on-surface mb-2">{t.contact.qualityChecks}</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">{t.contact.qualityChecksDesc}</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
