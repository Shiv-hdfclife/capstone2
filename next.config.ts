import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Partners API (existing)
      {
        source: "/api/partners/:path*",
        destination: "http://192.168.87.150:8088/partners/:path*", // Partners backend
      },
      // Raw Loaders API (new)
      {
        source: "/api/raw-loaders/:path*", 
        destination: "http://192.168.254.77:8088/raw-loaders/:path*", // Raw Loaders backend
      },
      // Loader Content API (new)
      {
        source: "/api/loader-content/:path*",
        destination: "http://192.168.254.77:8088/loader-content/:path*", // Loader Content backend
      },
      // Generic fallback for other APIs
      {
        source: "/api/:path*",
        destination: "http://192.168.254.77:8088/:path*", // Default backend
      },
    ];
  },
};

export default nextConfig;