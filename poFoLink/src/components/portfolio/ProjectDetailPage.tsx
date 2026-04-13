"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowUp, Calendar, User, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { ProjectData } from "@/types/portfolio";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "./LanguageToggle";
import ThemeToggle from "./ThemeToggle";

interface ProjectDetailPageProps {
  project: ProjectData;
  username: string;
  ownerName: string;
}

const ProjectDetailContent = ({ project, username, ownerName }: ProjectDetailPageProps) => {
  const { t } = useLanguage();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="bg-card border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <a
            href={`/p/${username}#projects`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("홈으로", "Back to Home")}
          </a>
          <div className="flex items-center gap-1.5">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-5 sm:pt-6">
        <nav className="flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground overflow-x-auto whitespace-nowrap pb-1">
          <a href={`/p/${username}`} className="hover:text-foreground transition-colors">
            {ownerName || t("홈", "Home")}
          </a>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <span className="text-foreground truncate">{project.title}</span>
        </nav>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Tech tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tech.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-5 sm:mb-6 leading-tight">
            {project.title}
          </h1>

          {/* Period & Role */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-6 mb-8 sm:mb-10 pb-8 sm:pb-10 border-b">
            {project.period && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 text-accent" />
                {project.period}
              </div>
            )}
            {project.role && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4 text-accent" />
                {project.role}
              </div>
            )}
          </div>

          {/* Meta summary cards (원본 템플릿 스타일) */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4 mb-10 sm:mb-12">
            {project.period && (
              <div className="rounded-xl border bg-card p-4">
                <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {t("기간", "Period")}
                </p>
                <p className="text-sm font-medium text-foreground leading-relaxed">{project.period}</p>
              </div>
            )}
            {project.role && (
              <div className="rounded-xl border bg-card p-4">
                <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {t("역할", "Role")}
                </p>
                <p className="text-sm font-medium text-foreground leading-relaxed">{project.role}</p>
              </div>
            )}
            {project.tech.length > 0 && (
              <div className="rounded-xl border bg-card p-4">
                <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {t("기술", "Tech")}
                </p>
                <p className="text-sm font-medium text-foreground leading-relaxed">{project.tech.slice(0, 3).join(", ")}{project.tech.length > 3 ? ` +${project.tech.length - 3}` : ""}</p>
              </div>
            )}
            {project.details.length > 0 && (
              <div className="rounded-xl border bg-card p-4">
                <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {t("주요 성과", "Key Results")}
                </p>
                <p className="text-sm font-medium text-foreground leading-relaxed">{project.details.length} {t("개 항목", "items")}</p>
              </div>
            )}
          </div>

          {/* Project overview */}
          <section className="mb-10 sm:mb-12">
            <h2 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-4">
              {t("프로젝트 개요", "Project Overview")}
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              <p>{project.description}</p>
            </div>
          </section>

          {/* Images gallery */}
          {project.images.length > 0 && (
            <section className="mb-10 sm:mb-12">
              <h2 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-4">
                {t("프로젝트 이미지", "Project Images")}
              </h2>
              <div className={`grid gap-4 ${project.images.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
                {project.images.map((img, i) => (
                  <div key={i} className="aspect-[16/10] overflow-hidden rounded-xl border bg-secondary">
                    <img
                      src={img}
                      alt={`${project.title} ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Details (원본 템플릿의 bullet point 스타일) */}
          {project.details.length > 0 && (
            <section className="mb-10 sm:mb-12">
              <h2 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-5 sm:mb-6">
                {t("상세 내용", "Details")}
              </h2>
              <div className="rounded-xl border bg-card p-5">
                <ul className="space-y-4">
                  {project.details.map((detail, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 + i * 0.1 }}
                      className="flex gap-3 text-sm sm:text-base text-muted-foreground leading-relaxed"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 flex-shrink-0" />
                      <span>{detail}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Tech Stack (원본 템플릿 스타일) */}
          <section>
            <h2 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-4">
              {t("기술 스택", "Tech Stack")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span key={tech} className="px-3 py-1.5 bg-secondary text-secondary-foreground text-xs sm:text-sm font-medium rounded-md border border-border/50">
                  {tech}
                </span>
              ))}
            </div>
          </section>
        </motion.div>
      </div>

      {/* Watermark */}
      <div className="w-full py-4 text-center border-t bg-secondary/30">
        <p className="text-[10px] text-muted-foreground/60">
          포폴링크로 5분 만에 제작됨 · Made with PoFoLink
        </p>
      </div>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full border bg-card/95 text-foreground shadow-lg backdrop-blur transition-colors hover:bg-card"
          aria-label={t("맨 위로 이동", "Scroll to top")}
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

const ProjectDetailPage = (props: ProjectDetailPageProps) => {
  return (
    <LanguageProvider>
      <ProjectDetailContent {...props} />
    </LanguageProvider>
  );
};

export default ProjectDetailPage;
