import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/supabase-proxy/:path*",
        destination: "https://hrnfujawxrmceibycmfo.supabase.co/:path*",
      },
    ];
  },
};

export default nextConfig;