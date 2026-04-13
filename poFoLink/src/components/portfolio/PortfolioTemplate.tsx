"use client";

import { PortfolioData } from "@/types/portfolio";
import { LanguageProvider } from "@/contexts/LanguageContext";
import PortfolioNavigation from "./PortfolioNavigation";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import ProjectsSection from "./ProjectsSection";
import ActivitiesSection from "./ActivitiesSection";
import ContactSection from "./ContactSection";
import Watermark from "./Watermark";

interface PortfolioTemplateProps {
  data: PortfolioData;
  isPreview?: boolean;
  username?: string;
}

const PortfolioTemplate = ({ data, isPreview = false, username }: PortfolioTemplateProps) => {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        {!isPreview && (
          <PortfolioNavigation name={data.profile.name || "Portfolio"} />
        )}
        <HeroSection profile={data.profile} />
        <AboutSection about={data.about} />
        <ProjectsSection projects={data.projects} isPreview={isPreview} username={username} />
        <ActivitiesSection activities={data.activities} />
        <ContactSection contact={data.contact} name={data.profile.name} />
        <Watermark />
      </div>
    </LanguageProvider>
  );
};

export default PortfolioTemplate;
