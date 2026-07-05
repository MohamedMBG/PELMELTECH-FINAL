"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  MessageSquareQuote,
  Users,
  ArrowLeft,
  Plus,
  X,
  LogOut,
} from "lucide-react";
import { useLanguage } from "@/i18n";
import { useAdmin } from "@/components/admin/AdminContext";
import type { Permission } from "@/lib/admin-types";

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const { user, can } = useAdmin();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const NAV_ITEMS: { label: string; href: string; icon: typeof LayoutDashboard; perm?: Permission }[] = [
    { label: t.admin.dashboard, href: "/admin", icon: LayoutDashboard },
    { label: t.admin.products, href: "/admin/products", icon: Package, perm: "products" },
    { label: t.admin.categories, href: "/admin/categories", icon: FolderTree, perm: "categories" },
    { label: t.admin.quoteRequests, href: "/admin/quotes", icon: MessageSquareQuote, perm: "quotes" },
    { label: t.admin.users, href: "/admin/users", icon: Users, perm: "users" },
  ];
  const navItems = NAV_ITEMS.filter((item) => !item.perm || can(item.perm));

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-[260px] bg-white border-r border-black/[0.06] z-50 flex flex-col transition-transform duration-200 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 pb-4 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2" onClick={onClose}>
            <span className="w-1.5 h-7 bg-magenta block rounded-sm" />
            <span className="text-lg font-extrabold tracking-tighter text-on-surface">
              PELMEL<span className="text-cyan">TECH</span>
            </span>
          </Link>
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg hover:bg-black/5 text-on-surface-variant"
          >
            <X size={18} />
          </button>
        </div>
        <p className="px-6 text-[10px] font-bold tracking-[0.14em] uppercase text-on-surface-variant/50 mb-3">
          {t.admin.managementPortal}
        </p>

        <nav className="flex-1 overflow-y-auto px-3 space-y-0.5">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-all ${
                  active
                    ? "bg-on-surface text-white"
                    : "text-on-surface-variant hover:bg-black/[0.04]"
                }`}
              >
                <item.icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                {item.label}
              </Link>
            );
          })}

          {can("products") && (
            <div className="pt-4 pb-2">
              <p className="px-3 text-[10px] font-bold tracking-[0.14em] uppercase text-on-surface-variant/50 mb-2">
                {t.admin.quickActions}
              </p>
              <Link
                href="/admin/products/new"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold text-cyan-dark hover:bg-cyan/5 transition-all"
              >
                <Plus size={18} />
                {t.admin.addProduct}
              </Link>
            </div>
          )}
        </nav>

        {user && (
          <div className="px-4 pt-3 pb-1">
            <div className="flex items-center gap-2.5 px-2">
              <div className="w-8 h-8 rounded-full bg-on-surface text-white flex items-center justify-center text-xs font-bold shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-on-surface truncate">{user.name}</p>
                <p className="text-[10px] font-bold uppercase tracking-wide text-on-surface-variant/60">
                  {user.role === "superadmin" ? t.admin.superadmin : t.admin.member}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 border-t border-black/[0.06] space-y-0.5">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px] font-semibold text-on-surface-variant hover:bg-black/[0.04] transition-all"
          >
            <ArrowLeft size={16} />
            {t.admin.backToWebsite}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px] font-semibold text-on-surface-variant hover:bg-red-50 hover:text-red-500 transition-all"
          >
            <LogOut size={16} />
            {t.admin.logOut}
          </button>
        </div>
      </aside>
    </>
  );
}
