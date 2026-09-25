import type { Dictionary } from "@/i18n/dictionaries";
import type { BlogPost } from "@/lib/firestore";
import type { Locale } from "@/lib/site";
import { Icon } from "@/site/components/Icon";
import { Scene } from "./Scene";

const FALLBACKS = ["grille", "fil", "brume"] as const;

function formatDate(post: BlogPost, locale: Locale) {
  if (post.timestamp) {
    const d = new Date(post.timestamp);
    return {
      iso: d.toISOString().slice(0, 10),
      label: new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "Europe/Paris",
      }).format(d),
    };
  }
  return post.date ? { iso: undefined, label: post.date } : null;
}

function formatReadTime(value: BlogPost["readTime"], suffix: string) {
  if (value === undefined) return null;
  const n = typeof value === "number" ? value : /^\s*\d+\s*$/.test(value) ? Number(value) : NaN;
  if (Number.isFinite(n)) return `${String(n).padStart(2, "0")} ${suffix}`;
  return String(value); // déjà du texte (« 05 MIN READ ») : affiché tel quel
}

function Visual({ post, index }: { post: BlogPost; index: number }) {
  if (post.image && /^https:\/\//.test(post.image)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={post.image} alt="" width={640} height={360} loading="lazy" decoding="async" />;
  }
  const seed = post.timestamp ?? index;
  const name = FALLBACKS[seed % FALLBACKS.length];
  return (
    <picture>
      <source type="image/avif" srcSet={`/images/blog/blog-fallback-${name}.avif`} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/images/blog/blog-fallback-${name}.webp`} alt="" width={1600} height={900} loading="lazy" decoding="async" />
    </picture>
  );
}

// Scène 05, « Le journal de bord » (DESIGN 7.10) : 3 derniers articles lus côté serveur (ISR).
// Liste en entrées de journal, pas une grille de cartes. États vide et erreur identiques.
export function BlogScene({
  dict,
  locale,
  posts,
}: {
  dict: Dictionary;
  locale: Locale;
  posts: BlogPost[];
}) {
  const b = dict.home.blog;
  const blogHref = locale === "fr" ? "/blog" : "/en/blog";

  return (
    <Scene
      id="blog"
      step={5}
      label={dict.home.steps[4]}
      title={b.title}
      titleId="blog-title"
      tone="panel"
      bandsFrom="bg"
      className="blog"
      aside={<p className="voice scene__voice" data-reveal>{b.voice}</p>}
    >
      {posts.length ? (
        <ol className="journal" role="list">
          {posts.map((post, i) => {
            const date = formatDate(post, locale);
            const read = formatReadTime(post.readTime, b.minRead);
            const postLang = post.lang === "fr" || post.lang === "en" ? post.lang : "en";
            const otherLang = postLang !== locale;
            return (
              <li key={post.id} className="journal__item" data-reveal>
                <a className="entry" href={`/blog/${encodeURIComponent(post.id)}`} aria-label={`${b.readAria} ${post.title}`}>
                  <span className="entry__dot" aria-hidden="true" />
                  <span className="entry__meta">
                    <span className="meta">
                      {date ? <time dateTime={date.iso}>{date.label}</time> : null}
                      {date && read ? " · " : null}
                      {read}
                    </span>
                    {post.eyebrow ? <span className="meta entry__eyebrow">{post.eyebrow}</span> : null}
                  </span>
                  <span className="entry__visual">
                    <Visual post={post} index={i} />
                  </span>
                  <span className="entry__body">
                    <h3 className="h3 entry__title" lang={postLang}>
                      {post.title}
                    </h3>
                    <span className="entry__tags meta">
                      {otherLang ? (
                        <span className="entry__badge" aria-label={b.otherLangAria}>
                          {b.otherLangBadge}
                        </span>
                      ) : null}
                      {post.tags?.slice(0, 3).map((t) => (
                        <span key={t}>{t.startsWith("#") ? t : `#${t}`}</span>
                      ))}
                    </span>
                  </span>
                  <span className="entry__read" aria-hidden="true">
                    {b.read}
                    <Icon name="arrow-right" className="icon--slide" />
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="journal journal--empty" data-reveal>
          <p className="voice">{b.empty}</p>
        </div>
      )}
      <p className="scene__end scene__end--right" data-reveal>
        <a className="link" href={blogHref}>
          {posts.length ? b.all : b.emptyLink}
          <Icon name="arrow-right" className="icon--slide" />
        </a>
      </p>
    </Scene>
  );
}
