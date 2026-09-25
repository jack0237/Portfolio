import localFont from "next/font/local";

// Auto-hébergées (OFL 1.1), aucun appel à Google Fonts. DESIGN.md 3.1, ASSETS.md 2.
// Seule Mona Sans est préchargée : le mot géant du hero est l'élément LCP.
export const mona = localFont({
  src: "../fonts/mona-sans-var-latin.woff2",
  weight: "200 900",
  style: "normal",
  variable: "--font-mona",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
  declarations: [{ prop: "font-stretch", value: "75% 125%" }],
});

export const newsreader = localFont({
  src: "../fonts/newsreader-italic-var-fr.woff2",
  weight: "200 800",
  style: "italic",
  variable: "--font-voice",
  display: "swap",
  preload: false,
  adjustFontFallback: "Times New Roman",
});

export const jetbrains = localFont({
  src: "../fonts/jetbrains-mono-400-fr.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-mono",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  fallback: ["ui-monospace", "Consolas", "monospace"],
});

export const fontVariables = `${mona.variable} ${newsreader.variable} ${jetbrains.variable}`;
