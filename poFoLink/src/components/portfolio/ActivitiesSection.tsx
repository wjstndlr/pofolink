"use client";

import { motion } from "framer-motion";
import { ActivityData } from "@/types/portfolio";
import { useLanguage } from "@/contexts/LanguageContext";

interface ActivitiesSectionProps {
  activities: ActivityData[];
}

const ActivitiesSection = ({ activities }: ActivitiesSectionProps) => {
  const { t } = useLanguage();

  if (activities.length === 0) return null;

  return (
    <section id="activities" className="py-20 md:py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("활동 및 사진", "Activities & Photos")}
          </h2>
          <div className="w-16 h-0.5 bg-accent mb-10 md:mb-12" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {activities.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.05 }}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="group relative rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {item.imageUrl ? (
                <div className="aspect-[4/3] overflow-hidden bg-secondary">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="aspect-[4/3] bg-secondary/80 flex items-center justify-center">
                  <span className="text-muted-foreground/40 text-xs">{t("이미지 없음", "No image")}</span>
                </div>
              )}
              <div className="p-4 sm:p-5">
                <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-accent mb-1">
                  {item.date}
                </p>
                <h4 className="font-display text-sm font-semibold text-foreground mb-1 leading-snug line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-xs text-muted-foreground break-words">{item.location}</p>
                {item.detail && (
                  <span className="inline-block mt-2 px-2 py-0.5 bg-accent/10 text-accent text-[10px] font-medium rounded">
                    {item.detail}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ActivitiesSection;
