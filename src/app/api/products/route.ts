import { NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/server-store";
import { hasPerm, forbidden } from "@/lib/session";

// Database-backed: never statically evaluate at build (fail-closed on DB).
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getProducts());
}

export async function POST(req: Request) {
  if (!(await hasPerm("products"))) return forbidden();
  const data = await req.json();
  return NextResponse.json(await createProduct(data), { status: 201 });
}
