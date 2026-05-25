const isGithubPages = process.env.GITHUB_PAGES === "true";
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isUserOrOrgSite = repositoryName.endsWith(".github.io");
const basePath =
  isGithubPages && repositoryName && !isUserOrOrgSite
    ? `/${repositoryName}`
    : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath,
  experimental: {
    typedRoutes: true
  }
};

export default nextConfig;
