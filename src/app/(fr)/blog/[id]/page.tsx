import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import BlogPost from "@/components/Blog/BlogPost";
import { LegacyShell } from "@/components/LegacyShell";
import { getBlogPost, postDateISO } from "@/lib/firestore";
import { SITE_URL } from "@/lib/site";
import { JsonLd } from "@/site/components/JsonLd";

// Article : URL unique /blog/[id] (pas de /en/blog/[id], SEO 2.6), rendu serveur depuis Firestore,
// ISR 300 s, vraie 404 pour un identifiant inconnu. Le schéma écrit par n8n ne change pas.
export const revalidate = 300;

// Aucun article prérendu au build : chacun est rendu à la première visite puis mis en cache (ISR).
export async function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ id: string }> };

const loadPost = cache(async (id: string) => getBlogPost(id));

/** Début du contenu sans Markdown, coupé proprement vers 155 caractères (SEO 2.2). */
function describe(markdown: string | undefined): string | undefined {
  if (!markdown) return undefined;
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= 155) return text || undefined;
  const cut = text.slice(0, 155);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 100 ? cut.lastIndexOf(" ") : 155).trim()}…`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await loadPost(id);
  if (!post) return { title: "404", robots: { index: false, follow: true } };
  const url = `/blog/${encodeURIComponent(post.id)}`;
  const description = describe(post.content);
  const published = postDateISO(post);
  const image = post.image?.startsWith("http") ? post.image : undefined;
  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: "Jack0237",
      title: post.title,
      description,
      publishedTime: published,
      authors: [`${SITE_URL}/`],
      tags: post.tags,
      locale: post.lang === "fr" ? "fr_FR" : "en_US",
      images: image ? [{ url: image, alt: post.title }] : [{ url: "/og/og-home-fr.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@Jason_0237",
      title: post.title,
      description,
      images: image ? [image] : ["/og/og-home-fr.png"],
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const post = await loadPost(id);
  if (!post) notFound();

  const url = `${SITE_URL}/blog/${encodeURIComponent(post.id)}`;
  const published = postDateISO(post);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    ...(published ? { datePublished: published } : {}),
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#person` },
    ...(post.image?.startsWith("http") ? { image: post.image } : {}),
    inLanguage: post.lang || "en",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    ...(post.tags?.length ? { keywords: post.tags.map((t) => t.replace(/^#/, "")).join(", ") } : {}),
  };

  return (
    <LegacyShell locale="fr" alternates={{ fr: "/blog", en: "/en/blog" }} current="blog">
      <JsonLd data={jsonLd} />
      <BlogPost post={post} />
    </LegacyShell>
  );
}
