import type { NextConfig } from "next";

// The R2 public host may one day move off *.r2.dev to a custom CDN
// domain — read it from env so next/image keeps optimizing without a
// code change when that happens.
function r2Host(): string | null {
  const raw =
    process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? process.env.R2_PUBLIC_URL ?? "";
  try {
    return raw ? new URL(raw).hostname : null;
  } catch {
    return null;
  }
}

const host = r2Host();
const remotePatterns: { protocol: "https"; hostname: string }[] = [
  { protocol: "https", hostname: "*.r2.dev" },
  { protocol: "https", hostname: "pub-*.r2.dev" },
];
if (host && !host.endsWith(".r2.dev")) {
  remotePatterns.push({ protocol: "https", hostname: host });
}

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
    remotePatterns,
  },
};

export default nextConfig;
