import { defineConfig, defineCollection, s } from "velite";

const timestamps = s.object({
  created: s.isodate(),
  updated: s.isodate().optional(),
});

const projects = defineCollection({
  name: "Project",
  pattern: "projects/*.mdx",
  schema: s.object({
    id: s.string(),
    title: s.string(),
    slug: s.slug("projects"),
    status: s.enum(["active", "shipped", "paused", "killed"]),
    tags: s.array(s.string()).default([]),
    connections: s.array(s.string()).default([]),
    dates: timestamps,
    description: s.string(),
    body: s.mdx(),
  }).transform((data) => ({
    ...data,
    type: "project" as const,
    coreNodes: ["projects"] as string[],
    permalink: `/projects/${data.slug}`,
  })),
});

const logs = defineCollection({
  name: "Log",
  pattern: "log/*.mdx",
  schema: s.object({
    id: s.string(),
    title: s.string().optional(),
    slug: s.slug("log"),
    tags: s.array(s.string()).default([]),
    connections: s.array(s.string()).default([]),
    dates: timestamps,
    description: s.string(),
    body: s.mdx(),
  }).transform((data) => ({
    ...data,
    type: "log" as const,
    coreNodes: ["log"] as string[],
    permalink: `/log#${data.slug}`,
  })),
});

const library = defineCollection({
  name: "Book",
  pattern: "library/*.mdx",
  schema: s.object({
    id: s.string(),
    title: s.string(),
    slug: s.slug("library"),
    author: s.string(),
    status: s.enum(["reading", "finished", "abandoned"]),
    tags: s.array(s.string()).default([]),
    connections: s.array(s.string()).default([]),
    dates: timestamps,
    description: s.string(),
    body: s.mdx(),
  }).transform((data) => ({
    ...data,
    type: "book" as const,
    coreNodes: ["library"] as string[],
    permalink: `/library#${data.slug}`,
  })),
});

const principles = defineCollection({
  name: "Principle",
  pattern: "principles/*.mdx",
  schema: s.object({
    id: s.string(),
    title: s.string(),
    slug: s.slug("principles"),
    tags: s.array(s.string()).default([]),
    connections: s.array(s.string()).default([]),
    revisedCount: s.number().default(0),
    dates: timestamps,
    description: s.string(),
    body: s.mdx(),
  }).transform((data) => ({
    ...data,
    type: "principle" as const,
    coreNodes: ["principles"] as string[],
    permalink: `/principles#${data.slug}`,
  })),
});

const now = defineCollection({
  name: "Now",
  pattern: "now.mdx",
  single: true,
  schema: s.object({
    updatedAt: s.isodate(),
    body: s.mdx(),
  }),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { projects, logs, library, principles, now },
});
