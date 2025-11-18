import type { NextConfig } from "next";

const isDocker = process.env.DOCKER === 'true';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/uploads/image/:path*',
        destination: isDocker
          ? 'http://backend:5000/uploads/image/:path*'
          : 'http://localhost:5000/uploads/image/:path*',
      },
      // {
      //   source: '/image/:path*',
      //   destination: isDocker
      //     ? 'http://backend:5000/uploads/image/:path*'
      //     : 'http://localhost:5000/uploads/image/:path*',
      // },
    ];
  },
};

export default nextConfig;
