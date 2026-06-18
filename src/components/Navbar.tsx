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
    { label: t.nav.portfolio, href: "/portfolio", hasMegaMenu: false },
    { label: t.nav.investors, href: "/investors", hasMegaMenu: false },
    { label: t.nav.contact, href: "/contact", hasMegaMenu: false },
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
      <nav className="flex justify-between items-center h-20 px-4 md:px-16 max-w-[1280px] mx-auto">
        <Link href="/" className="flex items-center gap-1.5">
          <Image
            src="/images/pelmeltech/logo_pelmeltech.png"
            alt="PelmelTech"
            width={44}
            height={44}
            className="h-10 w-auto"
            priority
          />
          <span className="text-[22px] font-extrabold tracking-tight text-on-surface leading-none">
            elmel<span className="text-cyan">Tech</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) =>
            link.hasMegaMenu ? (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={openMegaMenu}
                onMouseLeave={closeMegaMenu}
              >
                <button
                  onClick={() => setMegaMenuOpen((v) => !v)}
                  aria-expanded={megaMenuOpen}
                  aria-haspopup="true"
                  className={`flex items-center gap-1 text-xs font-bold tracking-[0.1em] uppercase transition-colors ${
                    pathname === link.href || megaMenuOpen
                      ? "text-magenta"
                      : "text-on-surface-variant hover:text-cyan-dark"
                  }`}
                >
                  {link.label}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      megaMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-bold tracking-[0.1em] uppercase transition-colors ${
                  pathname === link.href
                    ? "text-magenta border-b-2 border-magenta pb-1"
                    : "text-on-surface-variant hover:text-cyan-dark"
                }`}
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Language switcher — desktop */}
          <div className="hidden sm:flex items-center bg-surface-container-low rounded-full border border-black/[0.06] p-0.5">
            {LOCALE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setLocale(opt.value)}
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
            className="hidden sm:flex items-center gap-2 bg-[#25D366] text-white px-6 py-2.5 rounded-full text-xs font-bold tracking-[0.1em] uppercase hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-green-500/20"
          >
            <MessageCircle size={14} className="shrink-0" />
            <span>WhatsApp</span>
          </a>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-on-surface"
            aria-label="Toggle menu"
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
            className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-black/5 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-1 max-h-[calc(100dvh-5rem)] overflow-y-auto">
              {/* Mobile language switcher */}
              <div className="flex items-center gap-1 mb-4 bg-surface-container-low rounded-full border border-black/[0.06] p-0.5 w-fit">
                {LOCALE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setLocale(opt.value)}
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
