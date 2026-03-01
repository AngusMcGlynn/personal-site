import { notFound } from "next/navigation";
import { ContentForm } from "@/components/admin/ContentForm";
import { getFieldDefs } from "@/lib/admin/mdx";
import { createEntryAction } from "@/lib/actions/admin";
import type { ContentType } from "@/lib/admin/github";

const VALID_TYPES = ["projects", "log", "library", "principles"] as const;
const LABELS: Record<string, string> = {
  projects: "Project",
  log: "Log Entry",
  library: "Book",
  principles: "Principle",
};

export default async function NewEntryPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;

  if (!VALID_TYPES.includes(type as (typeof VALID_TYPES)[number])) {
    notFound();
  }

  const contentType = type as ContentType;
  const fields = getFieldDefs(contentType);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-medium text-heading mb-6">
        New {LABELS[type]}
      </h1>
      <ContentForm
        type={contentType}
        fields={fields}
        action={createEntryAction}
        initialValues={{ "dates.created": new Date().toISOString().split("T")[0] }}
      />
    </div>
  );
}
