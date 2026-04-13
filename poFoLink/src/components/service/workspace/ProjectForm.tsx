"use client";

import { useState } from "react";
import { usePortfolioStore } from "@/store/portfolioStore";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, X, ChevronDown, ChevronUp } from "lucide-react";
import ImageUploader from "../ImageUploader";

const ProjectForm = () => {
  const projects = usePortfolioStore((s) => s.data.projects);
  const addProject = usePortfolioStore((s) => s.addProject);
  const updateProject = usePortfolioStore((s) => s.updateProject);
  const removeProject = usePortfolioStore((s) => s.removeProject);
  const [expanded, setExpanded] = useState<string | null>(null);

  const addDetail = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      updateProject(projectId, { details: [...project.details, ""] });
    }
  };

  const updateDetail = (projectId: string, index: number, value: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      const details = project.details.map((d, i) => (i === index ? value : d));
      updateProject(projectId, { details });
    }
  };

  const removeDetail = (projectId: string, index: number) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      updateProject(projectId, {
        details: project.details.filter((_, i) => i !== index),
      });
    }
  };

  const addTech = (projectId: string, tech: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project && tech.trim() && !project.tech.includes(tech.trim())) {
      updateProject(projectId, { tech: [...project.tech, tech.trim()] });
    }
  };

  const removeTech = (projectId: string, tech: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      updateProject(projectId, { tech: project.tech.filter((t) => t !== tech) });
    }
  };

  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <div key={project.id} className="rounded-lg border bg-secondary/30">
          <div
            onClick={() => setExpanded(expanded === project.id ? null : project.id)}
            className="w-full flex items-center justify-between p-3 cursor-pointer"
          >
            <span className="text-sm font-medium text-foreground truncate">
              {project.title || "새 프로젝트"}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeProject(project.id);
                }}
                className="h-6 w-6 p-0 flex items-center justify-center text-destructive hover:bg-destructive/10 rounded"
              >
                <Trash2 className="w-3 h-3" />
              </button>
              {expanded === project.id ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          </div>

          {expanded === project.id && (
            <div className="px-3 pb-3 space-y-3">
              <div>
                <Label className="text-xs">제목</Label>
                <Input
                  value={project.title}
                  onChange={(e) => updateProject(project.id, { title: e.target.value })}
                  placeholder="프로젝트 제목"
                  className="text-xs h-8"
                />
              </div>
              <div>
                <Label className="text-xs">설명</Label>
                <Textarea
                  value={project.description}
                  onChange={(e) => updateProject(project.id, { description: e.target.value })}
                  placeholder="프로젝트 요약 설명"
                  rows={2}
                  className="text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">기간</Label>
                  <Input
                    value={project.period}
                    onChange={(e) => updateProject(project.id, { period: e.target.value })}
                    placeholder="2024.01 - 2024.06"
                    className="text-xs h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">역할</Label>
                  <Input
                    value={project.role}
                    onChange={(e) => updateProject(project.id, { role: e.target.value })}
                    placeholder="프로젝트 리드"
                    className="text-xs h-8"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs">기술 스택</Label>
                <div className="flex flex-wrap gap-1 mb-1.5">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-secondary text-xs rounded border"
                    >
                      {t}
                      <button onClick={() => removeTech(project.id, t)}>
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
                <Input
                  placeholder="기술명 입력 후 Enter"
                  className="text-xs h-8"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTech(project.id, e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs">상세 내용</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addDetail(project.id)}
                    className="h-6 text-xs"
                  >
                    <Plus className="w-3 h-3 mr-1" /> 항목 추가
                  </Button>
                </div>
                <div className="space-y-1.5">
                  {project.details.map((detail, i) => (
                    <div key={i} className="flex gap-1">
                      <Input
                        value={detail}
                        onChange={(e) => updateDetail(project.id, i, e.target.value)}
                        placeholder="성과 또는 상세 설명"
                        className="text-xs h-7"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDetail(project.id, i)}
                        className="h-7 w-7 p-0 text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs">프로젝트 이미지</Label>
                <ImageUploader
                  currentUrl={project.images[0]}
                  onUpload={(url) =>
                    updateProject(project.id, { images: [url, ...project.images.slice(1)] })
                  }
                  onRemove={() =>
                    updateProject(project.id, { images: project.images.slice(1) })
                  }
                  path={`projects/${project.id}`}
                />
              </div>
            </div>
          )}
        </div>
      ))}

      <Button variant="outline" size="sm" onClick={addProject} className="w-full">
        <Plus className="w-3 h-3 mr-1" /> 프로젝트 추가
      </Button>
    </div>
  );
};

export default ProjectForm;
