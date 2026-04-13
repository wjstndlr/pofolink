"use client";

import { ArrowRight, Sparkles, Link2, Clock } from "lucide-react";
import PdfDropZone from "@/components/service/PdfDropZone";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="font-display text-xl font-bold text-foreground">
            PoFoLink
          </h1>
          <p className="text-xs text-muted-foreground hidden sm:block">
            5분 만에 웹 포트폴리오 만들기
          </p>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-5xl mx-auto px-6">
        <section className="py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            AI 기반 포트폴리오 자동 생성
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            이력서 하나로
            <br />
            <span className="text-accent">웹 포트폴리오</span>를 만드세요
          </h2>

          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            PDF 이력서를 업로드하면, AI가 자동으로 내용을 분석하고
            <br className="hidden sm:block" />
            고퀄리티 웹 포트폴리오로 변환해 드립니다.
          </p>

          <PdfDropZone />
        </section>

        {/* Features */}
        <section className="py-16 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                AI 자동 분석
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                이력서 텍스트를 AI가 자동으로 추출하고 프로필, 프로젝트, 기술 스택으로 구조화합니다.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                5분 완성
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI가 채워둔 내용을 간단히 검수하고, 사진만 추가하면 포트폴리오가 완성됩니다.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Link2 className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                고유 URL 발급
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                나만의 고유 링크가 발급되어 언제든 공유하고 업데이트할 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 border-t">
          <h3 className="font-display text-2xl font-bold text-foreground text-center mb-12">
            이렇게 사용합니다
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "이력서 업로드",
                desc: "PDF 이력서를 드래그 앤 드롭으로 업로드하세요.",
              },
              {
                step: "2",
                title: "내용 검수 & 사진 추가",
                desc: "AI가 정리한 데이터를 확인하고 프로젝트 사진을 추가하세요.",
              },
              {
                step: "3",
                title: "URL 발행",
                desc: "나만의 웹 포트폴리오 링크를 생성하고 공유하세요.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex flex-col items-center text-center p-6 rounded-xl border bg-card"
              >
                <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm mb-4">
                  {item.step}
                </div>
                <h4 className="font-display font-semibold text-foreground mb-2">
                  {item.title}
                </h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} PoFoLink. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
}
