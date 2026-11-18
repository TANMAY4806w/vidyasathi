import { NextRequest, NextResponse } from "next/server";
import { GeminiCopilot, IEPGenerationInput } from "@/lib/ai/geminiCopilot";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { assessmentId, studentName, studentGrade, studentAge, indices, preferredLanguage } = body;

    if (!indices) {
      return NextResponse.json(
        { error: "Missing required 'indices' diagnostic object" },
        { status: 400 }
      );
    }

    const input: IEPGenerationInput = {
      assessmentId: assessmentId || `asmt_${Math.random().toString(36).substring(2, 9)}`,
      studentName: studentName || "Student",
      studentGrade: Number(studentGrade) || 3,
      studentAge: Number(studentAge) || 8,
      indices,
      preferredLanguage: preferredLanguage || "bilingual",
    };

    const result = await GeminiCopilot.generate(input);

    return NextResponse.json({
      status: "success",
      engine: result.source,
      latencyMs: result.latencyMs,
      iepPlan: result.iep,
    });
  } catch (err) {
    console.error("Error generating IEP plan:", err);
    return NextResponse.json(
      { error: "Internal server error generating IEP plan" },
      { status: 500 }
    );
  }
}
