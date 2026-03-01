import { projects, logs, library, principles, now } from "#site/content";

export { projects, logs, library, principles, now };

export type Project = (typeof projects)[number];
export type Log = (typeof logs)[number];
export type Book = (typeof library)[number];
export type Principle = (typeof principles)[number];
export type Entry = Project | Log | Book | Principle;

export function getAllEntries(): Entry[] {
  return [
    ...projects,
    ...logs,
    ...library,
    ...principles,
  ];
}

export function getEntryById(id: string): Entry | undefined {
  return getAllEntries().find((entry) => entry.id === id);
}

export function getEntriesByTag(tag: string): Entry[] {
  return getAllEntries().filter((entry) => entry.tags.includes(tag));
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const entry of getAllEntries()) {
    for (const tag of entry.tags) {
      tags.add(tag);
    }
  }
  return Array.from(tags).sort();
}
