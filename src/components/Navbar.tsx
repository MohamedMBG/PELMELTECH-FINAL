"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Menu, X, ChevronDown, Sparkles, ArrowRight, MessageCircle } from "lucide-react";
import { NAV_LINKS, PRODUCT_MENU } from "@/lib/constants";
import ProductsMegaMenu from "./ProductsMegaMenu";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const pathname = usePathname();
  const megaMenuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-black/5"
          : "bg-white/60 backdrop-blur-md"
      }`}
    >
      <nav className="flex justify-between items-center h-20 px-4 md:px-16 max-w-[1280px] mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-2 h-8 bg-magenta block rounded-sm" />
          <span className="text-2xl font-extrabold tracking-tighter text-on-surface">
            PELMEL<span className="text-cyan">TECH</span>
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

        <div className="flex items-center gap-4">
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
          <div
            onMouseEnter={openMegaMenu}
            onMouseLeave={closeMegaMenu}
          >
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
            <div className="flex flex-col p-6 gap-1">
              {NAV_LINKS.map((link) =>
                link.hasMegaMenu ? (
                  <div key={link.href}>
                    <button
                      onClick={() => setMobileProductsOpen((v) => !v)}
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
                          <div className="pb-4 space-y-5">
                            {PRODUCT_MENU.categories.map((category) => (
                              <div key={category.title}>
                                <div className="flex items-center gap-3 mb-2.5 pl-2">
                                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-surface-container shrink-0">
                                    <Image
                                      src={category.image}
                                      alt={category.title}
                                      fill
                                      className="object-cover"
                                      sizes="40px"
                                    />
                                  </div>
                                  <div>
                                    <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-on-surface block">
                                      {category.title}
                                    </span>
                                    <span className="text-[10px] text-on-surface-variant/60">
                                      {category.description}
                                    </span>
                                  </div>
                                </div>
                                <div className="space-y-0.5 pl-[56px]">
                                  {category.items.map((item) => (
                                    <Link
                                      key={item.label}
                                      href={item.href}
                                      className="block text-sm text-on-surface-variant py-1.5 hover:text-magenta transition-colors"
                                    >
                                      {item.label}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}

                            <div className="border-t border-black/5 pt-4 pl-2">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-surface-container shrink-0">
                                  <Image
                                    src={PRODUCT_MENU.featured.image}
                                    alt="Featured products"
                                    fill
                                    className="object-cover"
                                    sizes="40px"
                                  />
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Sparkles size={12} className="text-cyan" strokeWidth={2.5} />
                                  <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-on-surface">
                                    {PRODUCT_MENU.featured.title}
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-0.5 pl-[56px]">
                                {PRODUCT_MENU.featured.items.map((item) => (
                                  <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`block text-sm py-1.5 transition-colors ${
                                      item.accent
                                        ? "text-magenta font-semibold"
                                        : "text-on-surface-variant hover:text-magenta"
                                    }`}
                                  >
                                    {item.label}
                                  </Link>
                                ))}
                              </div>
                              <Link
                                href={PRODUCT_MENU.featured.cta.href}
                                className="flex items-center justify-center gap-2 bg-on-surface text-white px-5 py-2.5 rounded-xl text-[10px] font-bold tracking-[0.12em] uppercase mt-4 ml-[56px] hover:bg-magenta transition-all"
                              >
                                {PRODUCT_MENU.featured.cta.label}
                                <ArrowRight size={12} />
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
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
