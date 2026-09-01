import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";
const repositoryName = "qa-random";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isProduction ? `/${repositoryName}` : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
