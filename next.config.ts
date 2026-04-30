import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/pos-terminal",
        destination: "/sales/pos",
      },
    ];
  },
};
export default nextConfig;
