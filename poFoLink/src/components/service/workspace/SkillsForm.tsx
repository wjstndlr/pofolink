"use client";

import { useState } from "react";
import { usePortfolioStore } from "@/store/portfolioStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

const SkillsForm = () => {
  const { about } = usePortfolioStore((s) => s.data);
  const updateAbout = usePortfolioStore((s) => s.updateAbout);
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    const skill = newSkill.trim();
    if (skill && !about.skills.includes(skill)) {
      updateAbout({ skills: [...about.skills, skill] });
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    updateAbout({ skills: about.skills.filter((s) => s !== skill) });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>기술 스택</Label>
        <div className="flex gap-2 mt-1">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
            placeholder="예: React, Python, Docker"
            className="text-sm"
          />
          <Button variant="outline" size="sm" onClick={addSkill}>
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {about.skills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded border border-border/50"
          >
            {skill}
            <button
              onClick={() => removeSkill(skill)}
              className="text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default SkillsForm;
