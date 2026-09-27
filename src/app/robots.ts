import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Tout autorisé. /admin n'est pas bloqué ici : il sera protégé par noindex (SEO.md 2.4).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
