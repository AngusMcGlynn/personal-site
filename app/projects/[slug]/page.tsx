import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { PageTransition } from "@/components/layout/PageTransition";
import { MDXContent } from "@/components/mdx-content";
import { EntryTimestamp } from "@/components/entries/EntryTimestamp";
import { StatusIndicator } from "@/components/entries/StatusIndicator";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <main className="mx-auto max-w-[680px] px-6 py-16">
      <PageTransition>
        <Header />
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-sans text-heading">{project.title}</h1>
          <StatusIndicator status={project.status} />
        </div>
        <div className="mt-2">
          <EntryTimestamp
            created={project.dates.created}
            updated={project.dates.updated}
          />
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {project.tags.map((tag) => (
            <span key={tag} className="text-xs text-secondary">
              {tag}
            </span>
          ))}
        </div>
        <div className="prose prose-invert mt-8">
          <MDXContent code={project.body} />
        </div>
      </PageTransition>
    </main>
  );
}
