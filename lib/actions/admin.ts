"use server";

import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/admin/auth";
import {
  getFile,
  createFile,
  updateFile,
  deleteFile,
  type ContentType,
} from "@/lib/admin/github";
import { formDataToFrontmatter, serializeMDX } from "@/lib/admin/mdx";

const CONTENT_PATHS: Record<ContentType, string> = {
  projects: "content/projects",
  log: "content/log",
  library: "content/library",
  principles: "content/principles",
  now: "content",
};

export async function loginAction(
  _prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const password = formData.get("password") as string;
  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: "Invalid password" };
  }
  await createSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

export async function createEntryAction(
  _prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const type = formData.get("_type") as ContentType;
  const body = formData.get("_body") as string;
  const slug = formData.get("slug") as string;

  if (!type || !slug) return { error: "Type and slug are required" };

  const frontmatter = formDataToFrontmatter(formData, type);
  const content = serializeMDX(frontmatter, body || "");
  const path = `${CONTENT_PATHS[type]}/${slug}.mdx`;

  try {
    await createFile(path, content, `Create ${type}: ${slug}`);
  } catch (e) {
    return { error: `Failed to create: ${(e as Error).message}` };
  }

  redirect(`/admin`);
}

export async function updateEntryAction(
  _prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const path = formData.get("_path") as string;
  const sha = formData.get("_sha") as string;
  const type = formData.get("_type") as ContentType;
  const body = formData.get("_body") as string;

  if (!path || !sha || !type) return { error: "Missing required fields" };

  const frontmatter = formDataToFrontmatter(formData, type);
  const content = serializeMDX(frontmatter, body || "");

  try {
    await updateFile(path, content, sha, `Update ${type}: ${path}`);
  } catch (e) {
    return { error: `Failed to update: ${(e as Error).message}` };
  }

  redirect("/admin");
}

export async function deleteEntryAction(formData: FormData): Promise<void> {
  const path = formData.get("path") as string;
  const sha = formData.get("sha") as string;

  if (!path || !sha) return;

  await deleteFile(path, sha, `Delete: ${path}`);
  redirect("/admin");
}
