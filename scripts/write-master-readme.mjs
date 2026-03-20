import { execSync } from "node:child_process";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const distDir = path.join(repoRoot, "dist");
const siteUrl = "https://shamilkhedgikar.github.io/";

const run = (command) =>
  execSync(command, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();

const normalizeRepoUrl = (value) => {
  if (!value) return "";
  if (value.startsWith("git@github.com:")) {
    return `https://github.com/${value.slice("git@github.com:".length).replace(/\.git$/, "")}`;
  }
  return value.replace(/\.git$/, "");
};

const countTopLevelFiles = (relativeDir) => {
  const absoluteDir = path.join(repoRoot, relativeDir);
  return readdirSync(absoluteDir).filter((entry) =>
    statSync(path.join(absoluteDir, entry)).isFile(),
  ).length;
};

const extractAboutExcerpt = () => {
  const aboutPath = path.join(repoRoot, "src", "content", "profile", "about.md");
  const about = readFileSync(aboutPath, "utf8");
  const body = about.replace(/^---[\s\S]*?---\r?\n/, "").trim();
  const firstParagraph = body.split(/\r?\n\r?\n/)[0] ?? "";
  return firstParagraph
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
};

const deployedAt = new Date();
const deployedAtIso = deployedAt.toISOString();
const deployedAtUtc = deployedAt.toUTCString();
const sourceBranch = run("git rev-parse --abbrev-ref HEAD");
const sourceCommit = run("git rev-parse --short HEAD");
const sourceCommitFull = run("git rev-parse HEAD");
const sourceSubject = run("git log -1 --pretty=%s");
const repoUrl = normalizeRepoUrl(run("git config --get remote.origin.url"));
const branchUrl = repoUrl ? `${repoUrl}/tree/${sourceBranch}` : "";
const commitUrl = repoUrl ? `${repoUrl}/commit/${sourceCommitFull}` : "";

const projectCount = countTopLevelFiles(path.join("src", "content", "projects"));
const blogCount = countTopLevelFiles(path.join("src", "content", "blog"));
const timelineCount = countTopLevelFiles(path.join("src", "content", "timeline"));
const aboutExcerpt = extractAboutExcerpt();

const deploymentInfo = {
  siteUrl,
  deployedAtIso,
  deployedAtUtc,
  sourceBranch,
  sourceCommit,
  sourceCommitFull,
  sourceSubject,
  repoUrl,
  branchUrl,
  commitUrl,
  contentCounts: {
    projects: projectCount,
    blogPosts: blogCount,
    timelineEntries: timelineCount,
  },
};

const link = (label, url) => (url ? `[${label}](${url})` : label);
const branchLabel = `\`${sourceBranch}\``;
const commitLabel = `\`${sourceCommit}\``;

const readmeLines = [
  "# Shamil Khedgikar",
  "",
  `Generated deployment branch for [${siteUrl}](${siteUrl}).`,
  "",
  `> This branch is built from the Astro source on \`${sourceBranch}\`. Publish from the source branch with \`npm run deploy\`; do not edit generated files here directly.`,
  "",
  "## Last Deployment",
  "",
  "| Field | Value |",
  "| --- | --- |",
  `| Published at | ${deployedAtUtc} |`,
  `| Source branch | ${link(branchLabel, branchUrl)} |`,
  `| Source commit | ${link(commitLabel, commitUrl)} |`,
  `| Commit summary | ${sourceSubject} |`,
  "| Deployment metadata | [`deployment.json`](./deployment.json) |",
  "",
  "## Project Snapshot",
  "",
  aboutExcerpt,
  "",
  `- ${projectCount} project case studies`,
  `- ${timelineCount} timeline entries across work, education, and research`,
  `- ${blogCount} published blog posts plus an RSS feed`,
  "- Astro + MDX static site with custom timeline, project, and content components",
  "",
  "## Branch Role",
  "",
  "- `master` stores generated static output only.",
  `- \`${sourceBranch}\` is the source branch for content, components, and deployment config.`,
  "- GitHub Pages serves this branch from the repository root.",
  "",
];

writeFileSync(
  path.join(distDir, "deployment.json"),
  `${JSON.stringify(deploymentInfo, null, 2)}\n`,
  "utf8",
);
writeFileSync(path.join(distDir, "README.md"), `${readmeLines.join("\n")}\n`, "utf8");
