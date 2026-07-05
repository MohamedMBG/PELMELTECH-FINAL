"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { getMe } from "@/lib/admin-store";
import type { AdminUser, Permission } from "@/lib/admin-types";

interface AdminContextValue {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  user: AdminUser | null;
  can: (perm: Permission) => boolean;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  useEffect(() => {
    getMe().then(setUser).catch(() => setUser(null));
  }, []);

  const can = useCallback(
    (perm: Permission) => !!user && (user.role === "superadmin" || user.permissions.includes(perm)),
    [user],
  );

  return (
    <AdminContext.Provider value={{ sidebarOpen, toggleSidebar, closeSidebar, user, can }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
