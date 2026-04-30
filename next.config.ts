import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
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
