import { NextResponse } from "next/server";
import { getCategories, createCategory } from "@/lib/server-store";

export async function GET() {
  return NextResponse.json(await getCategories());
}

export async function POST(req: Request) {
  const data = await req.json();
  return NextResponse.json(await createCategory(data), { status: 201 });
}
