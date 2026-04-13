"use client";

import { usePortfolioStore } from "@/store/portfolioStore";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { TimelineItem } from "@/types/portfolio";

const AboutForm = () => {
  const { about } = usePortfolioStore((s) => s.data);
  const updateAbout = usePortfolioStore((s) => s.updateAbout);

  const addTimeline = () => {
    updateAbout({
      timeline: [
        ...about.timeline,
        { period: "", title: "", description: "", iconType: "work" },
      ],
    });
  };

  const updateTimeline = (index: number, item: Partial<TimelineItem>) => {
    const updated = about.timeline.map((t, i) =>
      i === index ? { ...t, ...item } : t
    );
    updateAbout({ timeline: updated });
  };

  const removeTimeline = (index: number) => {
    updateAbout({ timeline: about.timeline.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="summary">소개 요약</Label>
        <Textarea
          id="summary"
          value={about.summary}
          onChange={(e) => updateAbout({ summary: e.target.value })}
          placeholder="전문 분야와 경력 배경을 간략히 소개하세요..."
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="coreValues">핵심 가치</Label>
        <Textarea
          id="coreValues"
          value={about.coreValues || ""}
          onChange={(e) => updateAbout({ coreValues: e.target.value })}
          placeholder="직업적 가치관이나 목표를 작성하세요..."
          rows={2}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>경력 타임라인</Label>
          <Button variant="outline" size="sm" onClick={addTimeline}>
            <Plus className="w-3 h-3 mr-1" /> 추가
          </Button>
        </div>
        <div className="space-y-3">
          {about.timeline.map((item, i) => (
            <div key={i} className="p-3 rounded-lg border bg-secondary/30 space-y-2">
              <div className="flex items-center gap-2">
                <select
                  value={item.iconType}
                  onChange={(e) =>
                    updateTimeline(i, {
                      iconType: e.target.value as TimelineItem["iconType"],
                    })
                  }
                  className="text-xs px-2 py-1 rounded border bg-background"
                >
                  <option value="education">학력</option>
                  <option value="work">경력</option>
                  <option value="research">연구</option>
                </select>
                <Input
                  value={item.period}
                  onChange={(e) => updateTimeline(i, { period: e.target.value })}
                  placeholder="2020 - 2024"
                  className="text-xs h-7"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTimeline(i)}
                  className="h-7 w-7 p-0 text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
              <Input
                value={item.title}
                onChange={(e) => updateTimeline(i, { title: e.target.value })}
                placeholder="기관/회사명"
                className="text-xs h-7"
              />
              <Input
                value={item.description}
                onChange={(e) => updateTimeline(i, { description: e.target.value })}
                placeholder="역할 또는 학위 설명"
                className="text-xs h-7"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutForm;
