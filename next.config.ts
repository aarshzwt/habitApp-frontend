import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/uploads/image/:path*',
        destination: 'http://localhost:5000/uploads/image/:path*',
      },
    ];
  },
};

export default nextConfig;
