"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2, Pencil, ShieldCheck, X, Lock } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAdmin } from "@/components/admin/AdminContext";
import { getUsers, createUser, updateUser, deleteUser, type NewUser } from "@/lib/admin-store";
import { ALL_PERMISSIONS, type AdminUser, type Permission } from "@/lib/admin-types";
import { useLanguage } from "@/i18n";

const emptyForm: NewUser = { username: "", name: "", password: "", role: "member", permissions: [] };

export default function AdminUsersPage() {
  const { user: me, can } = useAdmin();
  const { t } = useLanguage();
  const permLabels: Record<Permission, string> = {
    products: t.admin.products,
    categories: t.admin.categories,
    quotes: t.admin.quoteRequests,
    users: t.admin.userManagement,
  };
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<AdminUser | "new" | null>(null);

  const load = useCallback(
    () => getUsers().then(setUsers).catch(() => setError(t.admin.loadUsersFailed)),
    [t.admin.loadUsersFailed],
  );
  useEffect(() => {
    if (can("users")) load();
  }, [can, load]);

  if (!can("users")) {
    return (
      <>
        <AdminHeader title={t.admin.users} />
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <p className="text-sm text-on-surface-variant">{t.admin.noUserPermission}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader
        title={t.admin.users}
        actions={
          <button
            onClick={() => setEditing("new")}
            className="inline-flex items-center gap-1.5 bg-on-surface text-white px-3.5 py-2 rounded-lg text-xs font-bold hover:bg-on-surface/90 transition-colors"
          >
            <Plus size={15} /> {t.admin.addUser}
          </button>
        }
      />
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[560px]">
              <thead>
                <tr className="text-[10px] font-bold tracking-[0.1em] uppercase text-on-surface-variant/60 border-b border-black/[0.06]">
                  <th className="py-3 px-5">{t.admin.user}</th>
                  <th className="py-3 px-5">{t.admin.role}</th>
                  <th className="py-3 px-5">{t.admin.permissions}</th>
                  <th className="py-3 px-5 text-right">{t.admin.actions}</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {users === null ? (
                  <tr><td colSpan={4} className="py-10 text-center text-on-surface-variant/50">{t.admin.loading}</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={4} className="py-10 text-center text-on-surface-variant/50">{t.admin.noAdditionalUsers}</td></tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="border-t border-black/[0.04]">
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-xs font-bold text-on-surface shrink-0">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-on-surface truncate">{u.name}</p>
                            <p className="text-xs text-on-surface-variant truncate">@{u.username}{me?.id === u.id && ` · ${t.admin.you}`}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-5">
                        {u.role === "superadmin" ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-magenta">
                            <ShieldCheck size={13} /> {t.admin.superadmin}
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-on-surface-variant">{t.admin.member}</span>
                        )}
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex flex-wrap gap-1">
                          {u.role === "superadmin" ? (
                            <span className="text-xs text-on-surface-variant">{t.admin.allAccess}</span>
                          ) : u.permissions.length === 0 ? (
                            <span className="text-xs text-on-surface-variant/50">{t.admin.none}</span>
                          ) : (
                            u.permissions.map((p) => (
                              <span key={p} className="text-[10px] font-semibold bg-black/[0.04] text-on-surface-variant px-2 py-0.5 rounded-full">
                                {permLabels[p]}
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setEditing(u)} className="p-2 rounded-lg hover:bg-black/5 text-on-surface-variant" title={t.admin.edit}>
                            <Pencil size={15} />
                          </button>
                          {me?.id !== u.id && (
                            <button
                              onClick={async () => {
                                if (!confirm(t.admin.deleteUserConfirm.replace("{name}", u.name))) return;
                                await deleteUser(u.id);
                                load();
                              }}
                              className="p-2 rounded-lg hover:bg-red-50 text-on-surface-variant hover:text-red-500"
                              title={t.admin.delete}
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editing && (
        <UserForm
          user={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
          permLabels={permLabels}
        />
      )}
    </>
  );
}

function UserForm({ user, onClose, onSaved, permLabels }: { user: AdminUser | null; onClose: () => void; onSaved: () => void; permLabels: Record<Permission, string> }) {
  const { t } = useLanguage();
  const [form, setForm] = useState<NewUser>(
    user
      ? { username: user.username, name: user.name, password: "", role: user.role, permissions: user.permissions }
      : { ...emptyForm },
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const togglePerm = (p: Permission) =>
    setForm((f) => ({
      ...f,
      permissions: f.permissions.includes(p) ? f.permissions.filter((x) => x !== p) : [...f.permissions, p],
    }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (user) {
        await updateUser(user.id, {
          name: form.name,
          password: form.password || undefined,
          role: form.role,
          permissions: form.permissions,
        });
      } else {
        await createUser(form);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.admin.somethingWentWrong);
      setSaving(false);
    }
  }

  const isSuper = form.role === "superadmin";

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="w-full max-w-md bg-white rounded-2xl border border-black/[0.06] shadow-xl p-6 space-y-5 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-on-surface">{user ? t.admin.editUser : t.admin.newUser}</h2>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-black/5 text-on-surface-variant">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-on-surface-variant">{t.admin.username}</label>
          <input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            disabled={!!user}
            required
            className="w-full border border-black/[0.08] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan/30 disabled:bg-black/[0.03] disabled:text-on-surface-variant"
            placeholder="jdoe"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-on-surface-variant">{t.admin.displayName}</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-black/[0.08] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan/30"
            placeholder="Jane Doe"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-on-surface-variant flex items-center gap-1.5">
            <Lock size={12} /> {t.admin.password} {user && <span className="font-normal text-on-surface-variant/60">({t.admin.leaveBlankToKeep})</span>}
          </label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required={!user}
            minLength={6}
            className="w-full border border-black/[0.08] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan/30"
            placeholder={t.admin.minPassword}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-on-surface-variant">{t.admin.role}</label>
          <div className="flex gap-2">
            {(["member", "superadmin"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setForm({ ...form, role: r })}
                className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-colors ${
                  form.role === r ? "bg-on-surface text-white border-on-surface" : "border-black/[0.08] text-on-surface-variant hover:bg-black/[0.03]"
                }`}
              >
                {r === "member" ? t.admin.member : t.admin.superadmin}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-on-surface-variant">{t.admin.permissions}</label>
          {isSuper ? (
            <p className="text-xs text-on-surface-variant/70">{t.admin.superadminsFullAccess}</p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {ALL_PERMISSIONS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePerm(p)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold border text-left transition-colors ${
                    form.permissions.includes(p)
                      ? "bg-cyan/10 border-cyan/40 text-cyan-dark"
                      : "border-black/[0.08] text-on-surface-variant hover:bg-black/[0.03]"
                  }`}
                >
                  {permLabels[p]}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-on-surface text-white py-2.5 rounded-lg text-sm font-bold hover:bg-on-surface/90 transition-colors disabled:opacity-60"
        >
          {saving ? t.admin.saving : user ? t.admin.saveChanges : t.admin.createUserButton}
        </button>
      </form>
    </div>
  );
}
