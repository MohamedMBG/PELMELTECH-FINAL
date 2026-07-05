import { NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/server-store";

export async function GET() {
  return NextResponse.json(await getProducts());
}

export async function POST(req: Request) {
  const data = await req.json();
  return NextResponse.json(await createProduct(data), { status: 201 });
}
