"use client";

import { usePortfolioStore } from "@/store/portfolioStore";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ImageUploader from "../ImageUploader";

const ProfileForm = () => {
  const { profile } = usePortfolioStore((s) => s.data);
  const updateProfile = usePortfolioStore((s) => s.updateProfile);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">이름</Label>
        <Input
          id="name"
          value={profile.name}
          onChange={(e) => updateProfile({ name: e.target.value })}
          placeholder="홍길동"
        />
      </div>
      <div>
        <Label htmlFor="tagline">태그라인</Label>
        <Input
          id="tagline"
          value={profile.tagline}
          onChange={(e) => updateProfile({ tagline: e.target.value })}
          placeholder="Full Stack Developer · AI Enthusiast"
        />
      </div>
      <div>
        <Label htmlFor="headline">헤드라인</Label>
        <Input
          id="headline"
          value={profile.headline}
          onChange={(e) => updateProfile({ headline: e.target.value })}
          placeholder="Software Engineer at Company"
        />
      </div>
      <div>
        <Label htmlFor="bio">소개</Label>
        <Textarea
          id="bio"
          value={profile.bio}
          onChange={(e) => updateProfile({ bio: e.target.value })}
          placeholder="간단한 자기소개를 작성하세요..."
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="currentRole">현재 직장/직책</Label>
        <Input
          id="currentRole"
          value={profile.currentRole || ""}
          onChange={(e) => updateProfile({ currentRole: e.target.value })}
          placeholder="회사명"
        />
      </div>
      <div>
        <Label htmlFor="education">학력</Label>
        <Input
          id="education"
          value={profile.education || ""}
          onChange={(e) => updateProfile({ education: e.target.value })}
          placeholder="대학교, 2025"
        />
      </div>
      <div>
        <Label htmlFor="focus">전문 분야</Label>
        <Input
          id="focus"
          value={profile.focus || ""}
          onChange={(e) => updateProfile({ focus: e.target.value })}
          placeholder="웹 개발, AI, 데이터 사이언스"
        />
      </div>
      <div>
        <Label>프로필 이미지</Label>
        <ImageUploader
          currentUrl={profile.profileImageUrl}
          onUpload={(url) => updateProfile({ profileImageUrl: url })}
          onRemove={() => updateProfile({ profileImageUrl: undefined })}
          path="profile"
        />
      </div>
    </div>
  );
};

export default ProfileForm;
