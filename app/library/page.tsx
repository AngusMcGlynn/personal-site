import type { Metadata } from "next";
import { library } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { PageTransition } from "@/components/layout/PageTransition";
import { MDXContent } from "@/components/mdx-content";
import { EntryTimestamp } from "@/components/entries/EntryTimestamp";
import { StatusIndicator } from "@/components/entries/StatusIndicator";

export const metadata: Metadata = {
  title: "Library",
  description: "Books and reading notes.",
};

const statusOrder = ["reading", "finished", "abandoned"];

export default function LibraryPage() {
  const sorted = [...library].sort((a, b) => {
    const statusDiff = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
    if (statusDiff !== 0) return statusDiff;
    return new Date(b.dates.created).getTime() - new Date(a.dates.created).getTime();
  });

  return (
    <main className="mx-auto max-w-[680px] px-6 py-16">
      <PageTransition>
        <Header />
        <h1 className="text-2xl font-sans text-heading">Library</h1>
        <div className="mt-12 space-y-16">
          {sorted.map((book) => (
            <article key={book.slug} id={book.slug}>
              <div className="flex items-baseline gap-3">
                <h2 className="text-lg font-sans text-heading">
                  {book.title}
                </h2>
                <StatusIndicator status={book.status} />
              </div>
              <p className="text-sm text-secondary mt-1">{book.author}</p>
              <div className="mt-2">
                <EntryTimestamp
                  created={book.dates.created}
                  updated={book.dates.updated}
                />
              </div>
              <div className="prose prose-invert mt-4">
                <MDXContent code={book.body} />
              </div>
            </article>
          ))}
        </div>
      </PageTransition>
    </main>
  );
}
