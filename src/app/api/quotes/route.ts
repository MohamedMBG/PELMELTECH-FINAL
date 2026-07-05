import { NextResponse } from "next/server";
import { getQuotes, createQuote } from "@/lib/server-store";

export async function GET() {
  return NextResponse.json(await getQuotes());
}

export async function POST(req: Request) {
  const data = await req.json();
  // Trust boundary: public contact form. Require the essentials.
  if (!data.customerName || !data.email) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }
  const quote = await createQuote({
    customerName: String(data.customerName).slice(0, 200),
    email: String(data.email).slice(0, 200),
    phone: String(data.phone || "").slice(0, 60),
    productName: String(data.productName || "General inquiry").slice(0, 200),
    message: String(data.message || "").slice(0, 4000),
  });
  return NextResponse.json(quote, { status: 201 });
}
