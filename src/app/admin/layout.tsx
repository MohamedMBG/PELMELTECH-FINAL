"use client";

import { usePathname } from "next/navigation";
import { AdminProvider, useAdmin } from "@/components/admin/AdminContext";
import AdminSidebar from "@/components/admin/AdminSidebar";

function AdminShell({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, closeSidebar } = useAdmin();

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex">
      <AdminSidebar open={sidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 md:ml-[260px] flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
}

/**
 * Access is gated by middleware.ts (HMAC session cookie). The login route
 * renders without the admin chrome.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return <>{children}</>;
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
