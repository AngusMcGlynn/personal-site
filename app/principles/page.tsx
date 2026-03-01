import type { Metadata } from "next";
import { principles } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { PageTransition } from "@/components/layout/PageTransition";
import { MDXContent } from "@/components/mdx-content";
import { EntryTimestamp } from "@/components/entries/EntryTimestamp";

export const metadata: Metadata = {
  title: "Principles",
  description: "Working beliefs, revised over time.",
};

export default function PrinciplesPage() {
  const sorted = [...principles].sort(
    (a, b) =>
      new Date(b.dates.created).getTime() -
      new Date(a.dates.created).getTime()
  );

  return (
    <main className="mx-auto max-w-[680px] px-6 py-16">
      <PageTransition>
        <Header />
        <h1 className="text-2xl font-sans text-heading">Principles</h1>
        <p className="text-sm text-secondary mt-2">
          Working beliefs. Revised when evidence demands it.
        </p>
        <div className="mt-12 space-y-16">
          {sorted.map((principle) => (
            <article key={principle.slug} id={principle.slug}>
              <h2 className="text-lg font-sans text-heading">
                {principle.title}
              </h2>
              <div className="mt-1">
                <EntryTimestamp
                  created={principle.dates.created}
                  updated={principle.dates.updated}
                  revisedCount={principle.revisedCount}
                />
              </div>
              <div className="prose prose-invert mt-4">
                <MDXContent code={principle.body} />
              </div>
            </article>
          ))}
        </div>
      </PageTransition>
    </main>
  );
}
