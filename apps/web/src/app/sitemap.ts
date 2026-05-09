import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

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
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
