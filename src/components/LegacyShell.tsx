import type { ReactNode } from "react";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/lib/site";
import { Footer } from "@/site/components/Footer";
import type { Alternates } from "@/site/components/LangSwitch";
import { Navbar } from "@/site/components/Navbar";
import "./legacy.css";

// Enveloppe des pages héritées : navbar et footer du nouveau socle, contenu d'origine.
// Les polices de l'ancien thème ne sont chargées que sur ces pages.
const LEGACY_FONTS =
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Manrope:wght@300;400;500;600;700&display=swap";
const LEGACY_ICONS =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";

export function LegacyShell({
  locale,
  alternates,
  current,
  children,
}: {
  locale: Locale;
  alternates: Alternates;
  current?: "projects" | "resume" | "blog";
  children: ReactNode;
}) {
  const dict = getDictionary(locale);
  return (
    <>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={LEGACY_FONTS} precedence="default" />
      <link rel="stylesheet" href={LEGACY_ICONS} precedence="default" />
      <Navbar locale={locale} dict={dict} alternates={alternates} current={current} />
      <main id="main" tabIndex={-1} className="legacy">
        {children}
      </main>
      <Footer locale={locale} dict={dict} alternates={alternates} />
    </>
  );
}
