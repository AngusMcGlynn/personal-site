import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { PageTransition } from "@/components/layout/PageTransition";
import { StatusIndicator } from "@/components/entries/StatusIndicator";
import { EntryTimestamp } from "@/components/entries/EntryTimestamp";

export const metadata: Metadata = {
  title: "Projects",
  description: "Things I'm building.",
};

const statusOrder = ["active", "shipped", "paused", "killed"];

export default function ProjectsPage() {
  const sorted = [...projects].sort((a, b) => {
    const statusDiff = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
    if (statusDiff !== 0) return statusDiff;
    return new Date(b.dates.created).getTime() - new Date(a.dates.created).getTime();
  });

  return (
    <main className="mx-auto max-w-[680px] px-6 py-16">
      <PageTransition>
        <Header />
        <h1 className="text-2xl font-sans text-heading">Projects</h1>
        <div className="mt-12 space-y-12">
          {sorted.map((project) => (
            <article key={project.slug}>
              <div className="flex items-baseline gap-3">
                <Link
                  href={`/projects/${project.slug}`}
                  className="text-heading hover:text-accent transition-colors font-sans"
                >
                  {project.title}
                </Link>
                <StatusIndicator status={project.status} />
              </div>
              <p className="text-sm text-secondary mt-1">{project.description}</p>
              <div className="mt-2">
                <EntryTimestamp
                  created={project.dates.created}
                  updated={project.dates.updated}
                />
              </div>
            </article>
          ))}
        </div>
      </PageTransition>
    </main>
  );
}
