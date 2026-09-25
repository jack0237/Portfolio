// Constantes publiques du site (aucun secret ici).
export const SITE_URL = "https://jack0237.com";
export const CONTACT_EMAIL = "jasonngueguim@gmail.com";
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;
export const RELANCEO_URL = "https://relanceo.cloud/";
export const CV_PATH = "/CV-Wilfried-NGUEGUIM.pdf";

export const SOCIALS = [
  { key: "github", label: "GitHub", href: "https://github.com/jack0237" },
  { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/ngueguim-wilfried/" },
  { key: "x", label: "X", href: "https://x.com/Jason_0237" },
] as const;

export const PORTRAIT_URL = "/images/portrait/portrait-desature-800.webp";

// Injectées au build par next.config.ts (données réelles, pas inventées).
export const BUILD_DATE_ISO = process.env.NEXT_PUBLIC_BUILD_DATE ?? new Date().toISOString();
export const CV_SIZE_BYTES = Number(process.env.NEXT_PUBLIC_CV_SIZE ?? "0");

export type Locale = "fr" | "en";

export const homePath = (locale: Locale) => (locale === "fr" ? "/" : "/en");
/** Chemin d'une page dans une langue donnée (slugs identiques, préfixe /en). */
export const localePath = (locale: Locale, path: string) =>
  locale === "fr" ? path : path === "/" ? "/en" : `/en${path}`;
