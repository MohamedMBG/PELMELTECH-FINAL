"use client";

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
 * TODO: Add real admin authentication before production.
 * Currently unprotected for demo purposes.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
