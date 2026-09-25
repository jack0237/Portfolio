import type { ReactNode } from "react";
import "../globals.css";
import "../home.css";
import { RootDocument } from "@/site/RootDocument";
import { baseMetadata, baseViewport } from "@/site/metadata";

export const metadata = baseMetadata;
export const viewport = baseViewport;

// Layout racine français (URLs sans préfixe).
export default function FrenchRootLayout({ children }: { children: ReactNode }) {
  return <RootDocument locale="fr">{children}</RootDocument>;
}
