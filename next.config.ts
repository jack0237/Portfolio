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

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BUILD_DATE: new Date().toISOString(),
    NEXT_PUBLIC_CV_SIZE: String(cvSize),
  },
  poweredByHeader: false,
  experimental: {
    // Plusieurs layouts racines (FR, EN, pages héritées, admin) : 404 globale unique.
    globalNotFound: true,
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
