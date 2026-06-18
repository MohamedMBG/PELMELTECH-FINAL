"use client";

import { use } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import ProductForm from "@/components/admin/ProductForm";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <>
      <AdminHeader title="Edit Product" />
      <ProductForm productId={id} />
    </>
  );
}
