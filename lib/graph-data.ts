import { getAllEntries, type Entry } from "@/lib/content";

export interface GraphNode {
  id: string;
  label: string;
  description: string;
  type: "core" | "entry";
  entryType?: Entry["type"];
  permalink?: string;
  status?: string;
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

const CORE_NODES: GraphNode[] = [
  { id: "now", label: "Now", description: "What I'm doing right now", type: "core", permalink: "/now" },
  { id: "projects", label: "Projects", description: "Things I'm building", type: "core", permalink: "/projects" },
  { id: "log", label: "Log", description: "Notes and observations", type: "core", permalink: "/log" },
  { id: "library", label: "Library", description: "Books and reading notes", type: "core", permalink: "/library" },
  { id: "principles", label: "Principles", description: "Working beliefs, revised over time", type: "core", permalink: "/principles" },
];

export function buildGraphData(): GraphData {
  const entries = getAllEntries();
  const entryIds = new Set(entries.map((e) => e.id));

  const entryNodes: GraphNode[] = entries.map((entry) => ({
    id: entry.id,
    label: "title" in entry && entry.title ? entry.title : entry.id,
    description: entry.description,
    type: "entry" as const,
    entryType: entry.type,
    permalink: entry.permalink,
    status: "status" in entry ? entry.status : undefined,
  }));

  const links: GraphLink[] = [];
  const linkSet = new Set<string>();

  const addLink = (source: string, target: string) => {
    const key = [source, target].sort().join("--");
    if (!linkSet.has(key)) {
      linkSet.add(key);
      links.push({ source, target });
    }
  };

  for (const entry of entries) {
    // Link entry to its core node(s)
    for (const core of entry.coreNodes) {
      addLink(entry.id, core);
    }

    // Link entry to connected entries
    for (const connId of entry.connections) {
      if (entryIds.has(connId)) {
        addLink(entry.id, connId);
      }
    }
  }

  return {
    nodes: [...CORE_NODES, ...entryNodes],
    links,
  };
}
