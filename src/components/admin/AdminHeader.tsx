"use client";

import { Menu, Bell } from "lucide-react";
import { useAdmin } from "./AdminContext";
import { useLanguage, type Locale } from "@/i18n";

const LOCALE_OPTIONS: { value: Locale; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "fr", label: "FR" },
  { value: "ar", label: "AR" },
];

interface AdminHeaderProps {
  title: string;
  actions?: React.ReactNode;
}

export default function AdminHeader({ title, actions }: AdminHeaderProps) {
  const { toggleSidebar } = useAdmin();
  const { locale, setLocale } = useLanguage();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-black/[0.06] h-16 flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-lg hover:bg-black/5 text-on-surface-variant"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-bold tracking-tight text-on-surface">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <div className="hidden sm:flex items-center bg-surface-container-low rounded-full border border-black/[0.06] p-0.5">
          {LOCALE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
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
        <button className="p-2 rounded-lg hover:bg-black/5 text-on-surface-variant relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-magenta rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-on-surface text-white flex items-center justify-center text-xs font-bold">
          A
        </div>
      </div>
    </header>
  );
}
