import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    service: "VidyaSathi AI Engine",
    version: "1.0.0",
    hackathon: "PRASUNEX INNOVATHON 2026",
    team: "Dynamic Duo",
    timestamp: new Date().toISOString(),
  });
}
