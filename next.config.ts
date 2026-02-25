import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow unoptimized local images in /public (no external domains needed)
    unoptimized: false,
  },
};

export default nextConfig;
