"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "ko" | "en";

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (ko: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("en");

  const toggleLang = () => setLang((prev) => (prev === "ko" ? "en" : "ko"));
  const t = (ko: string, en: string) => (lang === "ko" ? ko : en);

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
