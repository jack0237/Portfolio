import type { Locale } from "@/lib/site";

export type Alternates = Record<Locale, string>;

// Liens réels vers la version traduite (pas un état JS), DESIGN 5.1 et SEO 2.1.
export function LangSwitch({
  locale,
  alternates,
  groupLabel,
}: {
  locale: Locale;
  alternates: Alternates;
  groupLabel: string;
}) {
  return (
    <div className="lang" role="group" aria-label={groupLabel}>
      <a
        href={alternates.fr}
        hrefLang="fr"
        lang="fr"
        aria-label="Version française"
        aria-current={locale === "fr" ? "true" : undefined}
      >
        FR
      </a>
      <a
        href={alternates.en}
        hrefLang="en"
        lang="en"
        aria-label="English version"
        aria-current={locale === "en" ? "true" : undefined}
      >
        EN
      </a>
    </div>
  );
}
