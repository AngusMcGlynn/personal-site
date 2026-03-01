import { notFound } from "next/navigation";
import { ContentForm } from "@/components/admin/ContentForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { getFieldDefs, parseMDX, frontmatterToFormValues } from "@/lib/admin/mdx";
import { getFile, type ContentType } from "@/lib/admin/github";
import { updateEntryAction } from "@/lib/actions/admin";

const VALID_TYPES = ["projects", "log", "library", "principles", "now"] as const;
const LABELS: Record<string, string> = {
  projects: "Project",
  log: "Log Entry",
  library: "Book",
  principles: "Principle",
  now: "Now",
};

export const dynamic = "force-dynamic";

export default async function EditEntryPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;

  if (!VALID_TYPES.includes(type as (typeof VALID_TYPES)[number])) {
    notFound();
  }

  const contentType = type as ContentType;
  const path =
    type === "now" ? "content/now.mdx" : `content/${type}/${id}.mdx`;

  let file;
  try {
    file = await getFile(path);
  } catch {
    notFound();
  }

  const { frontmatter, body } = parseMDX(file.content);
  const formValues = frontmatterToFormValues(frontmatter);
  const fields = getFieldDefs(contentType);

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium text-heading">
          Edit {LABELS[type]}
        </h1>

        {type !== "now" && (
          <DeleteButton path={file.path} sha={file.sha} />
        )}
      </div>

      <ContentForm
        type={contentType}
        fields={fields}
        action={updateEntryAction}
        initialValues={formValues}
        initialBody={body}
        hiddenFields={{ _path: file.path, _sha: file.sha }}
      />
    </div>
  );
}
