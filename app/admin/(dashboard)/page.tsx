import Link from "next/link";
import { listFiles, type ContentType } from "@/lib/admin/github";

const CONTENT_TYPES: { type: ContentType; label: string }[] = [
  { type: "projects", label: "Projects" },
  { type: "log", label: "Log" },
  { type: "library", label: "Library" },
  { type: "principles", label: "Principles" },
  { type: "now", label: "Now" },
];

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const groups = await Promise.all(
    CONTENT_TYPES.map(async ({ type, label }) => ({
      type,
      label,
      files: await listFiles(type),
    }))
  );

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <h1 className="text-2xl font-medium text-heading">Content</h1>

      {groups.map(({ type, label, files }) => (
        <section key={type}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg text-heading">{label}</h2>
            {type !== "now" && (
              <Link
                href={`/admin/${type}/new`}
                className="text-sm text-accent hover:opacity-80 transition-opacity"
              >
                + New
              </Link>
            )}
          </div>

          {files.length === 0 ? (
            <p className="text-sm text-secondary">No entries yet.</p>
          ) : (
            <ul className="flex flex-col gap-1">
              {files.map((file) => {
                const id = file.name.replace(/\.mdx$/, "");
                return (
                  <li key={file.path}>
                    <Link
                      href={`/admin/${type}/${id}/edit`}
                      className="flex items-center justify-between py-2 px-3 rounded hover:bg-white/5 transition-colors group"
                    >
                      <span className="text-foreground">{id}</span>
                      <span className="text-sm text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                        Edit
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
