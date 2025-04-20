import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Disables ESLint during production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disables TypeScript errors during production builds
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
