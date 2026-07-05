import { NextResponse } from "next/server";
import { getProduct, updateProduct, deleteProduct } from "@/lib/server-store";
import { hasPerm, forbidden } from "@/lib/session";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: Request, { params }: Ctx) {
  if (!(await hasPerm("products"))) return forbidden();
  const { id } = await params;
  const data = await req.json();
  const updated = await updateProduct(id, data);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await hasPerm("products"))) return forbidden();
  const { id } = await params;
  return NextResponse.json({ ok: await deleteProduct(id) });
}
