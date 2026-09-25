import type { Metadata, Viewport } from "next";
import { getDictionary } from "@/i18n/dictionaries";
import { SITE_URL, type Locale } from "@/lib/site";

export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Wilfried NGUEGUIM | Jack0237", template: "%s | Jack0237" },
  applicationName: "Jack0237",
  authors: [{ name: "Wilfried NGUEGUIM", url: SITE_URL }],
  creator: "Wilfried NGUEGUIM",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  formatDetection: { telephone: false },
};

export const baseViewport: Viewport = {
  themeColor: "#07090B",
  colorScheme: "dark",
};

/** Métadonnées de l'Accueil (SEO.md 3.2, CONTENT.md 0) : hreflang réciproques + x-default. */
export function homeMetadata(locale: Locale): Metadata {
  const m = getDictionary(locale).meta;
  const url = locale === "fr" ? "/" : "/en";
  return {
    title: { absolute: m.title },
    description: m.description,
    alternates: {
      canonical: url,
      languages: { fr: "/", en: "/en", "x-default": "/" },
    },
    openGraph: {
      type: "website",
      url,
      siteName: "Jack0237",
      title: m.title,
      description: m.ogDescription,
      locale: m.ogLocale,
      alternateLocale: locale === "fr" ? ["en_US"] : ["fr_FR"],
      images: [
        {
          url: `/og/og-home-${locale}.png`,
          width: 1200,
          height: 630,
          alt: m.ogAlt,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@Jason_0237",
      title: m.title,
      description: m.ogDescription,
      images: [{ url: `/og/og-home-${locale}.png`, alt: m.ogAlt }],
    },
  };
}

type PageKey = "projects" | "resume" | "blog";

// Pages héritées portées (SEO.md 2.2). Titres : propositions de seo-strategist ;
// descriptions provisoires, à finaliser par content-writer avec la refonte de chaque page.
const PAGES: Record<PageKey, Record<Locale, { title: string; description: string }>> = {
  projects: {
    fr: {
      title: "Projets de Wilfried NGUEGUIM, SaaS et automatisations",
      description:
        "Projets de Wilfried NGUEGUIM (Jack0237) : applications web, SaaS et automatisations n8n et IA, avec les liens vers les réalisations en ligne.",
    },
    en: {
      title: "Wilfried NGUEGUIM projects: SaaS and automations",
      description:
        "Projects by Wilfried NGUEGUIM (Jack0237): web apps, SaaS products and n8n / AI automations, with links to the live work.",
    },
  },
  resume: {
    fr: {
      title: "CV de Wilfried NGUEGUIM, développeur full-stack",
      description:
        "CV de Wilfried NGUEGUIM (Jack0237), développeur full-stack : expériences, compétences techniques et certifications, avec le CV PDF à télécharger.",
    },
    en: {
      title: "Wilfried NGUEGUIM resume, full-stack developer",
      description:
        "Resume of Wilfried NGUEGUIM (Jack0237), full-stack developer: experience, technical skills and certifications, with the PDF resume to download.",
    },
  },
  blog: {
    fr: {
      title: "Blog de Jack0237 : automatisation, IA et dev web",
      description:
        "Blog de Jack0237 (Wilfried NGUEGUIM) : articles sur l'automatisation, l'intelligence artificielle et le développement web.",
    },
    en: {
      title: "Jack0237 blog: automation, AI and web development",
      description:
        "Jack0237 blog by Wilfried NGUEGUIM: articles about automation, artificial intelligence and web development.",
    },
  },
};

/** Métadonnées d'une page portée : canonical propre à la langue, hreflang réciproques + x-default. */
export function pageMetadata(key: PageKey, locale: Locale): Metadata {
  const { title, description } = PAGES[key][locale];
  const fr = `/${key}`;
  const en = `/en/${key}`;
  const url = locale === "fr" ? fr : en;
  const ogAlt = getDictionary(locale).meta.ogAlt;
  return {
    title,
    description,
    alternates: { canonical: url, languages: { fr, en, "x-default": fr } },
    openGraph: {
      type: "website",
      url,
      siteName: "Jack0237",
      title,
      description,
      locale: locale === "fr" ? "fr_FR" : "en_US",
      alternateLocale: locale === "fr" ? ["en_US"] : ["fr_FR"],
      images: [{ url: `/og/og-home-${locale}.png`, width: 1200, height: 630, alt: ogAlt, type: "image/png" }],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@Jason_0237",
      title,
      description,
      images: [{ url: `/og/og-home-${locale}.png`, alt: ogAlt }],
    },
  };
}
