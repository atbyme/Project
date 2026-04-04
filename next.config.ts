import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.72", "192.168.1.67"],
  serverExternalPackages: ["@heyputer/puter.js"],
};

export default nextConfig;
