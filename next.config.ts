import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'lh3.googleusercontent.com', // Google profile images
      'platform-lookaside.fbsbx.com', // Facebook profile images
      'pbs.twimg.com', // Twitter profile images
      'graph.facebook.com', // Facebook profile pictures
    ],
  },
};

export default nextConfig;
