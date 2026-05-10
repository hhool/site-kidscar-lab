import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getPhase3ContentSnapshot } from "@/lib/phase3-content-service";

const routes = [
  "",
  "/reviews",
  "/rankings",
  "/products",
  "/news",
  "/about",
  "/compare",
  "/methodology",
  "/test-results",
  "/guides",
  "/brands",
  "/deals",
  "/community",
  "/auth/login",
  "/auth/register",
  "/account",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const snapshot = await getPhase3ContentSnapshot();
  const guideRoutes = snapshot.guides.map((guide) => `/guides/${guide.slug}`);
  const allRoutes = [...routes, ...guideRoutes];

  return allRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
