import type { ReactNode } from "react";
import { getDictionary } from "@/i18n/dictionaries";
import { PORTRAIT_URL, SITE_URL, SOCIALS, type Locale } from "@/lib/site";
import { fontVariables } from "./fonts";
import { ContactTab } from "./components/ContactTab";
import { JsonLd } from "./components/JsonLd";
import { MotionProvider } from "./motion/MotionProvider";
import { MOTION_BOOT_SCRIPT } from "./motion/preference";

// Document commun aux layouts racines FR (app/(fr)) et EN (app/(en)).
// Deux layouts racines permettent un <html lang> correct sans segment dynamique.
export function RootDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  const dict = getDictionary(locale);
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: "Wilfried NGUEGUIM",
    alternateName: "Jack0237",
    jobTitle: dict.meta.jobTitle,
    url: `${SITE_URL}/`,
    image: `${SITE_URL}${PORTRAIT_URL}`,
    sameAs: SOCIALS.map((s) => s.href),
  };

  return (
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT_SCRIPT }} />
        <JsonLd data={person} />
      </head>
      <body>
        <span id="top" />
        <a className="skip-link" href="#main">
          {dict.global.skip}
        </a>
        {children}
        <ContactTab label={dict.contactTab} />
        <MotionProvider />
      </body>
    </html>
  );
}
