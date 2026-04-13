"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePortfolioStore } from "@/store/portfolioStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Check,
  Copy,
  Loader2,
  Rocket,
  AlertCircle,
  Search,
} from "lucide-react";

export default function PublishPage() {
  const router = useRouter();
  const data = usePortfolioStore((s) => s.data);
  const publishedUrl = usePortfolioStore((s) => s.publishedUrl);
  const setPublishedUrl = usePortfolioStore((s) => s.setPublishedUrl);

  const [username, setUsername] = useState("");
  const [available, setAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [validationMsg, setValidationMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndCheck = async () => {
    const raw = inputRef.current?.value || "";
    const cleaned = raw.toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/^-+|-+$/g, "");

    if (!cleaned) {
      setValidationMsg("영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.");
      setAvailable(null);
      return;
    }

    if (cleaned !== raw) {
      setUsername(cleaned);
      if (inputRef.current) inputRef.current.value = cleaned;
      setValidationMsg(`"${cleaned}"(으)로 자동 변환되었습니다.`);
    } else {
      setUsername(cleaned);
      setValidationMsg("");
    }

    if (cleaned.length < 3) {
      setValidationMsg("3자 이상 입력해주세요.");
      setAvailable(null);
      return;
    }

    if (cleaned.length > 30) {
      setValidationMsg("30자 이하로 입력해주세요.");
      setAvailable(null);
      return;
    }

    setChecking(true);
    setAvailable(null);
    try {
      const res = await fetch(`/api/check-username?username=${cleaned}`);
      const { available: isAvailable } = await res.json();
      setAvailable(isAvailable);
    } catch {
      setError("확인 중 오류가 발생했습니다.");
    } finally {
      setChecking(false);
    }
  };

  const handlePublish = async () => {
    if (!available || !username) return;
    setPublishing(true);
    setError(null);

    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, data, sessionToken }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "발행에 실패했습니다.");
      }

      const result = await res.json();
      setPublishedUrl(result.url);
      setSessionToken(result.sessionToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setPublishing(false);
    }
  };

  const copyUrl = () => {
    if (publishedUrl) {
      navigator.clipboard.writeText(window.location.origin + publishedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 발행 완료 화면
  if (publishedUrl) {
    const fullUrl = typeof window !== "undefined" ? window.location.origin + publishedUrl : publishedUrl;

    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            포트폴리오가 발행되었습니다!
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            아래 링크로 포트폴리오를 공유하세요.
          </p>

          <div className="flex items-center gap-2 p-3 rounded-lg border bg-card mb-6">
            <code className="flex-1 text-sm text-foreground truncate text-left">
              {fullUrl}
            </code>
            <Button variant="outline" size="sm" onClick={copyUrl}>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </Button>
          </div>

          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => router.push("/workspace")}>
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> 수정하기
            </Button>
            <Button
              onClick={() => window.open(publishedUrl, "_blank")}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              포트폴리오 보기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 발행 입력 화면
  return (
    <div className="min-h-screen bg-background">
      <header className="h-14 border-b bg-background flex items-center px-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/workspace")}>
          <ArrowLeft className="w-4 h-4 mr-1" /> 워크스페이스로
        </Button>
      </header>

      <div className="max-w-md mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <Rocket className="w-10 h-10 text-accent mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            포트폴리오 발행
          </h2>
          <p className="text-sm text-muted-foreground">
            나만의 URL을 만들어 포트폴리오를 공유하세요.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="username">사용자명 입력</Label>
            <p className="text-xs text-muted-foreground mt-1 mb-3">
              영문 소문자, 숫자, 하이픈(-) 사용 가능 · 3~30자
            </p>

            <div className="flex gap-2">
              <input
                ref={inputRef}
                id="username"
                type="text"
                defaultValue=""
                placeholder="예: hong-gildong"
                className="flex-1 h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                autoComplete="off"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    validateAndCheck();
                  }
                }}
              />
              <Button
                variant="outline"
                onClick={validateAndCheck}
                disabled={checking}
                className="shrink-0"
              >
                {checking ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-1" /> 확인
                  </>
                )}
              </Button>
            </div>

            {/* 미리보기 URL */}
            {username && (
              <p className="text-xs text-accent mt-2">
                {window.location.origin}/p/<strong>{username}</strong>
              </p>
            )}

            {/* 상태 메시지 */}
            <div className="mt-2 text-xs">
              {validationMsg && !available && (
                <span className="text-muted-foreground">{validationMsg}</span>
              )}
              {available === true && (
                <span className="text-green-600 flex items-center gap-1">
                  <Check className="w-3 h-3" /> "{username}" 사용 가능합니다!
                </span>
              )}
              {available === false && !checking && username.length >= 3 && (
                <span className="text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> 이미 사용 중인 이름입니다. 다른 이름을 시도해주세요.
                </span>
              )}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <Button
            onClick={handlePublish}
            disabled={!available || publishing}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {publishing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 발행 중...
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4 mr-2" /> URL 생성하기
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
