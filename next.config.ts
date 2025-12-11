import type { NextConfig } from "next";

const isDocker = process.env.DOCKER === 'true';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/uploads/image/:path*',
        destination: isDocker
          ? 'https://grayce-unvitriolized-rachael.ngrok-free.dev/uploads/image/:path*'
          : 'http://localhost:5000/uploads/image/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/uploads/image/:path*',
        headers: [
          {
            key: 'ngrok-skip-browser-warning',
            value: 'true',
          },
        ],
      },
    ];
  }
};

export default nextConfig;
