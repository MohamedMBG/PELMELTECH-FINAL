"use client";

import AdminHeader from "@/components/admin/AdminHeader";
import ProductForm from "@/components/admin/ProductForm";
import { useLanguage } from "@/i18n";

export default function NewProductPage() {
  const { t } = useLanguage();

  return (
    <>
      <AdminHeader title={t.admin.addProduct} />
      <ProductForm />
    </>
  );
}
