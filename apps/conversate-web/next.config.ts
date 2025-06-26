import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    resolveAlias: {
      '@': './src',
      '@mumicah/shared': '../../packages/shared/src',
      '@mumicah/ui': '../../packages/ui/src',
    },
  },
  // Transpile workspace packages
  transpilePackages: ['@mumicah/shared', '@mumicah/ui'],
};

export default nextConfig;
