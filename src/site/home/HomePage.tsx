import { getDictionary } from "@/i18n/dictionaries";
import { getLatestPosts } from "@/lib/api";
import { SITE_URL, BUILD_DATE_ISO, type Locale } from "@/lib/site";
import { Footer } from "@/site/components/Footer";
import { JsonLd } from "@/site/components/JsonLd";
import { Navbar } from "@/site/components/Navbar";
import { BlogScene } from "./BlogScene";
import { ContactScene } from "./ContactScene";
import { HeroScene } from "./HeroScene";
import { ProjectsScene } from "./ProjectsScene";
import { ServicesScene } from "./ServicesScene";
import { StackScene } from "./StackScene";

const ALTERNATES = { fr: "/", en: "/en" };

// Accueil : l'expédition en six scènes (DESIGN.md 7), FR à « / », EN à « /en ».
export async function HomePage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const posts = await getLatestPosts(3);
  const url = locale === "fr" ? `${SITE_URL}/` : `${SITE_URL}/en`;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "Jack0237",
        alternateName: "Wilfried NGUEGUIM",
        url: `${SITE_URL}/`,
        inLanguage: ["fr", "en"],
        publisher: { "@id": `${SITE_URL}/#person` },
      },
      {
        "@type": "ProfilePage",
        url,
        inLanguage: locale,
        mainEntity: { "@id": `${SITE_URL}/#person` },
        dateModified: BUILD_DATE_ISO,
      },
    ],
  };

  return (
    <>
      <JsonLd data={graph} />
      <Navbar locale={locale} dict={dict} alternates={ALTERNATES} steps={6} />
      <main id="main" tabIndex={-1}>
        <HeroScene dict={dict} />
        <div className="journey">
          <div className="thread" aria-hidden="true">
            <span className="thread__line" />
          </div>
          <ProjectsScene dict={dict} locale={locale} />
          <ServicesScene dict={dict} />
          <StackScene dict={dict} />
          <BlogScene dict={dict} locale={locale} posts={posts} />
          <ContactScene dict={dict} locale={locale} />
        </div>
      </main>
      <Footer locale={locale} dict={dict} alternates={ALTERNATES} />
    </>
  );
}
