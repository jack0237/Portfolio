import type { NextConfig } from "next";
import { statSync } from "node:fs";
import { join } from "node:path";

const BLOG_HOST = "blog.jack0237.com";

// Données réelles calculées au build : date de mise à jour (footer, JSON-LD)
// et poids du CV (scène finale). Aucune valeur inventée si le fichier manque.
let cvSize = 0;
try {
  cvSize = statSync(join(process.cwd(), "public", "CV-Wilfried-NGUEGUIM.pdf")).size;
} catch {
  cvSize = 0;
}

// Config Firebase : on réutilise les variables REACT_APP_FIREBASE_* déjà définies
// dans Vercel pour le site CRA. Next.js n'expose au navigateur que les NEXT_PUBLIC_*,
// d'où ce relais au build. Un NEXT_PUBLIC_* défini explicitement reste prioritaire.
const FIREBASE_KEYS = [
  "API_KEY",
  "AUTH_DOMAIN",
  "PROJECT_ID",
  "STORAGE_BUCKET",
  "MESSAGING_SENDER_ID",
  "APP_ID",
  "MEASUREMENT_ID",
];
const firebaseEnv: Record<string, string> = {};
for (const key of FIREBASE_KEYS) {
  const value =
    process.env[`NEXT_PUBLIC_FIREBASE_${key}`] ?? process.env[`REACT_APP_FIREBASE_${key}`];
  if (value) firebaseEnv[`NEXT_PUBLIC_FIREBASE_${key}`] = value;
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    ...firebaseEnv,
    NEXT_PUBLIC_BUILD_DATE: new Date().toISOString(),
    NEXT_PUBLIC_CV_SIZE: String(cvSize),
  },
  poweredByHeader: false,
  experimental: {
    // Plusieurs layouts racines (FR, EN, pages héritées, admin) : 404 globale unique.
    globalNotFound: true,
  },
  images: {
    // Images d'articles écrites par n8n / l'admin (Firebase Storage ou URL externe).
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "**" },
    ],
  },
  async redirects() {
    return [
      // CV et certifications fusionnés (SEO.md 2.4) : l'ancienne URL mène à la section.
      { source: "/certifications", destination: "/resume#certifications", permanent: true },
      { source: "/en/certifications", destination: "/en/resume#certifications", permanent: true },
      // blog.jack0237.com devient une simple redirection vers /blog (SEO.md 2.6, option A).
      {
        source: "/",
        has: [{ type: "host", value: BLOG_HOST }],
        destination: "https://jack0237.com/blog",
        permanent: true,
      },
      {
        source: "/:path+",
        has: [{ type: "host", value: BLOG_HOST }],
        destination: "https://jack0237.com/blog/:path+",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
