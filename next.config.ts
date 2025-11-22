import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  sassOptions: {
    implementation: "dart-sass",
    api: "modern-compiler",
  },
};

export default nextConfig;
