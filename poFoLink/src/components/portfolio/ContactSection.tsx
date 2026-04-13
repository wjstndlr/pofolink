"use client";

import { Mail, GitFork, Globe, Video, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { ContactData } from "@/types/portfolio";
import { useLanguage } from "@/contexts/LanguageContext";

interface ContactSectionProps {
  contact: ContactData;
  name: string;
}

const ContactSection = ({ contact, name }: ContactSectionProps) => {
  const { t } = useLanguage();

  const links = [
    contact.email && { icon: Mail, label: "Email", href: `mailto:${contact.email}` },
    contact.github && { icon: GitFork, label: "GitHub", href: contact.github, external: true },
    contact.linkedin && { icon: ExternalLink, label: "LinkedIn", href: contact.linkedin, external: true },
    contact.youtube && { icon: Video, label: "YouTube", href: contact.youtube, external: true },
    contact.website && { icon: Globe, label: "Website", href: contact.website, external: true },
  ].filter(Boolean) as { icon: typeof Mail; label: string; href: string; external?: boolean }[];

  if (links.length === 0) return null;

  return (
    <section id="contact" className="py-20 md:py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("연락처", "Get in Touch")}
          </h2>
          <div className="w-16 h-0.5 bg-accent mx-auto mb-8" />
          <p className="text-sm md:text-base text-muted-foreground mb-8 md:mb-10 leading-relaxed text-balance">
            {t(
              "연구 협업, 대학원 문의, 채용 관련 연락을 환영합니다.",
              "Feel free to reach out for collaborations, inquiries, or career opportunities."
            )}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-stretch justify-center gap-3 sm:gap-4"
        >
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="flex min-w-[140px] items-center justify-center gap-2 px-4 sm:px-5 py-3 bg-card border rounded-lg text-sm font-medium text-foreground hover:border-accent/50 hover:shadow-md transition-all duration-200"
            >
              <link.icon className="w-4 h-4 text-accent" />
              {link.label}
            </a>
          ))}
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto mt-16 md:mt-20 pt-8 border-t text-center">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {name}. All rights reserved.
        </p>
      </div>
    </section>
  );
};

export default ContactSection;
