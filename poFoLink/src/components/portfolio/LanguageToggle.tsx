"use client";

import { useLanguage } from "@/contexts/LanguageContext";

const LanguageToggle = () => {
  const { lang, toggleLang } = useLanguage();

  return (
    <button
      onClick={(event) => {
        toggleLang();
        event.currentTarget.blur();
      }}
      className="min-w-10 px-2.5 py-1.5 rounded-md text-xs font-semibold border bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
      aria-label="Toggle language"
    >
      {lang === "ko" ? "EN" : "KR"}
    </button>
  );
};

export default LanguageToggle;
