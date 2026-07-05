"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
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
        body: JSON.stringify({ password }),
      });
      if (!res.ok) throw new Error();
      const from = new URLSearchParams(window.location.search).get("from");
      router.replace(from && from.startsWith("/admin") ? from : "/admin");
      router.refresh();
    } catch {
      setError("Invalid password");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb] p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-2xl border border-black/[0.06] shadow-xl p-8 space-y-6">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-7 bg-magenta block rounded-sm" />
          <span className="text-lg font-extrabold tracking-tighter text-on-surface">
            PELMEL<span className="text-cyan">TECH</span>
          </span>
        </div>

        <div>
          <h1 className="text-xl font-extrabold text-on-surface">Admin Login</h1>
          <p className="text-sm text-on-surface-variant mt-1">Enter your password to continue.</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-on-surface-variant">Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40" />
            <input
              type="password"
              autoFocus
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
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
