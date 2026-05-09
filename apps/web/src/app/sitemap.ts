import type { MetadataRoute } from "next";

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

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((route) => ({
    url: `https://kidscarlab.local${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
