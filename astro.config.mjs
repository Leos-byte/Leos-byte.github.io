import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

const [githubOwner, githubRepo] = process.env.GITHUB_REPOSITORY?.split("/") ?? [];
const isGitHubActions = process.env.GITHUB_ACTIONS === "true";
const isUserOrOrgPagesRepo = githubRepo?.endsWith(".github.io") ?? false;

function normalizeBase(value) {
  if (!value || value === "/") {
    return "/";
  }

  return `/${value.replace(/^\/+|\/+$/g, "")}`;
}

const base =
  process.env.BASE_PATH !== undefined
    ? normalizeBase(process.env.BASE_PATH)
    : isGitHubActions && githubRepo && !isUserOrOrgPagesRepo
      ? `/${githubRepo}`
      : "/";

const site =
  process.env.SITE?.trim() ||
  (githubOwner
    ? `https://${githubOwner}.github.io${base === "/" ? "" : base}/`
    : "http://localhost:4321");

export default defineConfig({
  site,
  base,
  trailingSlash: "always",
  integrations: [mdx(), sitemap()],
});
