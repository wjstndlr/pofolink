"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { usePortfolioStore } from "@/store/portfolioStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, Eye, Pencil, Rocket, GripVertical } from "lucide-react";
import ProfileForm from "@/components/service/workspace/ProfileForm";
import AboutForm from "@/components/service/workspace/AboutForm";
import SkillsForm from "@/components/service/workspace/SkillsForm";
import ProjectForm from "@/components/service/workspace/ProjectForm";
import ActivityForm from "@/components/service/workspace/ActivityForm";
import ContactForm from "@/components/service/workspace/ContactForm";
import PortfolioTemplate from "@/components/portfolio/PortfolioTemplate";

export default function WorkspacePage() {
  const data = usePortfolioStore((s) => s.data);
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
  const [leftWidth, setLeftWidth] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMouseDown = useCallback(() => {
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const percent = ((e.clientX - rect.left) / rect.width) * 100;
      setLeftWidth(Math.max(25, Math.min(75, percent)));
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, []);

  const editPanel = (
    <div className="p-4">
      <Accordion type="multiple" defaultValue={["profile", "projects"]} className="space-y-2">
        <AccordionItem value="profile" className="border rounded-lg px-3">
          <AccordionTrigger className="text-sm font-medium py-3">
            기본 정보
          </AccordionTrigger>
          <AccordionContent>
            <ProfileForm />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="about" className="border rounded-lg px-3">
          <AccordionTrigger className="text-sm font-medium py-3">
            소개 & 경력
          </AccordionTrigger>
          <AccordionContent>
            <AboutForm />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="skills" className="border rounded-lg px-3">
          <AccordionTrigger className="text-sm font-medium py-3">
            기술 스택
          </AccordionTrigger>
          <AccordionContent>
            <SkillsForm />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="projects" className="border rounded-lg px-3">
          <AccordionTrigger className="text-sm font-medium py-3">
            프로젝트 ({data.projects.length})
          </AccordionTrigger>
          <AccordionContent>
            <ProjectForm />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="activities" className="border rounded-lg px-3">
          <AccordionTrigger className="text-sm font-medium py-3">
            활동 내역 ({data.activities.length})
          </AccordionTrigger>
          <AccordionContent>
            <ActivityForm />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="contact" className="border rounded-lg px-3">
          <AccordionTrigger className="text-sm font-medium py-3">
            연락처
          </AccordionTrigger>
          <AccordionContent>
            <ContactForm />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  const previewPanel = (
    <PortfolioTemplate data={data} isPreview />
  );

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="h-14 border-b bg-background flex items-center justify-between px-4 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" /> 돌아가기
            </Button>
          </Link>
          <h1 className="font-display text-sm font-semibold text-foreground hidden sm:block">
            워크스페이스
          </h1>
        </div>

        {/* Mobile tab toggle */}
        <div className="flex md:hidden items-center gap-1 bg-secondary rounded-lg p-0.5">
          <button
            onClick={() => setMobileTab("edit")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              mobileTab === "edit"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            <Pencil className="w-3 h-3" /> 편집
          </button>
          <button
            onClick={() => setMobileTab("preview")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              mobileTab === "preview"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            <Eye className="w-3 h-3" /> 미리보기
          </button>
        </div>

        <Link href="/publish">
          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Rocket className="w-3.5 h-3.5 mr-1.5" /> 발행하기
          </Button>
        </Link>
      </header>

      {/* Desktop: Split View with drag handle */}
      <div ref={containerRef} className="hidden md:flex flex-1 overflow-hidden">
        {/* Left: Edit */}
        <div style={{ width: `${leftWidth}%` }} className="h-full overflow-hidden shrink-0">
          <ScrollArea className="h-full">
            {editPanel}
          </ScrollArea>
        </div>

        {/* Drag Handle */}
        <div
          onMouseDown={handleMouseDown}
          className="w-2 shrink-0 bg-border hover:bg-accent/30 cursor-col-resize flex items-center justify-center transition-colors"
        >
          <GripVertical className="w-3 h-3 text-muted-foreground" />
        </div>

        {/* Right: Preview */}
        <div className="flex-1 h-full overflow-hidden flex flex-col">
          <div className="h-10 border-b flex items-center justify-center gap-2 shrink-0 bg-secondary/30">
            <Eye className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">미리보기</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {previewPanel}
          </div>
        </div>
      </div>

      {/* Mobile: Tab View */}
      <div className="flex md:hidden flex-1 overflow-hidden">
        {mobileTab === "edit" ? (
          <ScrollArea className="flex-1">
            {editPanel}
          </ScrollArea>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {previewPanel}
          </div>
        )}
      </div>
    </div>
  );
}
