import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  PortfolioData,
  ProfileData,
  AboutData,
  ProjectData,
  ActivityData,
  ContactData,
  PortfolioSettings,
  defaultPortfolioData,
} from "@/types/portfolio";

interface PortfolioStore {
  portfolioId: string;
  data: PortfolioData;
  isLoading: boolean;
  isParsing: boolean;
  publishedUrl: string | null;

  setPortfolioId: (id: string) => void;
  setPortfolioData: (data: PortfolioData) => void;
  updateProfile: (profile: Partial<ProfileData>) => void;
  updateAbout: (about: Partial<AboutData>) => void;
  addProject: () => void;
  updateProject: (id: string, project: Partial<ProjectData>) => void;
  removeProject: (id: string) => void;
  addActivity: () => void;
  updateActivity: (id: string, activity: Partial<ActivityData>) => void;
  removeActivity: (id: string) => void;
  updateContact: (contact: Partial<ContactData>) => void;
  updateSettings: (settings: Partial<PortfolioSettings>) => void;
  setLoading: (loading: boolean) => void;
  setParsing: (parsing: boolean) => void;
  setPublishedUrl: (url: string | null) => void;
  reset: () => void;
}

function generateId(): string {
  return crypto.randomUUID();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export const usePortfolioStore = create<PortfolioStore>()(
  persist(
    (set) => ({
      portfolioId: generateId(),
      data: defaultPortfolioData,
      isLoading: false,
      isParsing: false,
      publishedUrl: null,

      setPortfolioId: (id) => set({ portfolioId: id }),

      setPortfolioData: (data) => set({ data }),

      updateProfile: (profile) =>
        set((state) => ({
          data: {
            ...state.data,
            profile: { ...state.data.profile, ...profile },
          },
        })),

      updateAbout: (about) =>
        set((state) => ({
          data: {
            ...state.data,
            about: { ...state.data.about, ...about },
          },
        })),

      addProject: () =>
        set((state) => ({
          data: {
            ...state.data,
            projects: [
              ...state.data.projects,
              {
                id: generateId(),
                slug: "",
                title: "",
                description: "",
                tech: [],
                period: "",
                role: "",
                details: [],
                images: [],
              },
            ],
          },
        })),

      updateProject: (id, project) =>
        set((state) => ({
          data: {
            ...state.data,
            projects: state.data.projects.map((p) => {
              if (p.id !== id) return p;
              const updated = { ...p, ...project };
              if (project.title && !project.slug) {
                updated.slug = slugify(project.title);
              }
              return updated;
            }),
          },
        })),

      removeProject: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            projects: state.data.projects.filter((p) => p.id !== id),
          },
        })),

      addActivity: () =>
        set((state) => ({
          data: {
            ...state.data,
            activities: [
              ...state.data.activities,
              {
                id: generateId(),
                date: "",
                title: "",
                location: "",
              },
            ],
          },
        })),

      updateActivity: (id, activity) =>
        set((state) => ({
          data: {
            ...state.data,
            activities: state.data.activities.map((a) =>
              a.id === id ? { ...a, ...activity } : a
            ),
          },
        })),

      removeActivity: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            activities: state.data.activities.filter((a) => a.id !== id),
          },
        })),

      updateContact: (contact) =>
        set((state) => ({
          data: {
            ...state.data,
            contact: { ...state.data.contact, ...contact },
          },
        })),

      updateSettings: (settings) =>
        set((state) => ({
          data: {
            ...state.data,
            settings: { ...state.data.settings, ...settings },
          },
        })),

      setLoading: (isLoading) => set({ isLoading }),
      setParsing: (isParsing) => set({ isParsing }),
      setPublishedUrl: (publishedUrl) => set({ publishedUrl }),

      reset: () =>
        set({
          portfolioId: generateId(),
          data: defaultPortfolioData,
          isLoading: false,
          isParsing: false,
          publishedUrl: null,
        }),
    }),
    {
      name: "pofolink-portfolio",
    }
  )
);
