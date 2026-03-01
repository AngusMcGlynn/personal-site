import { Octokit } from "@octokit/rest";

function getOctokit() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN not set");
  return new Octokit({ auth: token });
}

function getRepo() {
  const repo = process.env.GITHUB_REPO;
  if (!repo) throw new Error("GITHUB_REPO not set");
  const [owner, name] = repo.split("/");
  return { owner, repo: name };
}

export type ContentType = "projects" | "log" | "library" | "principles" | "now";

const CONTENT_PATHS: Record<ContentType, string> = {
  projects: "content/projects",
  log: "content/log",
  library: "content/library",
  principles: "content/principles",
  now: "content",
};

export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
}

export interface GitHubFileContent extends GitHubFile {
  content: string;
}

export async function listFiles(type: ContentType): Promise<GitHubFile[]> {
  const octokit = getOctokit();
  const { owner, repo } = getRepo();
  const dirPath = CONTENT_PATHS[type];

  if (type === "now") {
    try {
      const { data } = await octokit.repos.getContent({ owner, repo, path: "content/now.mdx" });
      if (!Array.isArray(data) && data.type === "file") {
        return [{ name: data.name, path: data.path, sha: data.sha }];
      }
    } catch {
      return [];
    }
    return [];
  }

  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path: dirPath });
    if (Array.isArray(data)) {
      return data
        .filter((f) => f.type === "file" && f.name.endsWith(".mdx"))
        .map((f) => ({ name: f.name, path: f.path, sha: f.sha }));
    }
  } catch {
    return [];
  }
  return [];
}

export async function getFile(path: string): Promise<GitHubFileContent> {
  const octokit = getOctokit();
  const { owner, repo } = getRepo();

  const { data } = await octokit.repos.getContent({ owner, repo, path });
  if (Array.isArray(data) || data.type !== "file") {
    throw new Error(`Expected file at ${path}`);
  }

  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return { name: data.name, path: data.path, sha: data.sha, content };
}

export async function createFile(path: string, content: string, message: string) {
  const octokit = getOctokit();
  const { owner, repo } = getRepo();

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: Buffer.from(content).toString("base64"),
  });
}

export async function updateFile(path: string, content: string, sha: string, message: string) {
  const octokit = getOctokit();
  const { owner, repo } = getRepo();

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: Buffer.from(content).toString("base64"),
    sha,
  });
}

export async function deleteFile(path: string, sha: string, message: string) {
  const octokit = getOctokit();
  const { owner, repo } = getRepo();

  await octokit.repos.deleteFile({ owner, repo, path, message, sha });
}
