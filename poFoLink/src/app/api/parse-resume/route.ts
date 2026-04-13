import { NextRequest, NextResponse } from "next/server";
import { geminiModel } from "@/lib/gemini";
import { RESUME_PARSE_PROMPT } from "@/lib/prompts";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 });
    }

    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 15MB)" }, { status: 400 });
    }

    // PDF를 base64로 변환하여 Gemini에 직접 전달
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    const result = await geminiModel.generateContent([
      RESUME_PARSE_PROMPT,
      {
        inlineData: {
          mimeType: "application/pdf",
          data: base64Data,
        },
      },
    ]);

    const responseText = result.response.text();
    if (!responseText) {
      return NextResponse.json(
        { error: "AI failed to parse the resume" },
        { status: 500 }
      );
    }

    // JSON 파싱 (Gemini가 가끔 ```json 블록으로 감싸는 경우 처리)
    let cleanJson = responseText.trim();
    if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const portfolioData = JSON.parse(cleanJson);

    return NextResponse.json({ data: portfolioData });
  } catch (error: any) {
    console.error("Parse resume error:", error);
    const message = error?.message || String(error);
    return NextResponse.json(
      { error: `파싱 실패: ${message}` },
      { status: 500 }
    );
  }
}
