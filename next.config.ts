import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/c5xa2ibf/image/upload/**",
      },
    ],
  },
};

export default nextConfig;
