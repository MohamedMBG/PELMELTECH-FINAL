"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User } from "lucide-react";
import { useLanguage, type Locale } from "@/i18n";

const LOCALE_OPTIONS: { value: Locale; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "fr", label: "FR" },
  { value: "ar", label: "AR" },
];

export default function AdminLoginPage() {
  const router = useRouter();
  const { locale, setLocale, t } = useLanguage();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error();
      const from = new URLSearchParams(window.location.search).get("from");
      router.replace(from && from.startsWith("/admin") ? from : "/admin");
      router.refresh();
    } catch {
      setError(t.admin.invalidCredentials);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb] p-4">
      <div className="absolute top-4 right-4 flex items-center bg-white rounded-full border border-black/[0.06] p-0.5 shadow-sm">
        {LOCALE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setLocale(opt.value)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-[0.08em] transition-all ${
              locale === opt.value
                ? "bg-on-surface text-white"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-2xl border border-black/[0.06] shadow-xl p-8 space-y-6">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-7 bg-magenta block rounded-sm" />
          <span className="text-lg font-extrabold tracking-tighter text-on-surface">
            PELMEL<span className="text-cyan">TECH</span>
          </span>
        </div>

        <div>
          <h1 className="text-xl font-extrabold text-on-surface">{t.admin.adminLogin}</h1>
          <p className="text-sm text-on-surface-variant mt-1">{t.admin.loginHelp}</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-on-surface-variant">{t.admin.username}</label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40" />
            <input
              type="text"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white border border-black/[0.08] rounded-lg pl-9 pr-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-cyan/30 transition-all"
              placeholder="admin"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-on-surface-variant">{t.admin.password}</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-white border rounded-lg pl-9 pr-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-cyan/30 transition-all ${
                error ? "border-red-400" : "border-black/[0.08]"
              }`}
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-on-surface text-white py-2.5 rounded-lg text-sm font-bold hover:bg-on-surface/90 transition-colors disabled:opacity-60"
        >
          {loading ? t.admin.signingIn : t.admin.signIn}
        </button>
      </form>
    </div>
  );
}
