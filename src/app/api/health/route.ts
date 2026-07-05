import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "pelmeltech-api",
    hasDb: Boolean(process.env.DATABASE_URL),
    timestamp: new Date().toISOString(),
  });
}
