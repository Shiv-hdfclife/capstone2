import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: 'http://192.168.254.77:8089/:path*',
      },
    ];
  },
};

export default nextConfig;
