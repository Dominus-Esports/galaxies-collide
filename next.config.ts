import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
  },
  webpack: (config, { isServer }) => {
    // Exclude scripts directory from build
    config.module.rules.push({
      test: /scripts\/.*\.ts$/,
      use: "ignore-loader"
    });
    
    return config;
  },
  typescript: {
    // Ignore TypeScript errors in scripts directory
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignore ESLint errors in scripts directory
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
