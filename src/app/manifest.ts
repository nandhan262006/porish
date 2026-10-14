import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Phorish Shoots — Wedding Photographer in Nizamabad",
    short_name: "Phorish Shoots",
    description:
      "Documentary wedding, pre-wedding, newborn, toddler & modeling photography across Telangana & India.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f1ea",
    theme_color: "#1a1410",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
