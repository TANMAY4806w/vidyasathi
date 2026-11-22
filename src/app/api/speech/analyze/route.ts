import { NextRequest, NextResponse } from "next/server";
import { AssemblyAiSpeechService } from "@/lib/audio/assemblyAiService";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { audioBase64 } = body;

    if (!audioBase64) {
      return NextResponse.json(
        { error: "Missing required 'audioBase64' string" },
        { status: 400 }
      );
    }

    const analysis = await AssemblyAiSpeechService.analyzeAudio(audioBase64);

    return NextResponse.json({
      status: "success",
      analysis,
    });
  } catch (err) {
    console.error("AssemblyAI route error:", err);
    return NextResponse.json(
      { error: "Internal server error analyzing speech audio" },
      { status: 500 }
    );
  }
}
