import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wilfried NGUEGUIM | Jack0237",
    short_name: "Jack0237",
    description: "Dev full-stack & automatisation IA",
    start_url: "/",
    display: "browser",
    background_color: "#07090B",
    theme_color: "#07090B",
    lang: "fr",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
