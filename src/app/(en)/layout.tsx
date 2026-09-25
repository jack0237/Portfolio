import type { ReactNode } from "react";
import "../globals.css";
import "../home.css";
import { RootDocument } from "@/site/RootDocument";
import { baseMetadata, baseViewport } from "@/site/metadata";

export const metadata = baseMetadata;
export const viewport = baseViewport;

// Layout racine anglais (URLs sous /en).
export default function EnglishRootLayout({ children }: { children: ReactNode }) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
