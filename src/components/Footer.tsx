"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone, Globe, Share2 } from "lucide-react";
import { useLanguage } from "@/i18n";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full pt-24 pb-12 bg-white border-t border-black/5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 px-4 md:px-16 max-w-[1280px] mx-auto mb-20">
        <div className="space-y-6">
          <Image
            src="/images/pelmeltech/logo_pelmeltech.png"
            alt="PelmelTech"
            width={140}
            height={36}
            className="h-8 w-auto"
          />
          <p className="text-on-surface-variant text-sm leading-relaxed">
            {t.footer.description}
          </p>
          <div className="flex gap-3">
            <a href="#" className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-on-surface-variant hover:text-cyan hover:border-cyan transition-all">
              <Globe size={16} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-on-surface-variant hover:text-magenta hover:border-magenta transition-all">
              <Share2 size={16} />
            </a>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-xs font-bold tracking-[0.1em] uppercase text-magenta">{t.footer.navigate}</h4>
          <ul className="space-y-3">
            <li><Link href="/services" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">{t.footer.footerServices}</Link></li>
            <li><Link href="/catalog" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">{t.footer.productCatalog}</Link></li>
            <li><Link href="/portfolio" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">{t.footer.portfolio}</Link></li>
            <li><Link href="/investors" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">{t.footer.investors}</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-xs font-bold tracking-[0.1em] uppercase text-cyan-dark">{t.footer.legal}</h4>
          <ul className="space-y-3">
            <li><a href="#" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">{t.footer.termsOfService}</a></li>
            <li><a href="#" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">{t.footer.privacyPolicy}</a></li>
            <li><a href="#" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">{t.footer.sustainability}</a></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-xs font-bold tracking-[0.1em] uppercase text-on-surface">{t.footer.contact}</h4>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-sm text-on-surface-variant">
              <MapPin size={14} className="text-cyan shrink-0" />
              123 Precision Way, Print District
            </li>
            <li className="flex items-center gap-3 text-sm text-on-surface-variant">
              <Mail size={14} className="text-magenta shrink-0" />
              contact@pelmeltech.com
            </li>
            <li className="flex items-center gap-3 text-sm text-on-surface-variant">
              <Phone size={14} className="text-cyan shrink-0" />
              +1 (555) 012-3456
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-16 pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-on-surface-variant/50">
          {t.footer.copyright}
        </p>
        <div className="flex gap-6 text-[10px] font-bold tracking-[0.2em] uppercase text-on-surface-variant/50">
          <a href="#" className="hover:text-on-surface-variant transition-colors">{t.footer.status}</a>
          <a href="#" className="hover:text-on-surface-variant transition-colors">{t.footer.cookies}</a>
          <a href="#" className="hover:text-on-surface-variant transition-colors">{t.footer.security}</a>
        </div>
      </div>
    </footer>
  );
}
