"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";
import { usePortfolioStore } from "@/store/portfolioStore";
import { useRouter } from "next/navigation";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { RESUME_PARSE_PROMPT } from "@/lib/prompts";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const PdfDropZone = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setPortfolioData, setParsing, isParsing } = usePortfolioStore();
  const router = useRouter();

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      if (!isPdf) {
        setError(`PDF 파일만 업로드 가능합니다. (선택된 파일 타입: ${file.type || "unknown"})`);
        return;
      }

      if (file.size > 15 * 1024 * 1024) {
        setError(`파일 크기가 너무 큽니다. (${(file.size / 1024 / 1024).toFixed(1)}MB / 최대 15MB)`);
        return;
      }

      setParsing(true);

      try {
        // PDF를 base64로 변환
        const arrayBuffer = await file.arrayBuffer();
        const base64Data = btoa(
          new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
        );

        // 클라이언트에서 직접 Gemini API 호출 (Vercel 4.5MB 제한 우회)
        const result = await model.generateContent([
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
          throw new Error("AI가 응답을 생성하지 못했습니다.");
        }

        // JSON 파싱 (Gemini가 ```json 블록으로 감싸는 경우 처리)
        let cleanJson = responseText.trim();
        if (cleanJson.startsWith("```")) {
          cleanJson = cleanJson.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
        }

        const data = JSON.parse(cleanJson);
        setPortfolioData(data);
        router.push("/workspace");
      } catch (err) {
        console.error("파싱 에러:", err);
        setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      } finally {
        setParsing(false);
      }
    },
    [setPortfolioData, setParsing, router]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  if (isParsing) {
    return (
      <div className="w-full max-w-lg mx-auto">
        <div className="flex flex-col items-center justify-center p-12 rounded-xl border-2 border-accent/30 bg-card">
          <Loader2 className="w-12 h-12 text-accent animate-spin mb-4" />
          <p className="text-lg font-semibold text-foreground mb-2">
            AI가 이력서를 분석하고 있습니다...
          </p>
          <p className="text-sm text-muted-foreground">약 10~30초 정도 소요됩니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`flex flex-col items-center justify-center p-12 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
          isDragging
            ? "border-accent bg-accent/5 scale-[1.02]"
            : "border-border hover:border-accent/50 hover:bg-secondary/50"
        }`}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleInputChange}
          className="hidden"
        />
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
          {isDragging ? (
            <FileText className="w-8 h-8 text-accent" />
          ) : (
            <Upload className="w-8 h-8 text-accent" />
          )}
        </div>
        <p className="text-lg font-semibold text-foreground mb-2">
          {isDragging ? "여기에 놓으세요!" : "이력서 PDF를 업로드하세요"}
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          드래그 앤 드롭 또는 클릭하여 파일 선택
        </p>
        <p className="text-xs text-muted-foreground/60">PDF 형식 · 최대 15MB</p>
      </label>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  );
};

export default PdfDropZone;
