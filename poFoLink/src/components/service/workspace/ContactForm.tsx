"use client";

import { usePortfolioStore } from "@/store/portfolioStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ContactForm = () => {
  const contact = usePortfolioStore((s) => s.data.contact);
  const updateContact = usePortfolioStore((s) => s.updateContact);

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs">이메일</Label>
        <Input
          value={contact.email || ""}
          onChange={(e) => updateContact({ email: e.target.value })}
          placeholder="example@email.com"
          className="text-xs h-8"
        />
      </div>
      <div>
        <Label className="text-xs">GitHub</Label>
        <Input
          value={contact.github || ""}
          onChange={(e) => updateContact({ github: e.target.value })}
          placeholder="https://github.com/username"
          className="text-xs h-8"
        />
      </div>
      <div>
        <Label className="text-xs">LinkedIn</Label>
        <Input
          value={contact.linkedin || ""}
          onChange={(e) => updateContact({ linkedin: e.target.value })}
          placeholder="https://linkedin.com/in/username"
          className="text-xs h-8"
        />
      </div>
      <div>
        <Label className="text-xs">YouTube</Label>
        <Input
          value={contact.youtube || ""}
          onChange={(e) => updateContact({ youtube: e.target.value })}
          placeholder="https://youtube.com/@channel"
          className="text-xs h-8"
        />
      </div>
      <div>
        <Label className="text-xs">웹사이트</Label>
        <Input
          value={contact.website || ""}
          onChange={(e) => updateContact({ website: e.target.value })}
          placeholder="https://mywebsite.com"
          className="text-xs h-8"
        />
      </div>
    </div>
  );
};

export default ContactForm;
