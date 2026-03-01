import type { Metadata } from "next";
import { now } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { PageTransition } from "@/components/layout/PageTransition";
import { MDXContent } from "@/components/mdx-content";

export const metadata: Metadata = {
  title: "Now",
  description: "What I'm doing right now.",
};

export default function NowPage() {
  return (
    <main className="mx-auto max-w-[680px] px-6 py-16">
      <PageTransition>
        <Header />
        <h1 className="text-2xl font-sans text-heading">Now</h1>
        <p className="text-xs text-secondary mt-2">
          updated{" "}
          {new Date(now.updatedAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
        <div className="prose prose-invert mt-8">
          <MDXContent code={now.body} />
        </div>
      </PageTransition>
    </main>
  );
}
