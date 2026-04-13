export interface PortfolioData {
  profile: ProfileData;
  about: AboutData;
  projects: ProjectData[];
  activities: ActivityData[];
  contact: ContactData;
  settings: PortfolioSettings;
}

export interface ProfileData {
  name: string;
  tagline: string;
  headline: string;
  bio: string;
  profileImageUrl?: string;
  cvUrl?: string;
  currentRole?: string;
  education?: string;
  focus?: string;
}

export interface AboutData {
  summary: string;
  timeline: TimelineItem[];
  skills: string[];
  coreValues?: string;
}

export interface TimelineItem {
  period: string;
  title: string;
  description: string;
  iconType: "education" | "work" | "research";
}

export interface ProjectData {
  id: string;
  slug: string;
  title: string;
  description: string;
  tech: string[];
  period: string;
  role: string;
  details: string[];
  images: string[];
}

export interface ActivityData {
  id: string;
  date: string;
  title: string;
  location: string;
  detail?: string;
  imageUrl?: string;
}

export interface ContactData {
  email?: string;
  github?: string;
  linkedin?: string;
  youtube?: string;
  website?: string;
}

export interface PortfolioSettings {
  accentColor?: string;
  darkMode?: boolean;
}

export const defaultPortfolioData: PortfolioData = {
  profile: {
    name: "",
    tagline: "",
    headline: "",
    bio: "",
  },
  about: {
    summary: "",
    timeline: [],
    skills: [],
  },
  projects: [],
  activities: [],
  contact: {},
  settings: {},
};
