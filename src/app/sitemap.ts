import type { MetadataRoute } from "next";
import { getGalleries } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes = ["", "/about", "/contact"].map(
    (route) => ({
      url: `${SITE_URL}${route || "/"}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    }),
  );
  const galleryRoutes = (await getGalleries()).map((g) => ({
    url: `${SITE_URL}/${g.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));
  return [...staticRoutes, ...galleryRoutes];
}
