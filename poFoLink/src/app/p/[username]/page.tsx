import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import PortfolioTemplate from "@/components/portfolio/PortfolioTemplate";
import { PortfolioData } from "@/types/portfolio";
import { slugify } from "@/lib/slugify";

interface PageProps {
  params: { username: string };
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

  // slug가 없는 프로젝트에 slug를 보장
  const portfolio = data.data as PortfolioData;
  if (portfolio.projects) {
    const usedSlugs = new Set<string>();
    portfolio.projects = portfolio.projects.map((p, i) => {
      if (!p.slug) {
        let slug = slugify(p.title || `project-${i + 1}`) || `project-${i + 1}`;
        let finalSlug = slug;
        let counter = 2;
        while (usedSlugs.has(finalSlug)) {
          finalSlug = `${slug}-${counter}`;
          counter++;
        }
        usedSlugs.add(finalSlug);
        return { ...p, slug: finalSlug };
      }
      usedSlugs.add(p.slug);
      return p;
    });
  }

  return portfolio;
}

export async function generateMetadata({ params }: PageProps) {
  const portfolio = await getPortfolio(params.username);
  if (!portfolio) return { title: "Not Found" };

  return {
    title: `${portfolio.profile.name} - Portfolio`,
    description: portfolio.profile.headline || portfolio.profile.bio,
  };
}

export default async function PortfolioPage({ params }: PageProps) {
  const portfolio = await getPortfolio(params.username);

  if (!portfolio) {
    notFound();
  }

  return <PortfolioTemplate data={portfolio} username={params.username} />;
}
