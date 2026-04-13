"use client";

import { GraduationCap, Briefcase, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { AboutData } from "@/types/portfolio";
import { useLanguage } from "@/contexts/LanguageContext";

interface AboutSectionProps {
  about: AboutData;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const iconMap = {
  education: GraduationCap,
  work: Building2,
  research: Briefcase,
};

const renderPeriod = (period: string) => {
  const parts = period.split(" - ");
  if (parts.length !== 2) return period;
  return (
    <>
      <span>{parts[0]}</span>
      <span aria-hidden="true" className="px-1">-</span>
      <span>{parts[1]}</span>
    </>
  );
};

const AboutSection = ({ about }: AboutSectionProps) => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-20 md:py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("소개", "About Me")}
          </h2>
          <div className="w-16 h-0.5 bg-accent mb-6" />
          {about.summary && (
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mb-10 md:mb-12 leading-relaxed text-balance">
              {about.summary}
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-16">
          {about.timeline.length > 0 && (
            <div className="md:col-span-3">
              <h3 className="font-display text-lg md:text-xl font-semibold text-foreground mb-6 md:mb-8">
                {t("경력 타임라인", "Experience Timeline")}
              </h3>
              <div className="relative">
                <div className="absolute left-4 sm:left-5 top-0 bottom-0 w-px bg-border" />
                <div className="space-y-6 md:space-y-8">
                  {about.timeline.map((item, i) => {
                    const Icon = iconMap[item.iconType] || Building2;
                    return (
                      <motion.div
                        key={i}
                        custom={i}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        className="flex gap-3 sm:gap-4 relative"
                      >
                        <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-card border-2 border-accent/30 flex items-center justify-center z-10">
                          <Icon className="w-4 h-4 text-accent" />
                        </div>
                        <div className="pb-2 min-w-0">
                          <p className="text-xs font-medium text-accent tracking-wide uppercase mb-1">
                            {renderPeriod(item.period)}
                          </p>
                          <h4 className="font-display text-sm sm:text-base font-semibold text-foreground mb-1 break-words">
                            {item.title}
                          </h4>
                          <p className="text-sm text-muted-foreground leading-relaxed break-words">
                            {item.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className={about.timeline.length > 0 ? "md:col-span-2" : "md:col-span-5"}>
            {about.skills.length > 0 && (
              <>
                <h3 className="font-display text-lg md:text-xl font-semibold text-foreground mb-6 md:mb-8">
                  {t("기술 스택", "Tech Stack")}
                </h3>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-wrap gap-2"
                >
                  {about.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 bg-secondary text-secondary-foreground text-xs font-medium rounded-md border border-border/50"
                    >
                      {skill}
                    </span>
                  ))}
                </motion.div>
              </>
            )}

            {about.coreValues && (
              <>
                <h3 className="font-display text-lg md:text-xl font-semibold text-foreground mt-10 md:mt-12 mb-4">
                  {t("핵심 가치", "Core Values")}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed break-words">
                  {about.coreValues}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
