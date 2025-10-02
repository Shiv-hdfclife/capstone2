import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://192.168.254.77:8088/:path*", // proxy to backend
      },
    ];
  },
};

export default nextConfig;