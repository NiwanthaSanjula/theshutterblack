import type { NextConfig } from "next";
const cloundName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

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
