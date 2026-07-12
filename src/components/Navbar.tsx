"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Menu, X, ChevronDown, MessageCircle } from "lucide-react";
import { useLanguage, type Locale } from "@/i18n";
import ProductsMegaMenu, { MobileProductsAccordion } from "./ProductsMegaMenu";

const LOCALE_OPTIONS: { value: Locale; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "fr", label: "FR" },
  { value: "ar", label: "AR" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const pathname = usePathname();
  const megaMenuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { locale, setLocale, t } = useLanguage();

  const NAV_LINKS = [
    { label: t.nav.home, href: "/", hasMegaMenu: false },
    { label: t.nav.services, href: "/services", hasMegaMenu: false },
    { label: t.nav.products, href: "/catalog", hasMegaMenu: true },
    { label: t.nav.contact, href: "/contact", hasMegaMenu: false },
    { label: "PelmelBot", href: "/chat", hasMegaMenu: false },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMobileOpen(false);
      setMegaMenuOpen(false);
      setMobileProductsOpen(false);
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  const openMegaMenu = useCallback(() => {
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    setMegaMenuOpen(true);
  }, []);

  const closeMegaMenu = useCallback(() => {
    megaMenuTimeout.current = setTimeout(() => setMegaMenuOpen(false), 150);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMegaMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    };
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
    setMobileProductsOpen(false);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-black/5"
          : "bg-white/60 backdrop-blur-md"
      }`}
    >
      <nav className="flex justify-between items-center gap-4 h-16 lg:h-20 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[1280px] mx-auto">
        <Link href="/" className="group flex items-center gap-1.5">
          <Image
            src="/images/pelmeltech/logo_pelmeltech.png"
            alt="PelmelTech"
            width={44}
            height={44}
            className="h-9 lg:h-10 w-auto transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
            priority
          />
          <span className="text-[20px] lg:text-[22px] font-extrabold tracking-tight text-on-surface leading-none">
            elmel<span className="text-magenta transition-colors group-hover:text-cyan">Tech</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden xl:flex items-center gap-0.5">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || (link.hasMegaMenu && megaMenuOpen);
            const inner = (
              <>
                <span className="relative z-10 flex items-center gap-1">
                  {link.label}
                  {link.hasMegaMenu && (
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${megaMenuOpen ? "rotate-180" : ""}`}
                    />
                  )}
                </span>
                {/* hover pill */}
                <span className="absolute inset-0 rounded-full bg-surface-container-low opacity-0 scale-90 group-hover/nav:opacity-100 group-hover/nav:scale-100 transition-all duration-200" />
                {/* underline */}
                <span
                  className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-magenta transition-all duration-300 ${
                    active ? "w-5" : "w-0 group-hover/nav:w-5"
                  }`}
                />
              </>
            );
            const cls = `group/nav relative flex items-center px-3 py-2 rounded-full text-[11px] font-bold tracking-[0.08em] uppercase whitespace-nowrap transition-colors ${
              active ? "text-magenta" : "text-on-surface-variant hover:text-cyan-dark"
            }`;
            return link.hasMegaMenu ? (
              <div key={link.href} onMouseEnter={openMegaMenu} onMouseLeave={closeMegaMenu}>
                <button
                  onClick={() => setMegaMenuOpen((v) => !v)}
                  aria-expanded={megaMenuOpen}
                  aria-haspopup="true"
                  className={cls}
                >
                  {inner}
                </button>
              </div>
            ) : (
              <Link key={link.href} href={link.href} className={cls}>
                {inner}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {/* Language switcher — desktop */}
          <div className="hidden sm:flex items-center bg-surface-container-low rounded-full border border-black/[0.06] p-0.5">
            {LOCALE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setLocale(opt.value)}
                aria-pressed={locale === opt.value}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-[0.08em] transition-all duration-200 ${
                  locale === opt.value
                    ? "bg-on-surface text-white shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <a
            href="https://wa.me/15550123456"
            target="_blank"
            rel="noopener noreferrer"
            className="group hidden sm:flex items-center gap-2 bg-[#25D366] text-white px-6 py-2.5 rounded-full text-xs font-bold tracking-[0.1em] uppercase hover:brightness-110 hover:-translate-y-0.5 transition-all active:scale-95 shadow-lg shadow-green-500/20 hover:shadow-green-500/40"
          >
            <MessageCircle size={14} className="shrink-0 group-hover:rotate-12 transition-transform" />
            <span>WhatsApp</span>
          </a>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="xl:hidden p-2 text-on-surface"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Desktop mega menu */}
      <AnimatePresence>
        {megaMenuOpen && (
          <div onMouseEnter={openMegaMenu} onMouseLeave={closeMegaMenu}>
            <ProductsMegaMenu onClose={() => setMegaMenuOpen(false)} />
          </div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-white/95 backdrop-blur-xl border-t border-black/5 overflow-hidden"
          >
            <div className="flex flex-col p-5 sm:p-6 gap-1 max-h-[calc(100dvh-4rem)] lg:max-h-[calc(100dvh-5rem)] overflow-y-auto">
              {/* Mobile language switcher */}
              <div className="flex items-center gap-1 mb-4 bg-surface-container-low rounded-full border border-black/[0.06] p-0.5 w-fit">
                {LOCALE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setLocale(opt.value)}
                    aria-pressed={locale === opt.value}
                    className={`px-4 py-2 rounded-full text-xs font-bold tracking-[0.08em] transition-all ${
                      locale === opt.value
                        ? "bg-on-surface text-white shadow-sm"
                        : "text-on-surface-variant"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {NAV_LINKS.map((link) =>
                link.hasMegaMenu ? (
                  <div key={link.href}>
                    <button
                      onClick={() => setMobileProductsOpen((v) => !v)}
                      aria-expanded={mobileProductsOpen}
                      className={`flex items-center justify-between w-full text-sm font-semibold tracking-wide uppercase py-3 ${
                        pathname === link.href
                          ? "text-magenta"
                          : "text-on-surface-variant"
                      }`}
                    >
                      {link.label}
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                          mobileProductsOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {mobileProductsOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <MobileProductsAccordion onNavigate={closeMobileMenu} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={`text-sm font-semibold tracking-wide uppercase py-3 ${
                      pathname === link.href
                        ? "text-magenta"
                        : "text-on-surface-variant"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <a
                href="https://wa.me/15550123456"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white px-6 py-3 rounded-full text-xs font-bold tracking-[0.1em] uppercase text-center mt-4 flex items-center justify-center gap-2"
              >
                <MessageCircle size={14} />
                WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
