"use client";

import { useState } from "react";
import { usePortfolioStore } from "@/store/portfolioStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import ImageUploader from "../ImageUploader";

const ActivityForm = () => {
  const activities = usePortfolioStore((s) => s.data.activities);
  const addActivity = usePortfolioStore((s) => s.addActivity);
  const updateActivity = usePortfolioStore((s) => s.updateActivity);
  const removeActivity = usePortfolioStore((s) => s.removeActivity);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div key={activity.id} className="rounded-lg border bg-secondary/30">
          <div
            onClick={() => setExpanded(expanded === activity.id ? null : activity.id)}
            className="w-full flex items-center justify-between p-3 cursor-pointer"
          >
            <span className="text-sm font-medium text-foreground truncate">
              {activity.title || "새 활동"}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeActivity(activity.id);
                }}
                className="h-6 w-6 p-0 flex items-center justify-center text-destructive hover:bg-destructive/10 rounded"
              >
                <Trash2 className="w-3 h-3" />
              </button>
              {expanded === activity.id ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          </div>

          {expanded === activity.id && (
            <div className="px-3 pb-3 space-y-2">
              <div>
                <Label className="text-xs">제목</Label>
                <Input
                  value={activity.title}
                  onChange={(e) => updateActivity(activity.id, { title: e.target.value })}
                  placeholder="활동 제목"
                  className="text-xs h-8"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">날짜</Label>
                  <Input
                    value={activity.date}
                    onChange={(e) => updateActivity(activity.id, { date: e.target.value })}
                    placeholder="2024.06"
                    className="text-xs h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">장소</Label>
                  <Input
                    value={activity.location}
                    onChange={(e) => updateActivity(activity.id, { location: e.target.value })}
                    placeholder="장소/기관"
                    className="text-xs h-8"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs">상세 (수상 등)</Label>
                <Input
                  value={activity.detail || ""}
                  onChange={(e) => updateActivity(activity.id, { detail: e.target.value })}
                  placeholder="우수상, 대상 등"
                  className="text-xs h-8"
                />
              </div>
              <div>
                <Label className="text-xs">활동 이미지</Label>
                <ImageUploader
                  currentUrl={activity.imageUrl}
                  onUpload={(url) => updateActivity(activity.id, { imageUrl: url })}
                  onRemove={() => updateActivity(activity.id, { imageUrl: undefined })}
                  path={`activities/${activity.id}`}
                />
              </div>
            </div>
          )}
        </div>
      ))}

      <Button variant="outline" size="sm" onClick={addActivity} className="w-full">
        <Plus className="w-3 h-3 mr-1" /> 활동 추가
      </Button>
    </div>
  );
};

export default ActivityForm;
