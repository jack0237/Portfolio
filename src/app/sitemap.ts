import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/api";
import { BUILD_DATE_ISO, SITE_URL } from "@/lib/site";

// Même période que le blog : les articles publiés par n8n entrent au sitemap sans rebuild (SEO 2.4).
export const revalidate = 300;

// Pages FR / EN avec alternates réciproques + x-default ; articles à URL unique ; /admin exclu.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date(BUILD_DATE_ISO);
  const pairs: Array<{ fr: string; en: string; priority: number; changeFrequency: "weekly" | "monthly" }> = [
    { fr: "/", en: "/en", priority: 1, changeFrequency: "weekly" },
    { fr: "/projects", en: "/en/projects", priority: 0.8, changeFrequency: "monthly" },
    { fr: "/resume", en: "/en/resume", priority: 0.7, changeFrequency: "monthly" },
    { fr: "/blog", en: "/en/blog", priority: 0.7, changeFrequency: "weekly" },
  ];

  const pages: MetadataRoute.Sitemap = pairs.flatMap(({ fr, en, priority, changeFrequency }) => {
    const languages = { fr: `${SITE_URL}${fr}`, en: `${SITE_URL}${en}`, "x-default": `${SITE_URL}${fr}` };
    return [
      { url: `${SITE_URL}${fr}`, lastModified, changeFrequency, priority, alternates: { languages } },
      { url: `${SITE_URL}${en}`, lastModified, changeFrequency, priority: priority - 0.1, alternates: { languages } },
    ];
  });

  const posts = await getBlogPosts();
  const articles: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/blog/${encodeURIComponent(p.id)}`,
    lastModified: p.timestamp ? new Date(p.timestamp) : lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...pages, ...articles];
}
