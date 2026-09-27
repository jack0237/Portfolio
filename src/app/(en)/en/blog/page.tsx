import Blog from "@/components/Blog/Blog";
import { LegacyShell } from "@/components/LegacyShell";
import { getBlogPosts } from "@/lib/api";
import { pageMetadata } from "@/site/metadata";

// Liste du blog (page héritée, refonte à venir). Lue côté serveur, ISR : les articles
// publiés par n8n apparaissent sans rebuild. Les articles ont une URL unique /blog/[id] (SEO 2.6).
export const revalidate = 300;
export const metadata = pageMetadata("blog", "en");

export default async function Page() {
  const posts = await getBlogPosts({ withContent: true });
  return (
    <LegacyShell locale="en" alternates={{ fr: "/blog", en: "/en/blog" }} current="blog">
      <Blog posts={posts} emptyLabel="No articles published yet." />
    </LegacyShell>
  );
}
