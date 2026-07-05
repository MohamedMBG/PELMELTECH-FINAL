import { NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/server-store";
import { hasPerm, forbidden } from "@/lib/session";

export async function GET() {
  return NextResponse.json(await getProducts());
}

export async function POST(req: Request) {
  if (!(await hasPerm("products"))) return forbidden();
  const data = await req.json();
  return NextResponse.json(await createProduct(data), { status: 201 });
}
