"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  MessageSquareQuote,
  ArrowLeft,
  Plus,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Quote Requests", href: "/admin/quotes", icon: MessageSquareQuote },
];

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

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
          Management Portal
        </p>

        <nav className="flex-1 overflow-y-auto px-3 space-y-0.5">
          {NAV_ITEMS.map((item) => {
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

          <div className="pt-4 pb-2">
            <p className="px-3 text-[10px] font-bold tracking-[0.14em] uppercase text-on-surface-variant/50 mb-2">
              Quick Actions
            </p>
            <Link
              href="/admin/products/new"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold text-cyan-dark hover:bg-cyan/5 transition-all"
            >
              <Plus size={18} />
              Add Product
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-black/[0.06]">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px] font-semibold text-on-surface-variant hover:bg-black/[0.04] transition-all"
          >
            <ArrowLeft size={16} />
            Back to Website
          </Link>
        </div>
      </aside>
    </>
  );
}
