import type { NextConfig } from "next";

const nextConfig = {
  /* config options here */
  // output: "standalone",
  reactCompiler: true,
  async headers() {
    return [
      {
        source: "/project/:path*",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
        ],
      },
      {
        source: "/webcontainer/connect/:path*",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "unsafe-none",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "unsafe-none",
          },
        ],
      },
    ];
  },
} as NextConfig;

export default nextConfig;
