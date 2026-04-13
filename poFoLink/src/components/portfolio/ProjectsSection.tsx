"use client";

import { motion } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import { useState } from "react";
import { ProjectData } from "@/types/portfolio";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProjectsSectionProps {
  projects: ProjectData[];
  isPreview?: boolean;
  username?: string;
}

const ProjectsSection = ({ projects, isPreview = false, username }: ProjectsSectionProps) => {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const { t } = useLanguage();

  if (projects.length === 0) return null;

  return (
    <>
      <section id="projects" className="py-20 md:py-24 px-4 sm:px-6 bg-secondary/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("프로젝트", "Projects")}
            </h2>
            <div className="w-16 h-0.5 bg-accent mb-10 md:mb-12" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {projects.map((project, i) => {
              const projectLink = `/p/${username}/project/${encodeURIComponent(project.slug || String(i))}`;
              return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.5, delay: (i % 2) * 0.05 }}
                className="h-full"
              >
                <a
                  href={isPreview ? undefined : projectLink}
                  onClick={(e) => {
                    if (isPreview) {
                      e.preventDefault();
                      setSelectedProject(project);
                    }
                  }}
                  className="group flex h-full w-full flex-col rounded-xl border bg-card p-6 hover:shadow-lg transition-all duration-300 text-left cursor-pointer"
                >
                  {project.images.length > 0 && (
                    <div className="aspect-[16/10] overflow-hidden bg-secondary rounded-lg mb-4">
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h4 className="font-display font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                      {project.title}
                    </h4>
                    <ExternalLink className="w-4 h-4 text-muted-foreground/40 group-hover:text-accent transition-colors flex-shrink-0 mt-1" />
                  </div>
                  <p className="line-clamp-3 text-sm text-muted-foreground mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-1.5">
                    {project.tech.map((tt) => (
                      <span
                        key={tt}
                        className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs font-medium rounded border border-border/50"
                      >
                        {tt}
                      </span>
                    ))}
                  </div>
                  <span className="inline-block mt-4 text-xs text-accent font-medium group-hover:underline">
                    {t("자세히 보기 →", "View details →")}
                  </span>
                </a>
              </motion.div>
            );
            })}
          </div>
        </div>
      </section>

      {selectedProject && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setSelectedProject(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card rounded-xl border shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-display text-xl md:text-2xl font-bold text-foreground">
                {selectedProject.title}
              </h3>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1 rounded-md hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
              {selectedProject.period && <span>{selectedProject.period}</span>}
              {selectedProject.role && (
                <>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                  <span>{selectedProject.role}</span>
                </>
              )}
            </div>

            {selectedProject.images.length > 0 && (
              <div className="aspect-[16/9] overflow-hidden bg-secondary rounded-lg mb-6">
                <img
                  src={selectedProject.images[0]}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {selectedProject.description}
            </p>

            {selectedProject.details.length > 0 && (
              <div className="mb-6">
                <h4 className="font-display font-semibold text-foreground mb-3">
                  {t("상세 내용", "Details")}
                </h4>
                <ul className="space-y-2">
                  {selectedProject.details.map((detail, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="text-accent mt-1 flex-shrink-0">•</span>
                      <span className="leading-relaxed">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap gap-1.5">
              {selectedProject.tech.map((tt) => (
                <span
                  key={tt}
                  className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs font-medium rounded border border-border/50"
                >
                  {tt}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default ProjectsSection;
