import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import ProjectDetailPage from "@/components/portfolio/ProjectDetailPage";
import { PortfolioData, ProjectData } from "@/types/portfolio";

interface PageProps {
  params: { username: string; slug: string };
}

async function getPortfolio(username: string): Promise<PortfolioData | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("portfolios")
    .select("data")
    .eq("username", username)
    .single();

  if (error || !data) return null;
  return data.data as PortfolioData;
}

function findProject(projects: ProjectData[], slug: string): ProjectData | undefined {
  // 1. 정확한 slug 매칭
  const exact = projects.find((p) => p.slug === slug);
  if (exact) return exact;

  // 2. decodeURI 후 매칭 (한글 slug 등)
  const decoded = decodeURIComponent(slug);
  const decodedMatch = projects.find((p) => p.slug === decoded);
  if (decodedMatch) return decodedMatch;

  // 3. slug를 소문자로 비교
  const lower = slug.toLowerCase();
  const lowerMatch = projects.find((p) => p.slug?.toLowerCase() === lower);
  if (lowerMatch) return lowerMatch;

  // 4. slug가 숫자 index인 경우 (fallback)
  const index = parseInt(slug, 10);
  if (!isNaN(index) && index >= 0 && index < projects.length) {
    return projects[index];
  }

  return undefined;
}

export async function generateMetadata({ params }: PageProps) {
  const portfolio = await getPortfolio(params.username);
  if (!portfolio) return { title: "Not Found" };

  const project = findProject(portfolio.projects, params.slug);
  if (!project) return { title: "Not Found" };

  return {
    title: `${project.title} - ${portfolio.profile.name}`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const portfolio = await getPortfolio(params.username);
  if (!portfolio) notFound();

  const project = findProject(portfolio.projects, params.slug);
  if (!project) notFound();

  return (
    <ProjectDetailPage
      project={project}
      username={params.username}
      ownerName={portfolio.profile.name}
    />
  );
}
