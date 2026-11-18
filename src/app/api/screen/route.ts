import { NextRequest, NextResponse } from "next/server";
import { RiskEngine, RawScreeningTelemetry } from "@/lib/scoring/riskEngine";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { student, telemetry, assessmentId } = body;

    if (!telemetry) {
      return NextResponse.json(
        { error: "Missing required 'telemetry' payload" },
        { status: 400 }
      );
    }

    const riskProfile = RiskEngine.evaluate(telemetry as RawScreeningTelemetry, assessmentId);

    return NextResponse.json({
      student: student || { anonymousId: "stu_guest", grade: 3 },
      ...riskProfile,
    });
  } catch (err) {
    console.error("Error processing screening telemetry:", err);
    return NextResponse.json(
      { error: "Internal server error calculating screening percentiles" },
      { status: 500 }
    );
  }
}
