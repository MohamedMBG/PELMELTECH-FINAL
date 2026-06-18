"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import en from "./locales/en";
import fr from "./locales/fr";
import ar from "./locales/ar";

export type Locale = "en" | "fr" | "ar";
export type Direction = "ltr" | "rtl";
export type Translations = typeof en;

const STORAGE_KEY = "pelmeltech_language";

const allTranslations: Record<Locale, Translations> = { en, fr, ar };

interface LanguageContextType {
  locale: Locale;
  dir: Direction;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "en",
  dir: "ltr",
  setLocale: () => {},
  t: en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "fr" || stored === "ar") {
      setLocaleState(stored);
    }
  }, []);

  useEffect(() => {
    const dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const dir: Direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider
      value={{ locale, dir, setLocale, t: allTranslations[locale] }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
