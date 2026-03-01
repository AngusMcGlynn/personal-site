import matter from "gray-matter";
import type { ContentType } from "./github";

export interface ParsedMDX {
  frontmatter: Record<string, unknown>;
  body: string;
}

export function parseMDX(raw: string): ParsedMDX {
  const { data, content } = matter(raw);
  return { frontmatter: data, body: content.trim() };
}

export function serializeMDX(frontmatter: Record<string, unknown>, body: string): string {
  return matter.stringify("\n" + body.trim() + "\n", frontmatter);
}

export interface FieldDef {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "date";
  required?: boolean;
  options?: string[];
  placeholder?: string;
}

const commonFields: FieldDef[] = [
  { name: "id", label: "ID", type: "text", required: true, placeholder: "unique-id" },
  { name: "tags", label: "Tags", type: "text", placeholder: "tag1, tag2, tag3" },
  { name: "connections", label: "Connections", type: "text", placeholder: "id1, id2" },
  { name: "dates.created", label: "Created", type: "date", required: true },
  { name: "dates.updated", label: "Updated", type: "date" },
];

const FIELD_DEFS: Record<ContentType, FieldDef[]> = {
  projects: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "slug", label: "Slug", type: "text", required: true },
    { name: "status", label: "Status", type: "select", required: true, options: ["active", "shipped", "paused", "killed"] },
    { name: "description", label: "Description", type: "textarea", required: true },
    ...commonFields,
  ],
  log: [
    { name: "title", label: "Title", type: "text" },
    { name: "slug", label: "Slug", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea", required: true },
    ...commonFields,
  ],
  library: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "slug", label: "Slug", type: "text", required: true },
    { name: "author", label: "Author", type: "text", required: true },
    { name: "status", label: "Status", type: "select", required: true, options: ["reading", "finished", "abandoned"] },
    { name: "description", label: "Description", type: "textarea", required: true },
    ...commonFields,
  ],
  principles: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "slug", label: "Slug", type: "text", required: true },
    { name: "revisedCount", label: "Revised Count", type: "text" },
    { name: "description", label: "Description", type: "textarea", required: true },
    ...commonFields,
  ],
  now: [
    { name: "updatedAt", label: "Updated At", type: "date", required: true },
  ],
};

export function getFieldDefs(type: ContentType): FieldDef[] {
  return FIELD_DEFS[type];
}

export function formDataToFrontmatter(formData: FormData, type: ContentType): Record<string, unknown> {
  const fields = getFieldDefs(type);
  const result: Record<string, unknown> = {};

  for (const field of fields) {
    const value = formData.get(field.name) as string | null;
    if (!value && !field.required) continue;
    if (!value) continue;

    if (field.name === "tags" || field.name === "connections") {
      result[field.name] = value.split(",").map((s) => s.trim()).filter(Boolean);
    } else if (field.name === "revisedCount") {
      result[field.name] = parseInt(value, 10) || 0;
    } else if (field.name.includes(".")) {
      const [parent, child] = field.name.split(".");
      if (!result[parent]) result[parent] = {};
      (result[parent] as Record<string, unknown>)[child] = value;
    } else {
      result[field.name] = value;
    }
  }

  return result;
}

export function frontmatterToFormValues(frontmatter: Record<string, unknown>): Record<string, string> {
  const values: Record<string, string> = {};

  for (const [key, val] of Object.entries(frontmatter)) {
    if (Array.isArray(val)) {
      values[key] = val.join(", ");
    } else if (typeof val === "object" && val !== null) {
      for (const [childKey, childVal] of Object.entries(val as Record<string, unknown>)) {
        values[`${key}.${childKey}`] = String(childVal ?? "");
      }
    } else {
      values[key] = String(val ?? "");
    }
  }

  return values;
}
