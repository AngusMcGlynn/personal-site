"use client";

import { useState } from "react";
import { logs } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { PageTransition } from "@/components/layout/PageTransition";
import { MDXContent } from "@/components/mdx-content";
import { EntryTimestamp } from "@/components/entries/EntryTimestamp";
import { TagList } from "@/components/entries/TagList";

export default function LogPage() {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = Array.from(new Set(logs.flatMap((l) => l.tags))).sort();

  const sorted = [...logs]
    .sort(
      (a, b) =>
        new Date(b.dates.created).getTime() -
        new Date(a.dates.created).getTime()
    )
    .filter((l) => !activeTag || l.tags.includes(activeTag));

  return (
    <main className="mx-auto max-w-[680px] px-6 py-16">
      <PageTransition>
        <Header />
        <h1 className="text-2xl font-sans text-heading">Log</h1>

        <div className="mt-6">
          <TagList
            tags={allTags}
            activeTag={activeTag ?? undefined}
            onTagClick={(tag) =>
              setActiveTag(activeTag === tag ? null : tag)
            }
          />
        </div>

        <div className="mt-12 space-y-16">
          {sorted.map((entry) => (
            <article key={entry.slug} id={entry.slug}>
              {entry.title && (
                <h2 className="text-lg font-sans text-heading">
                  {entry.title}
                </h2>
              )}
              <div className="mt-1">
                <EntryTimestamp created={entry.dates.created} />
              </div>
              <div className="prose prose-invert mt-4">
                <MDXContent code={entry.body} />
              </div>
            </article>
          ))}
        </div>
      </PageTransition>
    </main>
  );
}
