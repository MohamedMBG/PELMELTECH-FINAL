"use client";

import { use } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import ProductForm from "@/components/admin/ProductForm";
import { useLanguage } from "@/i18n";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useLanguage();

  return (
    <>
      <AdminHeader title={t.admin.editProduct} />
      <ProductForm productId={id} />
    </>
  );
}
