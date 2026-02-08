import type { NextConfig } from "next";

// GitHub Pages serves project sites at /<repo-name>/; set BASE_PATH in CI to match
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
