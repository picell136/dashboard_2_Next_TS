import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: "/dashboard_2_Next_TS",
  assetPrefix: "/dashboard_2_Next_TS/",
};

export default nextConfig;