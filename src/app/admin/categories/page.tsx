"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Save, FolderTree } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import EmptyState from "@/components/admin/EmptyState";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/admin-store";
import type { AdminCategory } from "@/lib/admin-types";

type FormData = {
  name: string;
  description: string;
  imageUrl: string;
  parentId: string;
  sortOrder: string;
  status: "published" | "hidden";
};

const EMPTY_FORM: FormData = {
  name: "",
  description: "",
  imageUrl: "",
  parentId: "",
  sortOrder: "0",
  status: "published",
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    setCategories(getCategories());
  }, []);

  function refresh() {
    setCategories(getCategories());
  }

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditing(null);
    setShowForm(true);
    setFormError("");
  }

  function openEdit(cat: AdminCategory) {
    setForm({
      name: cat.name,
      description: cat.description,
      imageUrl: cat.imageUrl,
      parentId: cat.parentId || "",
      sortOrder: cat.sortOrder.toString(),
      status: cat.status,
    });
    setEditing(cat.id);
    setShowForm(true);
    setFormError("");
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setFormError("");
  }

  function handleSave() {
    if (!form.name.trim()) {
      setFormError("Category name is required");
      return;
    }

    const data = {
      name: form.name.trim(),
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim(),
      parentId: form.parentId || null,
      sortOrder: parseInt(form.sortOrder) || 0,
      status: form.status,
    };

    if (editing) {
      updateCategory(editing, data);
      setToast("Category updated");
    } else {
      createCategory(data);
      setToast("Category created");
    }

    refresh();
    closeForm();
    setTimeout(() => setToast(""), 2500);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deleteCategory(deleteTarget.id);
    refresh();
    setDeleteTarget(null);
    setToast("Category deleted");
    setTimeout(() => setToast(""), 2500);
  }

  const parentOptions = categories.filter((c) => c.id !== editing);

  return (
    <>
      <AdminHeader
        title="Categories"
        actions={
          <button
            onClick={openAdd}
            className="hidden sm:inline-flex items-center gap-2 bg-on-surface text-white px-4 py-2 rounded-lg text-xs font-bold tracking-wide uppercase hover:bg-on-surface/90 transition-colors"
          >
            <Plus size={14} />
            Add Category
          </button>
        }
      />

      <div className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto">
        <button
          onClick={openAdd}
          className="sm:hidden flex items-center justify-center gap-2 bg-on-surface text-white px-4 py-2.5 rounded-lg text-xs font-bold tracking-wide uppercase w-full"
        >
          <Plus size={14} />
          Add Category
        </button>

        {/* Inline form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-on-surface">
                {editing ? "Edit Category" : "New Category"}
              </h2>
              <button onClick={closeForm} className="p-1.5 rounded-lg hover:bg-black/5 text-on-surface-variant">
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); setFormError(""); }}
                  placeholder="e.g. Printing Machines"
                  className={`w-full bg-white border rounded-lg px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-cyan/30 transition-all ${
                    formError ? "border-red-400" : "border-black/[0.08]"
                  }`}
                />
                {formError && <p className="text-xs text-red-500">{formError}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as "published" | "hidden" }))}
                  className="w-full bg-white border border-black/[0.08] rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-cyan/30 appearance-none cursor-pointer"
                >
                  <option value="published">Published</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Short description of this category"
                  className="w-full bg-white border border-black/[0.08] rounded-lg px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-cyan/30 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Parent Category</label>
                <select
                  value={form.parentId}
                  onChange={(e) => setForm((f) => ({ ...f, parentId: e.target.value }))}
                  className="w-full bg-white border border-black/[0.08] rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-cyan/30 appearance-none cursor-pointer"
                >
                  <option value="">None (top-level)</option>
                  {parentOptions.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Sort Order</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
                  className="w-full bg-white border border-black/[0.08] rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-cyan/30 transition-all"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-black/[0.04]">
              <button
                onClick={closeForm}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-on-surface-variant hover:bg-black/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 bg-on-surface text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-on-surface/90 transition-colors"
              >
                <Save size={14} />
                {editing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        )}

        {/* Category list */}
        {categories.length === 0 ? (
          <EmptyState
            icon={FolderTree}
            title="No categories yet"
            description="Create your first category to organize products."
          />
        ) : (
          <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="border-b border-black/[0.06] bg-[#f8f9fb] text-[10px] font-bold tracking-[0.1em] uppercase text-on-surface-variant/60">
                    <th className="py-3 px-5">Name</th>
                    <th className="py-3 px-5">Description</th>
                    <th className="py-3 px-5 text-center">Status</th>
                    <th className="py-3 px-5 text-center">Order</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-black/[0.04]">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-[#f8f9fb] transition-colors">
                      <td className="py-3 px-5 font-semibold text-on-surface">
                        {cat.parentId && <span className="text-on-surface-variant/40 mr-1">&mdash;</span>}
                        {cat.name}
                      </td>
                      <td className="py-3 px-5 text-on-surface-variant truncate max-w-[240px]">
                        {cat.description || <span className="text-on-surface-variant/30 italic">No description</span>}
                      </td>
                      <td className="py-3 px-5 text-center">
                        <StatusBadge status={cat.status} />
                      </td>
                      <td className="py-3 px-5 text-center text-on-surface-variant font-mono text-xs">
                        {cat.sortOrder}
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => openEdit(cat)}
                            className="p-2 rounded-lg hover:bg-black/5 text-on-surface-variant transition-colors"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(cat)}
                            className="p-2 rounded-lg hover:bg-red-50 text-on-surface-variant hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? Products in this category will need to be reassigned.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {toast && (
        <div className="fixed bottom-6 right-6 bg-on-surface text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-lg z-50">
          {toast}
        </div>
      )}
    </>
  );
}
