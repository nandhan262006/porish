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
    // AVIF first (best for photography), WebP fallback. The optimizer
    // serves whichever the browser accepts, so this is a pure win on
    // gallery pages that ship 100+ frames.
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
    // Optimized derivatives are content-addressed, so they never change:
    // cache hard and stop re-validating on every request.
    minimumCacheTTL: 60 * 60 * 24 * 365,
    remotePatterns,
  },
  async redirects() {
    return [
      { source: "/about", destination: "/about-us", permanent: true },
      { source: "/contact", destination: "/contact-us", permanent: true },
      { source: "/weddings", destination: "/wedding", permanent: true },
      { source: "/new-born", destination: "/newborn", permanent: true },
    ];
  },
};

export default nextConfig;
