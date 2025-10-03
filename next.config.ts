
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [


      // {
      //   source: "/api/partners/:path*",
      //   destination: "http://192.168.87.150:8088/partners/:path*", // Partners backend
      // },

      // // Raw Loaders API - Route to the correct backend
      // {
      //   source: "/api/partners/raw-loaders",
      //   destination: "http://192.168.254.74:8989/api/partners/raw-loaders",
      // },
      // {
      //   source: "/api/partners/raw-loaders/:id/download",
      //   destination: "http://192.168.254.74:8989/api/partners/raw-loaders/:id/download",
      // },
      // Partners management (existing)
      {
        // source: "/api/partners/:path*", 
        // destination: "http://192.168.87.150:8088/partners/:path*",
        source: '/api/backend/:path*',
        destination: 'http://192.168.254.77:8088/:path*',
      },
    ];
  },
};

export default nextConfig;
